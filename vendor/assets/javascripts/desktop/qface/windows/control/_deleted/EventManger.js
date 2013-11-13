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
	"qface/lang/EventArgs",
	"qface/windows/controlss/_Layoutable"
],function(declare,EventArgs,_Layoutable) {
	
	var InputEventArgs = declare(EventArgs,{
	});
	
	var KeyEvent = declare(InputEventArgs,{
        
        ctrlKeyPressed : function(){ 
        	return (this.mask & KE.M_CTRL) > 0; 
        },
        shiftKeyPressed : function(){ 
        	return (this.mask & KE.M_SHIFT) > 0; 
        },
        altKeyPressed  : function(){ 
        	return (this.mask & KE.M_ALT) > 0; 
        },
        cmdKeyPressed  : function(){ 
        	return (this.mask & KE.M_CMD) > 0; 
        }
	});
	
	
	
	var Panel = declare(_Layoutable,{
		left    : 0,
		top     : 0,
		right   : 0,
		bottom  : 0,
		isEnabled : true,
		
		constructor	: function(x,y) {
		},


        notifyRender : function(o,n){
            if (o != null && o.ownerChanged) o.ownerChanged(null);
            if (n != null && n.ownerChanged) n.ownerChanged(this);
        },

        properties : function(p) {
            for(var k in p) {
                if (p.hasOwnProperty(k)) {
                    var v = p[k], m = zebra.getPropertySetter(this, k);
                    if (v && v.$new) v = v.$new();
                    if (m == null) this[k] = v;
                    else {
                        if (Array.isArray(v)) m.apply(this, v);
                        else  m.call(this, v);
                    }
                }
            }
            return this;
        },

        load : function(jsonPath) {
            jsonPath = jsonPath + (jsonPath.lastIndexOf("?") > 0 ? "&" : "?") + (new Date()).getTime().toString();
            (new zebra.util.Bag(this)).load(zebra.io.GET(jsonPath));
            return this;
        },
        
        
        getComponentAt : function(x,y){
            var r = $cvp(this, temporary);
            if (r == null || (x < r.x || y < r.y || x >= r.x + r.width || y >= r.y + r.height)) {
                return null;
            }

            var k = this.kids;
            if (k.length > 0){
                for(var i = k.length; --i >= 0; ){
                    var d = k[i];
                    d = d.getComponentAt(x - d.x, y - d.y);
                    if (d != null) return d;
                }
            }
            return this.contains == null || this.contains(x, y) ? this : null;
        },

        vrp : function(){
            this.invalidate();
            if(this.parent != null) this.repaint();
        },

        getTop : function() {
            return this.border != null ? this.top + this.border.getTop() : this.top;
        },

        getLeft = function() {
            return this.border != null ? this.left + this.border.getLeft() : this.left;
        },

        getBottom : function() {
            return this.border != null ? this.bottom + this.border.getBottom() : this.bottom;
        },

        getRight : function() {
            return this.border != null ? this.right  + this.border.getRight()  : this.right;
        },

        isInvalidatedByChild : function(c) { 
        	return true; 
        },

        kidAdded : function (index,constr,l){
            pkg.events.performComp(CL.COMP_ADDED, this, constr, l);
            if(l.width > 0 && l.height > 0) l.repaint();
            else this.repaint(l.x, l.y, 1, 1);
        },

        kidRemoved : function(i,l){
            pkg.events.performComp(CL.COMP_REMOVED, this, null, l);
            if (l.isVisible) this.repaint(l.x, l.y, l.width, l.height);
        },

        relocated : function(px,py){ 
        	pkg.events.performComp(CL.COMP_MOVED, this, px, py); 
        },
        
        resized  : function(pw,ph){ 
        	pkg.events.performComp(CL.COMP_SIZED, this, pw, ph); 
        },
        
        hasFocus : function(){ 
        	return pkg.focusManager.hasFocus(this); 
        },
        
        requestFocus : function(){ 
        	pkg.focusManager.requestFocus(this); 
        },

        setVisible : function (b){
            if (this.isVisible != b) {
                this.isVisible = b;
                this.invalidate();
                pkg.events.performComp(CL.COMP_SHOWN, this, -1,  -1);
            }
        },

        setEnabled : function (b){
            if (this.isEnabled != b){
                this.isEnabled = b;
                pkg.events.performComp(CL.COMP_ENABLED, this, -1,  -1);
                if (this.kids.length > 0) {
                    for(var i = 0;i < this.kids.length; i++) this.kids[i].setEnabled(b);
                }
            }
        },

        setPaddings : function (top,left,bottom,right){
            if (this.top != top       || this.left != left  ||
                this.bottom != bottom || this.right != right  )  {
                this.top = top;
                this.left = left;
                this.bottom = bottom;
                this.right = right;
                this.vrp();
            }
        },

        setPadding : function(v) { 
        	this.setPaddings(v,v,v,v); 
        },

        setBorder = function (v){
            var old = this.border;
            v = pkg.$view(v);
            if (v != old){
                this.border = v;
                this.notifyRender(old, v);

                if ( old == null || v == null         ||
                     old.getTop()    != v.getTop()    ||
                     old.getLeft()   != v.getLeft()   ||
                     old.getBottom() != v.getBottom() ||
                     old.getRight()  != v.getRight())  {
                    this.invalidate();
                }

                if (v && v.activate) {
                    v.activate(this.hasFocus() ?  "function": "focusoff" );
                } 

                this.repaint();
            }
        },

        setBackground : function (v){
            var old = this.bg;
            v = pkg.$view(v);
            if (v != old) {
                this.bg = v;
                this.notifyRender(old, v);
                this.repaint();
            }
        },

        setKids : function(a) {
            if (arguments.length == 1 && Array.isArray(a)) {
                a = a[0];
            }

            if (instanceOf(a, pkg.Panel)) {
                for(var i=0; i<arguments.length; i++) {
                    var kid = arguments[i];
                    this.insert(i, kid.constraints, kid);
                }
            }
            else {
                var kids = a;
                for(var k in kids) {
                    if (kids.hasOwnProperty(k)) {
                        if (L[k] != null && zebra.isNumber(L[k])) {
                            this.add(L[k], kids[k]);
                        }
                        else this.add(k, kids[k]);
                    }
                }
            }
        },

        focused : function() {
            if (this.border && this.border.activate) {
                var id = this.hasFocus() ? "focuson" : "focusoff" ;
                if (this.border.views[id]) {
                    this.border.activate(id);
                    this.repaint();
                }
            }
        },

        repaint : function(x,y,w,h){
            if (arguments.length == 0) {
                x = y = 0;
                w = this.width;
                h = this.height;
            }
            if (this.parent != null && this.width > 0 && this.height > 0 && pkg.paintManager != null){
                pkg.paintManager.repaint(this, x, y, w, h);
            }
        },

        removeAll : function (){
            if (this.kids.length > 0){
                var size = this.kids.length, mx1 = Number.MAX_VALUE, my1 = mx1, mx2 = 0, my2 = 0;
                for(; size > 0; size--){
                    var child = this.kids[size - 1];
                    if (child.isVisible){
                        var xx = child.x, yy = child.y;
                        mx1 = mx1 < xx ? mx1 : xx; 
                        my1 = my1 < yy ? my1 : yy; 
                        mx2 = Math.max(mx2, xx + child.width);
                        my2 = Math.max(my2, yy + child.height);
                    }
                    this.removeAt(size - 1);
                }
                this.repaint(mx1, my1, mx2 - mx1, my2 - my1);
            }
        },

        toFront : function(){
            if (this.parent.kids[this.parent.kids.length-1] != this){
                this.parent.kids.splice(this.parent.indexOf(this), 1);
                this.parent.kids.push(this);
                this.repaint();
            }
        },

        toPreferredSize : function (){
            var ps = this.getPreferredSize();
            this.setSize(ps.width, ps.height);
        }
	});
	
	
	return Panel;
	
});	
