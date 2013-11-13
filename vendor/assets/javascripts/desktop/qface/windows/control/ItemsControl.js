/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare",
	"qface/windows/control/Control",
	"qface/windows/control/ItemsCollection"
],function(declare,Control,ItemsCollection) {
pkg.BaseList = Class(pkg.Panel, pkg.MouseListener, pkg.KeyListener, Position.PositionMetric, [

    function $prototype() {
        this.gap = 2;

        this.setValue = function(v) {
            if (v == null) {
                this.select(-1);
                return;
            }

            for(var i=0; i<this.model.count(); i++) {
                if (this.model.get(i) == v) {
                    this.select(i);
                    return;
                }
            }

            throw new Error("Invalid value : " + v);
        };

        this.getValue = function(v) { return this.getSelected(); };
        this.getItemGap = function() { return this.gap; };

        this.getSelected = function(){
            return this.selectedIndex < 0 ? null
                                          : this.model.get(this.selectedIndex);
        };

        this.lookupItem = function(ch){
            var count = this.model.count();
            if(zebra.util.isLetter(ch) && count > 0){
                var index = this.selectedIndex < 0 ? 0 : this.selectedIndex + 1;
                ch = ch.toLowerCase();
                for(var i = 0;i < count - 1; i++){
                    var idx = (index + i) % count, item = this.model.get(idx).toString();
                    if(item.length > 0 && item[0].toLowerCase() == ch) return idx;
                }
            }
            return -1;
        };

        this.isSelected = function(i) { return i == this.selectedIndex; };

        this.correctPM = function(x,y){
            if (this.isComboMode){
                var index = this.getItemIdxAt(x, y);
                if (index >= 0 && index != this.position.offset) {
                    this.position.setOffset(index);
                    this.notifyScrollMan(index);
                }
            }
        };

        this.getItemLocation = function(i) {
            this.validate();
            var gap = this.getItemGap(), y = this.getTop() + this.scrollManager.getSY() + gap;
            for(var i = 0;i < index; i++) y += (this.getItemSize(i).height + 2 * gap);
            return { x:this.getLeft(), y:y };
        };

        this.getItemSize = function (i){
            return this.provider.getView(this, this.model.get(i)).getPreferredSize();
        };

        this.mouseMoved   = function(e){ this.correctPM(e.x, e.y); };

        this.getLines     = function() { return this.model.count();};
        this.getLineSize  = function(l){ return 1; };
        this.getMaxOffset = function (){ return this.getLines() - 1; };
        this.canHaveFocus = function (){ return true; };

        this.catchScrolled = function(psx,psy){ this.repaint();};
        this.getItemIdxAt  = function(x,y){ return -1;};

        this.calcMaxItemSize = function (){
            var maxH = 0, maxW = 0;
            this.validate();
            for(var i = 0;i < this.model.count(); i ++ ){
                var is = this.getItemSize(i);
                if(is.height > maxH) maxH = is.height;
                if(is.width  > maxW) maxW = is.width;
            }
            return { width:maxW, height:maxH };
        };

        this.repaintByOffsets = function(p,n){
            this.validate();
            var xx = this.width - this.getRight(),
                gap = this.getItemGap(),
                count = this.model.count();

            if (p >= 0 && p < count){
                var l = this.getItemLocation(p), x = l.x - gap;
                this.repaint(x, l.y - gap, xx - x, this.getItemSize(p).height + 2 * gap);
            }

            if (n >= 0 && n < count){
                var l = this.getItemLocation(n), x = l.x - gap;
                this.repaint(x, l.y - gap, xx - x, this.getItemSize(n).height + 2 * gap);
            }
        };

        this.update = function(g) {
            if (this.selectedIndex >= 0 && this.views["select"] != null){
                var gap = this.getItemGap(),
                    is = this.getItemSize(this.selectedIndex),
                    l = this.getItemLocation(this.selectedIndex);

                this.drawSelMarker(g, l.x - gap, l.y - gap,
                                   is.width + 2 * gap,
                                   is.height + 2 * gap);
            }
        };

        this.paintOnTop = function(g) {
            if (this.views["marker"] != null && (this.isComboMode || this.hasFocus())){
                var offset = this.position.offset;
                if(offset >= 0){
                    var gap = this.getItemGap(), is = this.getItemSize(offset), l = this.getItemLocation(offset);
                    this.drawPosMarker(g, l.x - gap, l.y - gap, is.width  + 2 * gap, is.height + 2 * gap);
                }
            }
        };

        this.select = function(index){
            if(index >= this.model.count()){
                throw new Error("index=" + index + ",max=" + this.model.count());
            }

            if (this.selectedIndex != index){
                var prev = this.selectedIndex;
                this.selectedIndex = index;
                this.notifyScrollMan(index);
                this.repaintByOffsets(prev, this.selectedIndex);
                this._.fired(this, prev);
            }
            else {
                this._.fired(this, null);
            }
        };

        this.mouseClicked = function(e) {
            if (e.isActionMask()) {
                this.select(this.position.offset < 0 ? 0 : this.position.offset);
            }
        };

        this.mouseReleased = function(e){
            if (e.isActionMask() && this.position.offset != this.selectedIndex) {
                this.position.setOffset(this.selectedIndex);
            }
        };

        this.mousePressed = function(e){
            if (e.isActionMask()) { //&& this.isComboMode === false) {
                var index = this.getItemIdxAt(e.x, e.y);
                if (index >= 0 && this.position.offset != index) {
                    this.position.setOffset(index);
                }
            }
        };

        this.mouseEntered  = function(e){
            this.correctPM(e.x, e.y);
        };

        this.keyPressed = function(e){
            if (this.model.count() > 0){
                var po = this.position.offset;
                switch(e.code) {
                    case KE.END:
                        if (e.isControlPressed()) this.position.setOffset(this.position.metrics.getMaxOffset());
                        else this.position.seekLineTo(Position.END);
                        break;
                    case KE.HOME:
                        if (e.isControlPressed()) this.position.setOffset(0);
                        else this.position.seekLineTo(Position.BEG);
                        break;
                    case KE.RIGHT    : this.position.seek(1); break;
                    case KE.DOWN     : this.position.seekLineTo(Position.DOWN); break;
                    case KE.LEFT     : this.position.seek(-1);break;
                    case KE.UP       : this.position.seekLineTo(Position.UP);break;
                    case KE.PAGEUP   : this.position.seek(this.pageSize(-1));break;
                    case KE.PAGEDOWN : this.position.seek(this.pageSize(1));break;
                    case KE.SPACE    :
                    case KE.ENTER    : this.select(this.position.offset);break;
                }

                if (po != this.position.offset) {
                    if (this.isComboMode) {
                        this.notifyScrollMan(this.position.offset);
                    }
                    else {
                        this.select(this.position.offset);
                    }
                }
            }
        };

        this.keyTyped = function (e){
            var i = this.lookupItem(e.ch);
            if (i >= 0) this.select(i);
        };

        this.elementInserted = function(target, e,index){
            this.invalidate();
            if (this.selectedIndex >= 0 && this.selectedIndex >= index) this.selectedIndex ++ ;
            this.position.inserted(index, 1);
            this.repaint();
        };

        this.elementRemoved = function(target, e,index){
            this.invalidate();
            if (this.selectedIndex == index || this.model.count() === 0) {
                this.select(-1);
            }
            else {
                if (this.selectedIndex > index) this.selectedIndex--;
            }
            this.position.removed(index, 1);
            this.repaint();
        };

        this.elementSet = function (target, e, pe,index){
            this.invalidate();
            this.repaint();
        };

        this.posChanged = function (target,prevOffset,prevLine,prevCol){
            var off = this.position.offset;
          //  this.notifyScrollMan(off);
            this.repaintByOffsets(prevOffset, off);
        };

        this.drawSelMarker = function (g,x,y,w,h) {
            if (this.views["select"]) this.views["select"].paint(g, x, y, w, h, this);
        };

        this.drawPosMarker = function (g,x,y,w,h) {
            if (this.views["marker"]) this.views["marker"].paint(g, x, y, w, h, this);
        };

        this.setItemGap = function(g){
            if (this.gap != g){
                this.gap = g;
                this.vrp();
            }
        };

        this.setModel = function (m){
            if (m == null) throw new Error("Null list model");
            if (m != this.model){
                if (Array.isArray(m)) {
                    m = new zebra.data.ListModel(m);
                }

                if (this.model != null && this.model._) this.model._.remove(this);
                this.model = m;
                if (this.model._) this.model._.add(this);
                this.vrp();
            }
        };

        this.setPosition = function(c){
            if (c != this.position) {
                if (this.position != null) this.position._.remove(this);
                this.position = c;
                this.position._.add(this);
                this.position.setPositionMetric(this);
                this.repaint();
            }
        };

        this.setViewProvider = function (v){
            if(this.provider != v){
                this.provider = v;
                this.vrp();
            }
        };

        this.notifyScrollMan = function (index){
            if (index >= 0 && this.scrollManager != null) {
                this.validate();
                var gap = this.getItemGap(),
                    dx = this.scrollManager.getSX(), dy = this.scrollManager.getSY(),
                    is = this.getItemSize(index), l = this.getItemLocation(index);

                this.scrollManager.makeVisible(l.x - dx - gap, l.y - dy - gap,
                                               is.width + 2 * gap, is.height + 2 * gap);
            }
        };

        this.pageSize = function(d){
            var offset = this.position.offset;
            if (offset >= 0) {
                var vp = pkg.$cvp(this, {});
                if (vp != null) {
                    var sum = 0, i = offset, gap = 2 * this.getItemGap();
                    for(;i >= 0 && i <= this.position.metrics.getMaxOffset() && sum < vp.height; i += d){
                        sum += (this.getItemSize(i).height + gap);
                    }
                    return i - offset - d;
                }
            }
            return 0;
        };
    },

    function (m, b){
        this.selectedIndex = -1;
        this._ = new Listeners();
        this.isComboMode = b;
        this.scrollManager = new pkg.ScrollManager(this);
        this.$super();

        // position manager should be set before model initialization
        this.setPosition(new Position(this));

        this.setModel(m);
    },

    function focused(){
        this.$super();
        this.repaint();
    }
]);
pkg.BaseList.prototype.setViews = pkg.$ViewsSetter;

	
	var ItemsControl = declare(Control,{
		//<<summary
		//アイテムのコレクションの表現に使用できるコントロールを表します。
		//summary>>
		"-privates-" : {
		},
		
		"-attributes-" : {
			//ItemsControl は、項目が含まれているかどうかを示す値を取得します。
			hasItems	: {
				type : Boolean
			},
			//項目を検索する場合は必須であるかどうかを示す値を取得または設定します
			isTextSearchCaseSensitive : {
				type : Boolean
			}
			
			//TextSearch は ItemsControl のインスタンスで有効になっているかどうかを示す値を取得または設定します。
			isTextSearchEnabled : function(){
				type : Boolean
			},
			
			items : {
				//<summary>
				// ItemsControlコンテンツを生成するために使用する項目を取得します。
				//</summary>
				type	:	ItemsCollection 
			},
			
			itemsSource : {
			},
			
			itemTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return ItemsControl;
	
});	
