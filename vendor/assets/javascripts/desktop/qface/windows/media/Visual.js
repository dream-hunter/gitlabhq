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
	"qface/lang/Stateful",
	"qface/data/geom/Point",
	"qface/data/geom/transform/Matrix",
	"qface/data/geom/transform/Ratate2STransform",
	"qface/windows/layout/Contained",
	"qface/data/styles/LinearGradientFill",
	"qface/data/styles/RadialGradientFill",
	"qface/data/styles/SolidColorFill",
	"qface/data/styles/Stroke",
	"qface/data/styles/Shadow"
], function(declare,Stateful,Point,Matrix,Ratate2STransform,Contained,LinearGradientFill,RadialGradientFill,SolidColorFill,Stroke,Shadow){
	var DisplayCtoc = null,
		_nextCacheID = 1,
		_hitTestCanvas = document.createElement("canvas")
		_hitTestContext = _hitTestCanvas.getContext("2d")；
	
	var Visual =  declare([Stateful,Contained],{
		"-privates-" : {
			/**
			 * If a cache is active, this returns the canvas that holds the cached version of this visual object. See cache()
			 * for more information. READ-ONLY.
			 * @property cacheCanvas
			 * @type {HTMLCanvasElement | Object}
			 * @default null
			 **/
			cacheCanvas : null,

			/**
			 * Draws the visual object into the specified context ignoring it's visible, opacity, shadow, and transform.
			 * Returns true if the draw was handled (useful for overriding functionality).
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method draw
			 * @param {CanvasRenderingContext2D} gdi The canvas 2D context object to draw into.
			 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
			 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
			 * into itself).
			 **/
			_draw : function(gdi, ignoreCache) {
				return false;
			},
			
			/**
			 * Returns gdi
			 */
			_gdiGetter	:	function()	{
				var p = this.parent;
				if (p) {
					return p.gdi;
				}
			},
			
			/**
			 * Returns CacheCanvas
			 */
			_createCacheCanvas	:	function() {
				var p = this.parent;
				if (p && p._createCacheCanvas) {
					return p._createCacheCanvas();
				}
			
			}
			
		},	
		
		"-attributes-" : {
			"gdi"	:	{
				/**
				 * The graphic device interface.
				 * @property opacity
				 * @type {Number}
				 * @default 1
				 **/
				type	: Content2D
				readOnly	:	true
			
			
			},
		// public properties:
			/**
			 * Visual の不透明度 (0 は透明で、1 は不透明) を取得または設定します。
			 * The opacity (transparency) for this visual object. 0 is fully transparent, 1 is fully opaque.
			 * @property opacity
			 * @type {Number}
			 * @default 1
			 **/
			"opacity" : {
				type : Number,
				default :1
			},
			/**
			 * A shadow object that defines the shadow to render on this visual object. Set to null to remove a shadow. If
			 * null, this property is inherited from the parent container.
			 * @property shadow
			 * @type {Shadow}
			 * @default null
			 **/
			"shadow" : {
				type : Shadow,
				default : null
			},
			
			//Visual に適用される変換を取得または設定します。
			"transform"	:	{
				type	:	Rotate2STransform,
				default	:	null
			},

			/**
			 * Indicates whether this visual object should be rendered to the canvas and included when running
			 * Stage.getObjectsUnderPoint().
			 * @property visible
			 * @type {Boolean}
			 * @default true
			 **/
			visible : true,


			/**
			 * The composite operation indicates how the pixels of this visual object will be composited with the elements
			 * behind it. If null, this property is inherited from the parent container. For more information, read the
			 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
			 * whatwg spec on compositing</a>.
			 * @property compositeOperation
			 * @type {String}
			 * @default null
			 **/
			compositeOperation : null,

			/**
			 * Indicates whether the visual object should have it's x & y position rounded prior to drawing it to stage.
			 * Snapping to whole pixels can result in a sharper and faster draw for images (ex. Bitmap & cached objects).
			 * This only applies if the enclosing stage has snapPixelsEnabled set to true. The snapToPixel property is true
			 * by default for Bitmap and BitmapAnimation instances, and false for all other visual objects.
			 * <br/><br/>
			 * Note that this applies only rounds the visual object's local position. You should
			 * ensure that all of the visual object's ancestors (parent containers) are also on a whole pixel. You can do this
			 * by setting the ancestors' snapToPixel property to true.
			 * @property snapToPixel
			 * @type {Boolean}
			 * @default false
			 * @deprecated Hardware acceleration in modern browsers makes this unnecessary.
			 **/
			snapToPixel : false,
			
			
		},	
		
		"-methods-" :{
		// public methods:
			/**
			 * Returns true or false indicating whether the visual object would be visible if drawn to a canvas.
			 * This does not account for whether it would be visible within the boundaries of the stage.
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method isVisible
			 * @return {Boolean} Boolean indicating whether the visual object would be visible if drawn to a canvas
			 **/
			isVisible : function() {
				return !!(this.visible && this.opacity > 0 && this.scaleX != 0 && this.scaleY != 0);
			},

			/**
			 * Applies this visual object's transformation, opacity, globalCompositeOperation, clipping path (mask), and shadow to the specified
			 * context. This is typically called prior to draw.
			 * @method setupContext
			 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
			 **/
			updateContext : function(ctx) {
				var mtx, mask=this.mask, o=this;
				
				if (mask && mask.graphics && !mask.graphics.isEmpty()) {
					mtx = mask.getMatrix(mask._matrix);
					ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
					
					mask.graphics.drawAsPath(ctx);
					ctx.clip();
					
					mtx.invert();
					ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
				}
				
				mtx = o._matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
				// TODO: should be a better way to manage this setting. For now, using dynamic access to avoid circular dependencies:
				if (createjs["Stage"]._snapToPixelEnabled && o.snapToPixel) { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0); }
				else { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
				ctx.globalopacity *= o.opacity;
				if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
				if (o.shadow) { this._applyShadow(ctx, o.shadow); }
			},

			/**
			 * Draws the visual object into a new canvas, which is then used for subsequent draws. For complex content
			 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
			 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
			 * cached visual object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually
			 * update the cache by calling updateCache() or cache() again. You must specify the cache area via the x, y, w,
			 * and h parameters. This defines the rectangle that will be rendered and cached using this visual object's
			 * coordinates. For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25, you could call
			 * myShape.cache(-25, -25, 50, 50) to cache the full shape.
			 * @method cache
			 * @param {Number} x The x coordinate origin for the cache region.
			 * @param {Number} y The y coordinate origin for the cache region.
			 * @param {Number} width The width of the cache region.
			 * @param {Number} height The height of the cache region.
			 * @param {Number} scale Optional. The scale at which the cache will be created. For example, if you cache a vector shape using
			 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
			 * 	cached elements with greater fidelity. Default is 1.
			 **/
			cache : function(x, y, width, height, scale) {
				// draw to canvas.
				scale = scale||1;
				if (!this._cacheCanvas) { this._cacheCanvas = this._createCacheCanvas() }
				this._cacheCanvas.width = Math.ceil(width*scale);
				this._cacheCanvas.height = Math.ceil(height*scale);
				this._cacheOffsetX = x;
				this._cacheOffsetY = y;
				this._cacheScale = scale||1;
				this.updateCache();
			},

			/**
			 * Redraws the visual object to its cache. Calling updateCache without an active cache will throw an error.
			 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the visual object
			 * will be drawn over the existing cache using the specified compositeOperation.
			 * @method updateCache
			 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
			 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
			 * whatwg spec on compositing</a>.
			 **/
			updateCache : function(compositeOperation) {
				var cacheCanvas = this._cacheCanvas, scale = this._cacheScale, offX = this._cacheOffsetX*scale, offY = this._cacheOffsetY*scale;
				if (!cacheCanvas) { throw "cache() must be called before updateCache()"; }
				var gdi2 = cacheCanvas.gdi;
				gdi2.save();
				if (!compositeOperation) { gdi2.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height); }
				gdi2.globalCompositeOperation = compositeOperation;
				gdi2.setTransform(scale, 0, 0, scale, -offX, -offY);
				this.draw(gdi2, true);
				this._applyFilters();
				gdi2.restore();
				this.cacheID = _nextCacheID++;
			},

			/**
			 * Clears the current cache. See cache() for more information.
			 * @method uncache
			 **/
			uncache : function() {
				this._cacheDataURL = this._cacheCanvas = null;
				this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
				this._cacheScale = 1;
			},
			
			/**
			* Returns a data URL for the cache, or null if this visual object is not cached.
			* Uses cacheID to ensure a new data URL is not generated if the cache has not changed.
			* @method getCacheDataURL.
			**/
			getCacheDataURL : function() {
				if (!this._cacheCanvas) { return null; }
				if (this.cacheID != this._cacheDataURLID) { this._cacheDataURL = this._cacheCanvas.toDataURL(); }
				return this._cacheDataURL;
			},

			/**
			 * Returns the display that this visual object will be rendered on, or null if it has not been added to one.
			 * @method getStage
			 * @return {Stage} The Stage instance that the visual object is a descendent of. null if the DisplayObject has not
			 * been added to a Stage.
			 **/
			getDisplay : function() {
				var o = this;
				while (o.parent) {
					o = o.parent;
				}
				// using dynamic access to avoid circular dependencies;
				DisplayCtoc = DisplayCtoc ? DisplayCtoc :require("qface/windows/media/Display");
				if (DisplayCtoc && o instanceof DisplayCtoc) { return o; }
				return null;
			},

			/**
			 * Visual の現在の座標系を表す Point を、画面座標における Point に変換します。
			 * Transforms the specified x and y position from the coordinate space of the visual object
			 * to the global (display) coordinate space. For example, this could be used to position an HTML label
			 * over a specific point on a nested visual object. Returns a Point instance with x and y properties
			 * correlating to the transformed coordinates on the stage.
			 * @method localToGlobal
			 * @param {Number} x The x position in the source visual object to transform.
			 * @param {Number} y The y position in the source visual object to transform.
			 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
			 * on the stage.
			 **/
			pointToRoot : function(/*Point*/p){
			localToGlobal : function(x, y) {
				var mtx = this.getConcatenatedMatrix(this._matrix);
				if (mtx == null) { return null; }
				mtx.append(1, 0, 0, 1, x, y);
				return new Point(mtx.tx, mtx.ty);
			},

			/**
			 * 画面座標における Point を、Visual の現在の座標系を表す Point に変換します。
			 * Transforms the specified x and y position from the global (display) coordinate space to the
			 * coordinate space of the visual object. For example, this could be used to determine
			 * the current mouse position within the visual object. Returns a Point instance with x and y properties
			 * correlating to the transformed position in the visual object's coordinate space.
			 * @method globalToLocal
			 * @param {Number} x The x position on the stage to transform.
			 * @param {Number} y The y position on the stage to transform.
			 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
			 * visual object's coordinate space.
			 **/
			pointFromRoot : function(/*Point*/p){},

			globalToLocal : function(x, y) {
				var mtx = this.getConcatenatedMatrix(this._matrix);
				if (mtx == null) { return null; }
				mtx.invert();
				mtx.append(1, 0, 0, 1, x, y);
				return new Point(mtx.tx, mtx.ty);
			},


			/**
			 * Transforms the specified x and y position from the coordinate space of this visual object to the
			 * coordinate space of the target visual object. Returns a Point instance with x and y properties
			 * correlating to the transformed position in the target's coordinate space. Effectively the same as calling
			 * var pt = this.localToGlobal(x, y); pt = target.globalToLocal(pt.x, pt.y);
			 * @method localToLocal
			 * @param {Number} x The x position in the source visual object to transform.
			 * @param {Number} y The y position on the stage to transform.
			 * @param {DisplayObject} target The target visual object to which the coordinates will be transformed.
			 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
			 * in the target's coordinate space.
			 **/
			localToLocal : function(x, y, target) {
				var pt = this.localToGlobal(x, y);
				return target.globalToLocal(pt.x, pt.y);
			},

			/**
			 * Returns a matrix based on this object's transform.
			 * @method getMatrix
			 * @param {Matrix} matrix Optional. A Matrix object to populate with the calculated values. If null, a new
			 * Matrix object is returned.
			 * @return {Matrix} A matrix representing this visual object's transform.
			 **/
			getMatrix : function(matrix) {
				var o = this;
				return (matrix ? matrix.identity() : new Matrix()).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.centerX, o.centerY).appendProperties(o.opacity, o.shadow, o.compositeOperation);
			},
			
			/**
			 * Generates a concatenated Matrix object representing the combined transform of
			 * the visual object and all of its parent Containers up to the highest level ancestor
			 * (usually the stage). This can be used to transform positions between coordinate spaces,
			 * such as with localToGlobal and globalToLocal.
			 * @method getConcatenatedMatrix
			 * @param {Matrix} mtx Optional. A Matrix object to populate with the calculated values. If null, a new
			 * Matrix object is returned.
			 * @return {Matrix} a concatenated Matrix object representing the combined transform of
			 * the visual object and all of its parent Containers up to the highest level ancestor (usually the stage).
			 **/
			getConcatenatedMatrix : function(matrix) {
				if (matrix) { matrix.identity(); }
				else { matrix = new Matrix(); }
				var o = this;
				while (o != null) {
					matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.centerX, o.centerY).prependProperties(o.opacity, o.shadow, o.compositeOperation);
					o = o.parent;
				}
				return matrix;
			},

			/**
			 * 点の座標値がビジュアル オブジェクトの境界内にあるかどうかを判断します。
			 * Tests whether the visual object intersects the specified local point (ie. draws a pixel with opacity > 0 at
			 * the specified position). This ignores the opacity, shadow and compositeOperation of the visual object, and all
			 * transform properties including regX/Y.
			 * @method hitTest
			 * @param {Number} x The x position to check in the visual object's local coordinates.
			 * @param {Number} y The y position to check in the visual object's local coordinates.
			 * @return {Boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
			 * local Point.
			*/
			hitTest : function(x, y) {
				var ctx = ._hitTestContext;
				var canvas = DisplayObject._hitTestCanvas;

				ctx.setTransform(1,  0, 0, 1, -x, -y);
				this.draw(ctx);

				var hit = this._testHit(ctx);

				canvas.width = 0;
				canvas.width = 1;
				return hit;
			},

			draw : function(gdi,ignoreCache){
				var cacheCanvas = this._cacheCanvas;
				if (ignoreCache || !cacheCanvas) { 
					return this._draw(gdi,ignoreCache)
				} else {
					var scale = this._cacheScale;
					gctx.drawImage(cacheCanvas, this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width/scale, cacheCanvas.height/scale);
					return true;
				
				}
			},

			//ビジュアル オブジェクトが、指定した子孫ビジュアル オブジェクトの先祖かどうかを判定します
			isAncestorOf : function(/*Visual*/target) {
			},
			
			//ビジュアル オブジェクトが、指定した先祖ビジュアル オブジェクトの子孫かどうかを判定します。
			isDescendantOf : function(/*Visual*/target){
			},			
			

			/**
			 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
			 * reverted to their defaults (for example .parent).
			 * @method clone
			 * @return {DisplayObject} A clone of the current DisplayObject instance.
			 **/
			clone : function() {
				var o = new Visual();
				this.cloneProps(o);
				return o;
			},

			/**
			 * Returns a string representation of this object.
			 * @method toString
			 * @return {String} a string representation of the instance.
			 **/
			toString : function() {
				return "[Visual (name="+  this.name +")]";
			}
		
		},

		
		// summary:
		//		a Shape object, which knows how to apply
		//		graphical attributes and transformations
	
		constructor: function(){
	
		},
		
		destroy: function(){
			// summary:
			//		Releases all internal resources owned by this shape. Once this method has been called,
			//		the instance is considered destroyed and should not be used anymore.
		}
		
	
	});
	 

	returen Visual;
});
