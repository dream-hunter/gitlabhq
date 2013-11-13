/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */

define( [
	"qface/lang/declare",
	"qface/windows/media/Visual",
	"qface/windows/layout/Container"	
], function(declare,Visual,Container){
	
	var ContainerVisual = declare([Visual,Container],{
		"-privates-"	:	{
		
			/**
			 * @method _tick
			 * @protected
			 **/
			_tick : function(params) {
				for (var i=this.children.length-1; i>=0; i--) {
					var child = this.children[i];
					if (child._tick) { child._tick(params); }
				}
				//this.DisplayObject__tick(params);
				this.inherited(arguments);
			},

			/**
			 * @method _getObjectsUnderPoint
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Array} arr
			 * @param {Number} mouseEvents A bitmask indicating which event types to look for. Bit 1 specifies press &
			 * click & double click, bit 2 specifies it should look for mouse over and mouse out. This implementation may change.
			 * @return {Array}
			 * @protected
			 **/
			_getObjectsUnderPoint : function(x, y, arr, mouseEvents) {
				var ctx = createjs.DisplayObject._hitTestContext;
				var canvas = createjs.DisplayObject._hitTestCanvas;
				var mtx = this._matrix;
				var hasHandler = this._hasMouseHandler(mouseEvents);

				// if we have a cache handy & this has a handler, we can use it to do a quick check.
				// we can't use the cache for screening children, because they might have hitArea set.
				if (!this.hitArea && this.cacheCanvas && hasHandler) {
					this.getConcatenatedMatrix(mtx);
					ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
					ctx.globalAlpha = mtx.alpha;
					this.draw(ctx);
					if (this._testHit(ctx)) {
						canvas.width = 0;
						canvas.width = 1;
						return this;
					}
				}

				// draw children one at a time, and check if we get a hit:
				var l = this.children.length;
				for (var i=l-1; i>=0; i--) {
					var child = this.children[i];
					var hitArea = child.hitArea;
					if (!child.visible || (!hitArea && !child.isVisible()) || (mouseEvents && !child.mouseEnabled)) { continue; }
					var childHasHandler = mouseEvents && child._hasMouseHandler(mouseEvents);
					
					// if a child container has a handler and a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
					if (child instanceof Container && !(hitArea && childHasHandler)) {
						var result;
						if (hasHandler) {
							// only concerned about the first hit, because this container is going to claim it anyway:
							result = child._getObjectsUnderPoint(x, y);
							if (result) { return this; }
						} else {
							result = child._getObjectsUnderPoint(x, y, arr, mouseEvents);
							if (!arr && result) { return result; }
						}
					} else if (!mouseEvents || hasHandler || childHasHandler) {
						child.getConcatenatedMatrix(mtx);
						
						if (hitArea) {
							mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
							mtx.alpha = hitArea.alpha;
						}
						
						ctx.globalAlpha = mtx.alpha;
						ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
						(hitArea||child).draw(ctx);
						if (!this._testHit(ctx)) { continue; }
						canvas.width = 0;
						canvas.width = 1;
						if (hasHandler) { return this; }
						else if (arr) { arr.push(child); }
						else { return child; }
					}
				}
				return null;
			},
			
			_renderClip: function(ctx){
				if (this.canvasClip){
					this.canvasClip.render(ctx);
					ctx.clip();
				}
			},
			_renderTransform: function(/* Object */ ctx){
				var m = this.transform.martix;
				ctx.transform(m.m11, m.m12, m.m21, m.22, m.dx, m.dy);
			}		
		},
		
		"-attributes-" : {
			//ContainerVisual のクリッピング領域を取得または設定します。
			"clip" : {
				type : Transform
			}
		},
		
		"-methods-"	:	{
		
			/**
			 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
			 * This does not account for whether it would be visible within the boundaries of the stage.
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method isVisible
			 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
			 **/
			isVisible : function() {
				var hasContent = this.cacheCanvas || this.children.length;
				return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
			},


			/**
			 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
			 * Returns true if the draw was handled (useful for overriding functionality).
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method draw
			 * @param {CanvasRenderingContext2D} gdi The canvas 2D context object to draw into.
			 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
			 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
			 * into itself).
			 **/
			draw : function(gdi, ignoreCache) {
				
				if (this.inherited(arguments)) { return true;}
				
				// this ensures we don't have issues with display list changes that occur during a draw:
				var list = this.children.slice(0);
				for (var i=0,l=list.length; i<l; i++) {
					var child = list[i];
					if (!child.isVisible()) { continue; }
					
					// draw the child:
					gdi.save();
					child.updateContext(gdi);
					child.draw(gdi);
					gdi.restore();
				}
				return true;
			},
			
			/**
			 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the specified
			 * position). This ignores the alpha, shadow and compositeOperation of the display object, and all transform properties
			 * including regX/Y.
			 * @method hitTest
			 * @param {Number} x The x position to check in the display object's local coordinates.
			 * @param {Number} y The y position to check in the display object's local coordinates.
			 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
			 * coordinates.
			 **/
			hitTest : function(x, y) {
				// TODO: optimize to use the fast cache check where possible.
				return (this.find(x, y) != null);
			},

			/**
			 * Returns an array of all display objects under the specified coordinates that are in this container's display list.
			 * This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order of visual
			 * depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an expensive operation
			 * to run, so it is best to use it carefully. For example, if testing for objects under the mouse, test on tick (instead of on
			 * mousemove), and only if the mouse's position has changed.
			 * @method findVisuals
			 * @param {Point} p The  position in the container to test.
			 * @return {Array} An Array of DisplayObjects under the specified coordinates.
			 **/
			findVisuals : function(/*Point*/p) {
				var arr = [];
				var pt = this.localToGlobal(p.x, p.y);
				this._getObjectsUnderPoint(pt.x, pt.y, arr);
				return arr;
			},

			/**
			 * Similar to getObjectsUnderPoint(), but returns only the top-most display object. This runs significantly faster than
			 * getObjectsUnderPoint(), but is still an expensive operation. See getObjectsUnderPoint() for more information.
			 * @method findVisual
			 * @param {Point} p The  position in the container to test.
			 * @return {Visual} The top-most display object under the specified coordinates.
			 **/
			findVisual : function(/*Point*/p) {
				var pt = this.localToGlobal(p.x, p.y);
				return this._getObjectsUnderPoint(pt.x, pt.y);
			},

			/**
			 * Returns a clone of this Container. Some properties that are specific to this instance's current context are reverted to
			 * their defaults (for example .parent).
			 * @param {Boolean} recursive If true, all of the descendants of this container will be cloned recursively. If false, the
			 * properties of the container will be cloned, but the new instance will not have any children.
			 * @return {Container} A clone of the current Container instance.
			 **/
			clone : function(recursive) {
				var o = new Container();
				this.cloneProps(o);
				if (recursive) {
					var arr = o.children = [];
					for (var i=0, l=this.children.length; i<l; i++) {
						var clone = this.children[i].clone(recursive);
						clone.parent = o;
						arr.push(clone);
					}
				}
				return o;
			},

			/**
			 * Returns a string representation of this object.
			 * @method toString
			 * @return {String} a string representation of the instance.
			 **/
			toString : function() {
				return "[Container (name="+  this.name +")]";
			}
		},
		

		/**
		 * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
		 * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
		 * transform them as a group, while still being able to move the individual parts relative to each other. Children of
		 * containers have their <code>transform</code> and <code>alpha</code> properties concatenated with their parent
		 * Container.
		 *
		 * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with <code>x=50</code>
		 * and <code>alpha=0.7</code> will be rendered to the canvas at <code>x=150</code> and <code>alpha=0.35</code>.
		 * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
		 *
		 * <h4>Example</h4>
		 *      var container = new createjs.Container();
		 *      container.addChild(bitmapInstance, shapeInstance);
		 *      container.x = 100;
		 *
		 * @class Container
		 * @extends DisplayObject
		 * @constructor
		 **/
		constructor : function() {
		}
		
	});

	return ContainerVisual;
});
