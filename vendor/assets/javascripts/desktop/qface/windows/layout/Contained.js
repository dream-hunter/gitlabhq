define([
	"qface/lang/declare", // declare
	"qface/windows/layout/Location",
	"qface/windows/layout/Size"
], function(declare,Location,Size){

	return declare( null, {
		"-attributes-" : {
			"size"	: {
			},
			"preferredSize"	: {
				
				getter : function() {
            		return { width: 2 * this.gap + 6, height:2 * this.gap + 6 };
				}
			},
			"minSize"	: {
			},
			"maxSize"	: {
			},
			"minWidth"	: {
			},
			"minHeight"	: {
			},
			"parent" : {
				setter	: function(o) {
					if(o != this.parent){
					    this.parent = o;
					    this.invalidate();
					}
				}
				
			},

			"left" : {
				type	: Number
			},
			"top" : {
				type	: Number
			},
			"width" : {
				type	: Number
			},
			"height" : {
				type	: Number
			},			
			"bounds" : {
				type : Rect
			},
			"offsetLocation" : {
				type : Location,
				setter	: function(xx,yy) {
				    if(xx != this.x || this.y != yy){
				        var px = this.x, py = this.y;
				        this.x = xx;
				        this.y = yy;
				        if (this.relocated) this.relocated(px, py);
				    }
				}
			},
			"visible" : {
				type : Boolean
			}
		},
		
		"-methods-" : {
			//コントロールが適合する四角形領域のサイズを取得します。
			getPreferredSize	: function() {
	            this.validateMetric();
	            if(this.cachedWidth < 0){
	                var ps = (this.psWidth < 0 || this.psHeight < 0) ? this.layout.calcPreferredSize(this)
	                                                                 : { width:0, height:0 };

	                ps.width  = this.psWidth  >= 0 ? this.psWidth  : ps.width  + this.getLeft() + this.getRight();
	                ps.height = this.psHeight >= 0 ? this.psHeight : ps.height + this.getTop()  + this.getBottom();
	                this.cachedWidth  = ps.width;
	                this.cachedHeight = ps.height;
	                return ps;
	            }
	            return { width:this.cachedWidth, height:this.cachedHeight };
			},
			
			previousSibling: function(){
				// summary:
				//		Returns null if this is the first child of the parent,
				//		otherwise returns the next element sibling to the "left".

				return this._getSibling("previous"); // dijit/_WidgetBase
			},

			nextSibling: function(){
				// summary:
				//		Returns null if this is the last child of the parent,
				//		otherwise returns the next element sibling to the "right".

				return this._getSibling("next"); // dijit/_WidgetBase
			},

			indexInParent: function(){
				// summary:
				//		Returns the index of this widget within its container parent.
				//		It returns -1 if the parent does not exist, or if the parent
				//		is not a dijit._Container

				var p = this.parent;
				if(!p || !p.indexOfChild){
					return -1; // int
				}
				return p.indexOfChild(this); // int
			},
			
			
			// z-index
		
			moveToFront: function(){
				// summary:
				//		moves a shape to front of its parent's list of shapes
				var p = this.getParent();
				if(p){
					p._moveChildToFront(this);
					this._moveToFront();	// execute renderer-specific action
				}
				return this;	// self
			},
			moveToBack: function(){
				// summary:
				//		moves a shape to back of its parent's list of shapes
				var p = this.getParent();
				if(p){
					p._moveChildToBack(this);
					this._moveToBack();	// execute renderer-specific action
				}
				return this;
			},
			_moveToFront: function(){
				// summary:
				//		renderer-specific hook, see dojox/gfx/shape.Shape.moveToFront()
				
				// COULD BE RE-IMPLEMENTED BY THE RENDERER!
			},
			_moveToBack: function(){
				// summary:
				//		renderer-specific hook, see dojox/gfx/shape.Shape.moveToFront()
				
				// COULD BE RE-IMPLEMENTED BY THE RENDERER!
			},
			layout	: function(/*Rect*/bounds) {
			}
		}

		
	});
});
