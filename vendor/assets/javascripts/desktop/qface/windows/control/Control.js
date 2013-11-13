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
	"qface/lang/Enum",
	"qface/lang/Set",
	"qface/lang/Stateful",
	"qface/data/styles/Stroke",
	"qface/data/styles/Fill",
	"qface/data/styles/Font",
	"qface/data/styles/Border",
	"qface/windows/layout/Contained",
	"qface/windows/layout/Container",
	"qface/windows/input/MouseEventHost",
	"qface/windows/input/KeyEventHost",
	"qface/windows/input/DragDropEventHost",
	"qface/windows/input/FocusEventHost",
	"qface/windows/controls/primitives/ControlVisual",
	"qface/windows/control/primitives/ControlStyle",
	"qface/windows/control/primitives/ControlStyles",
	"qface/windows/control/primitives/ControlState"
],function(
	declare,
	Enum,
	Set,
	Stateful,
	Stroke,
	Fill,
	Font,
	Border,
	Contained,
	Container,
	MouseEventHost,
	KeyEventHost,
	DragDropEventHost,
	FocusEventHost,
	ControlVisual,
	ControlStyle,
	ControlStyles,
	ControlState
) {

	var InternalState = Enum.declare("Creating","Layouting","Painting","Destroying");
	
	var ControlContext = Control.ControlContext = declare(Context,{
	
	
	});
	
	var Control = declare([Stateful,Contained,Container,MouseEventHost,KeyEventHost,FocusEventHost,DragDropEventHost],{
		"-privates-"	: {
			_offsetLeftGetter	:	function(){
				var v = this.vomNode;
				return 
			},
			
	        _HandleStateChanged = function(o,n){
	            var id = this.idByState(n), b = false;

	            for(var i=0; i < this.kids.length; i++) {
	                if (this.kids[i].parentStateUpdated) {
	                    this.kids[i].parentStateUpdated(o, n, id);
	                }
	            }

	            if (this.border && this.border.activate) b = this.border.activate(id) || b;
	            if (this.view   && this.view.activate)  b = this.view.activate(id) || b;
	            if (this.bg     && this.bg.activate)   b = this.bg.activate(id) || b;

	            if (b) this.repaint();
	        },
	        
	        
			_doMouseDown	: function(/*MouseDownEvent*/voEvt) {
				this._saveMouseDownInfo(x,y);
				if (btn == W.MouseButton.left) {
					var css = this.controlStyles;

					if (css.contains(ControlStyle.Resizable)) {
						if (this._validateAutoResize(x,y,mouse._mouseinEl)) {
							W.DragObject._dragInit(this,W.DragObject.DT_RESIZE);
							return;
						}
					}

					if (css.contains(W.ControlStyle.Movable)) {
						if (this._validateAutoMove(x,y,mouse._mouseinEl)) {
							W.DragObject._dragInit(this,W.DragObject.DT_REPOS);
							return;
						}
					}
					
				}
			},

			_doMouseMove	: function(/*Event*/vEvt) {
				var cs = this.controlStyles;
				var ca = null;
			 	if (cs.contains(ControlStyle.Resizable)) {
					ca = this._validateAutoResize(x,y,mouse._mouseinEl);
				}

				if (!ca && cs.contains(ControlStyle.Movable)) {
					ca = this._validateAutoMove(x,y,mouse._mouseinEl)
				}

				if (ca) {
					desk.setCurrentCursor(ca);
				} else {
					desk.setCurrentCursor(this.getCursor());
				}
			},


			_doMouseUp	: function(/*Event*/vEvty) {
			
			},

			_doMouseEnter	: function(/*Event*/vEvt) {
			},

			_doMouseLeave	: function(/*Event*/vEvt) {
			},

			_doClick		: function(/*Event*/vEvt) {
			},

			_doDblClick		: function(/*Event*/vEvt) {
			},
			
			_doGetFocus		: function(/*Event*/vEvt) {
				var cEvt = new FocusEventHost.GetFocusEvent(vEvt);
				this.emit((cEvt);
			},

			_doLostFocus	: function(/*Event*/vEvt) {
				var cEvt = new FocusEventHost.LostFocusEvent(vEvt);
				this.emit((cEvt);
			},

			_doKeyDown		: function(/*Event*/vEvt) {
				var cEvt = new KeyEventHost.KeyDownEvent(vEvt);
				this.emit((cEvt);
			},

			_doCharInput	: function(/*Event*/vEvt) {
				var cEvt = new KeyEventHost.CharInputEvent(vEvt);
				this.emit((cEvt);
			},

			_doKeyUp		: function(/*Event*/vEvt) {
				var cEvt = new KeyEventHost.KeyUptEvent(vEvt);
				this.emit((cEvt);
			},

			_doDragEnter		: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},

			_doDragMove		: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},

			_doDragLeave	: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},

			_doDragDrop		: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},

			_doDragStart	: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},


			_doDragEnd		: function(/*Event*/vEvt) {
				var cEvt = new DragDropEventHost.DragEntertEvent(vEvt);
				this.emit((cEvt);
			},


			_doBeginAutoMove	: function(x,y){
				this._savePosSizeInfo();
			},


			_doEndAutoMove		: function(x,y) {
			},

			_doBeginAutoResize	: function(x,y,ori) {
				this._savePosSizeInfo();
			},

			_doEndAutoResize	: function(x,y) {
			},

			_doAutoMoving		: function(x, y) {
				var dx = x-mouse.getDownX();
				var dy = y-mouse.getDownY();

				this.setLeft(this._l+dx);
				this.setTop(this._t+dy);
	       },

			_resizeRect			: function(x,y,cursor,rect){
				var nLeft  = rect.getLeft();
				var nTop   = rect.getTop();
				var nWidth = rect.getWidth();
				var nHeight = rect.getHeight();
				var nRight = nLeft + nWidth;
				var nBottom = nTop + nHeight;

				var dx = x-mouse.getDownX();
				var dy = y-mouse.getDownY();

				switch (cursor) {
					case W.Cursor.eresize :
						{
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							break;
						};
					case W.Cursor.wresize :
						{
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
					case W.Cursor.nresize :
						{
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							break;
						};
					case W.Cursor.sresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							break;
						};
					case W.Cursor.neresize :
						{
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							break;
						};
					case W.Cursor.nwresize :
						{
							nTop = nTop+dy;
							if (nTop > nBottom - 3) {
								nTop = nBottom -3 ;
							}
							nHeight = nBottom - nTop;
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
					case W.Cursor.seresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							nWidth = nWidth + dx;
							if (nWidth < 3 ) {
								nWidth = 3;
							}
							break;
						};
					case W.Cursor.swresize :
						{
							nHeight = nHeight+dy;
							if (nHeight < 3 ) {
								nHeight = 3;
							}
							nLeft = nLeft +  dx;
							if (nLeft > nRight - 3) {
								nLeft = nRight -3 ;
							}
							nWidth = nRight - nLeft;
							break;
						};
				}
				
				return new W.Rect(nLeft,nTop,nWidth,nHeight);
			},

			_doAutoResizing		: function(x,y,cursor){
				var rect = new W.Rect(this._l,this._t,this._w,this._h);
				rect =	this._resizeRect(x,y,cursor,rect);
				System.asyncExecMethod(this,this.setBounds,[rect.getLeft(),rect.getTop(),rect.getWidth(),rect.getHeight()],0);
	//			this.setBounds(rect.getLeft(),rect.getTop(),rect.getWidth(),rect.getHeight());
			},


			_doCanSetParent	: function(oParent){
				return true;
			},

			_doEndUpdate	: function() {
				this._layout();
			},

			_layout : function(bInvalidate) {
				if (this.isUpdating()) {
					return ;
				}
				this._ncSizeCalced = false;

				if (this.getDock() != W.Dock.none) {
					var p = this.getParent();
					if (p) {
						p._requestDock();
					}
				}
				if (this.getWidth() != this._oldWidth || this.getHeight()!=this._oldHeight) {
					this._oldWidth = this.getWidth();
					this._oldHeight = this.getHeight();
	            	this._doResize();
				}
			},

		},
		"-attributies-" :  {
			"location"	:	{
				"type"	:	Location,
				default	:	Location.x0y0
			},
			
			"size"	:	{
				"type"	:	Size,
				
			},
			"padding"	:	{
				"type"	:	Padding,
				default	:	Padding.Zero
			},
			
			"scroll"	:	{
			
			},
			
			
			"border" : {
				"type" 		: 	Boolean,
				"invalidate":	true
			},
			"background" : {
				"type"		:	ControlBackground,
				"repaint"	:	true
			},
			"font" : {
				"type" 		: 	ControlFont,
				"repaint"	:	true
			},
			"scrollbar"	:	{
			},
			"cursor" : {
			},

			"enabled" : {
				"type" 		: 	Boolean,
				"repaint"	:	true
			},
			
			"visibility"	:	{
				//この要素の ユーザー インターフェイス (UI) 表現を取得または設定します。 
				"type" 		: 	Boolean,
				"invalidate":	true
			},
			
			"controlStyle"	:	{
				"type"	:	ControlStyle,
			
			},
			
			"controlState"	:	{
				"type"	:	ControlState,
			
			}
		},
		"-events-"	:	{
		
		},
		"-methods-" : {
			/**
			 *
			 */
			"invalidate"	:	function(){
				this._layout();
			},
			
			"repaint"	:	function(x,y,w,h){
				if (this.isVisible()) {
					var display = this.getDisplay();
		            display.paintManager.repaint(this.visual, x, y, w, h);				
				}
			},
			
			"beginInit" : function() {
			},
			
			"endInit" : function() {
			},
			
			"focus"	: function() {
			},
			
			"isVisible"	:	function() {
				return  true;
			},
			
			findDisplayLocation	:	function(){
			
			},
			
			findVisualParent	:	function(){
				//コントロールのビジュアル親コントロールすべてを取得する
				var p,v = this.visual.parent;
				while (v) {
					if (v.control) {
						p = v.control;
						break;
					}
				}
				return p;
			},
			
			findVisualChildren	:	function(){
				//コントロールのビジュアル子コントロールすべてを取得する
			},
			
			calcVisibleArea : function(r) {
				//コントロールの可視領域を判定する
				var c = this;
			    if (c.width > 0 && c.height > 0 && c.isVisible){
			        var p = c.parent, px = -c.x, py = -c.y;
			        if (r == null) r = { x:0, y:0, width:0, height:0 };
			        else r.x = r.y = 0;
			        r.width  = c.width;
			        r.height = c.height;

			        while (p != null && r.width > 0 && r.height > 0) {
			            var xx = r.x > px ? r.x : px, yy = r.y > py ? r.y : py;

			            r.width  = Math.min(r.x + r.width, px + p.width) - xx,
			            r.height = Math.min(r.y + r.height, py + p.height) - yy;
			            r.x = xx;
			            r.y = yy;

			            px -= p.x;
			            py -= p.y;
			            p = p.parent;
			        }
			        return r.width > 0 && r.height > 0 ? r : null;
			    }
			    return null;
			},
			
			"pointToDisplay"	:	function(p){
			},
			
			"pointFromDisplay"	:	function(p){
			}
		},

		constructor	:	function()	{
		
		
		},
		
		destroy	:	function()	{
			
			this.inherited(arguments);
		}
	
	});
	
	
	return Control;
	
});	