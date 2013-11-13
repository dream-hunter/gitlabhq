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
	"qface/lang/extend",
	"qface/lang/Object",
	"dojo/_base/event",
	"dojo/on",
	"dojo/touch",
	"dojo/dom-geometry",
	"qface/windows/input/Mouse",
	"qface/windows/input/Keyboard"
], function(declare,extend,Object,devent,on,touch,geom,Mouse,Keyboard){
	var pi = Math.PI, 
		twoPI = 2 * pi, 
		halfPI = pi /2;
		
    var canvas = document.createElement('canvas'), 
        context = canvas.getContext('2d'), 
        contextPrototype = Object.getPrototypeOf(context),
        devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1, 
        _pixelRatio = devicePixelRatio / backingStoreRatio;

	
	/**
	 *// back-reference to the canvas
	 *canvas                   : /*HtmlCanvasElement*/null,
	 *
	 *//state
	 *save                     : function(){}, //push state on state stack
	 *restore                  : function(){}, //pop state stack and restore state
	 *
	 *// transformations (default transform is the identity matrix)
	 *scale                    : function(/*Number*/ x, /*Number*/ y){},
	 *rotate                   : function(/*Number*/ angle){},
	 *translate                : function(/*Number*/x,/*Number*/ y){},
	 *transform                : function(/*Number*/ a, /*Number*/ b, /*Number*/ c, /*Number*/ d, /*Number*/ e, /*Number*/ f){},
	 *setTransform             : function(/*Number*/ a, /*Number*/ b, /*Number*/ c, /*Number*/ d, /*Number*/ e, /*Number*/ f){},
	 *
	 *// compositing
	 *globalAlpha              : /*Number*/ null, // (default 1.0)
	 *globalCompositeOperation : /*String*/ null, // (default source-over)
	 *
	 *// image smoothing
	 *imageSmoothingEnabled    : /*Boolean*/ null, // (default true)
	 *
	 *// colors and styles (see also the CanvasDrawingStyles interface)
	 *strokeStyle              : /*String|CanvasGradient|CanvasPattern*/ null,  // (default black)
	 *fillStyle                : /*String|CanvasGradient|CanvasPattern*/ null,  // (default black)
	 *createLinearGradient     : /*CanvasGradient*/ function(/*Number*/ x0, /*Number*/ y0, /*Number*/ x1, /*Number*/ y1){},
	 *createRadialGradient     : /*CanvasGradient*/ function(/*Number*/ x0, /*Number*/ y0, /*Number*/ r0, /*Number*/ x1, /*Number*/ y1, /*Number*/ r1){},
	 *createPattern            : /*CanvasPattern*/  function(/*HTMLImageElement|HTMLCanvasElement|HTMLVideoElement*/ image, /*String*/ repetition){},
	 *
	 *// shadows
	 *shadowOffsetX            : /*Number*/ null, // (default 0)
	 *shadowOffsetY            : /*Number*/ null, // (default 0)
	 *shadowBlur               : /*Number*/ null, // (default 0)
	 *shadowColor              : /*String*/ null, // (default transparent black)
	 *
	 *// rects
	 *clearRect                : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h){},
	 *fillRect                 : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h){},
	 *strokeRect               : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h){},
	 *
	 *// path API (see also CanvasPathMethods)
	 *beginPath                : function(){},
	 *fill                     : function(/*CanvasWindingRule*/ w){}, // (default w =  = "nonzero")
	 *fill                     : function(/*Path*/ path){},
	 *stroke                   : function(){},
	 *stroke                   : function(/*Path*/ path){},
	 *drawSystemFocusRing      : function(/*Element*/ element){},
	 *drawSystemFocusRing      : function(/*Path*/ path, /*Element*/ element){},
	 *drawCustomFocusRing      : /*Boolean*/ function(/*Element*/ element){},
	 *drawCustomFocusRing      : /*Boolean*/ function(/*Path*/ path, /*Element*/ element){},
	 *scrollPathIntoView       : function(){},
	 *scrollPathIntoView       : function(/*Path*/ path){},
	 *clip                     : function(/*CanvasWindingRule*/ w){}, // (default w =  = "nonzero")
	 *clip                     : function(/*Path*/ path){},
	 *isPointInPath            : /*Boolean*/function(/*Number*/ x, /*Number*/ y, optional CanvasWindingRule w = "nonzero"){},
	 *isPointInPath            : /*Boolean*/function(/*Path*/ path, /*Number*/ x, /*Number*/ y){},
	 *
	 *// text (see also the CanvasDrawingStyles interface)
	 *fillText                 : function(/*String*/ text, /*Number*/ x, /*Number*/ y, optional /*Number*/ maxWidth){},
	 *strokeText               : function(/*String*/ text, /*Number*/ x, /*Number*/ y, optional /*Number*/ maxWidth){},
	 *measureText              : /*TextMetrics*/ function(/*String*/ text){},
	 *
	 *// drawing images
	 *drawImage                : function(/*(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement*/ image, /*Number*/ dx, /*Number*/ dy){},
	 *drawImage                : function(/*(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement*/ image, /*Number*/ dx, /*Number*/ dy, /*Number*/ dw, /*Number*/ dh){},
	 *drawImage                : function(/*(HTMLImageElement|HTMLCanvasElement|HTMLVideoElement*/ image, /*Number*/ sx, /*Number*/ sy, /*Number*/ sw, /*Number*/ sh, /*Number*/ dx, /*Number*/ dy, /*Number*/ dw, /*Number*/ dh){},
	 *
	 *// hit regions
	 *addHitRegion             : function(/*HitRegionOptions*/ options){},
	 *removeHitRegion          : function(/*HitRegionOptions*/ options){},
	 *
	 *// pixel manipulation
	 *createImageData          : /*ImageData*/function(/*Number*/ sw, /*Number*/ sh){},
	 *createImageData          : /*ImageData*/function(ImageData imagedata){},
	 *getImageData             : /*ImageData*/function(/*Number*/ sx, /*Number*/ sy, /*Number*/ sw, /*Number*/ sh){},
	 *putImageData             : function(/*ImageData*/ imagedata, /*Number*/ dx, /*Number*/ dy, /*Number*/ dirtyX, /*Number*/ dirtyY, /*Number*/ dirtyWidth, /*Number*/ dirtyHeight){},
	 *putImageData             : function(/*ImageData*/ imagedata, /*Number*/ dx, /*Number*/ dy){},
	 *	
	 *//CanvasDrawingStyles
	 *// line caps/joins
	 *lineWidth                 : /*Number*/ null, // (default 1)
	 *lineCap                  : /*String*/ null, // "butt", "round", "square" (default "butt")
	 *lineJoin                 : /*String*/ null, // "round", "bevel", "miter" (default "miter")
	 *miterLimit               : /*Number*/ null, // (default 10)
	 *
	 *// dashed lines
	 *setLineDash              : function(/*sequence</*Number*/>*/ segments), // default empty
	 *getLineDash              : /*sequence</*Number*/>*/ function (),
	 *lineDashOffset           : /*Number*/ null,
	 *
	 *// text
	 *font                     : /*String*/ null, // (default 10px sans-serif)
	 *textAlign                : /*String*/ null, // "start", "end", "left", "right", "center" (default: "start")
	 *textBaseline             : /*String*/ null, // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom" (default: "alphabetic")
	 *
	 *//CanvasPathMethods 
	 *// shared path API methods
	 *closePath                : function();
	 *moveTo                   : function(/*Number*/ x, /*Number*/ y),
	 *lineTo                   : function(/*Number*/ x, /*Number*/ y),
	 *quadraticCurveTo         : function(/*Number*/ cpx, /*Number*/ cpy, /*Number*/ x, /*Number*/ y),
	 *bezierCurveTo            : function(/*Number*/ cp1x, /*Number*/ cp1y, /*Number*/ cp2x, /*Number*/ cp2y, /*Number*/ x, /*Number*/ y),
	 *arcTo                    : function(/*Number*/ x1, /*Number*/ y1, /*Number*/ x2, /*Number*/ y2, /*Number*/ radius),
	 *rect                     : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h),
	 *arc                      : function(/*Number*/ x, /*Number*/ y, /*Number*/ radius, /*Number*/ startAngle, /*Number*/ endAngle, /*Boolean*/ anticlockwise), //(default anticlockwise = false)
	 *ellipse                  : function(/*Number*/ x, /*Number*/ y, /*Number*/ radiusX, /*Number*/ radiusY,  /*Number*/ rotation, /*Number*/ startAngle, /*Number*/ endAngle, /*Boolean*/ anticlockwise)
	 *
	 */
	Object.mixin(contextPrototype,{
		applyFill : function(fillStyle){
			// prepare Canvas-specific structures
			var fs = fillStyle, f;
			var isLgf =  fs.isInstanceOf(LinearGradientFill),
				isRgf = isLgf?false:fs.isInstanceOf(RadialGradientFill);
			
			if (isLgf or isRgf){
				f = fs.type == "linear" ?
					this.createLinearGradient(fs.x1, fs.y1, fs.x2, fs.y2) :
					this.createRadialGradient(fs.cx, fs.cy, 0, fs.cx, fs.cy, fs.r);
				Array.forEach(fs.colors, function(step){
					f.addColorStop(step.offset, step.color.toRgba());
				});
			} else if (fs.isInstanceOf(SolidColorFill){
				f = fs.color.toRgba();
			}
			if (f) {
				this.fillStyle = f;
			}	
		},
		applyStroke: function(strokeStyle, /* Boolean */ apply){
			var s = strokeStyle;
			if(s){
				this.strokeStyle = s.color.toRgba();
				this.lineWidth = s.lineWidth;
				gctx.lineCap = s.lineCap;
				gctx.miterLimit = s.miterLimit;

				gctx.lineJoin = s.lineJoin;
			}
		},

		line : function(x1, y1, x2, y2){
			var ctx = this.getContext();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			return this;
		},

		rect    : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h,radius){
			var ctx = this.getContext();
			ctx.beginPath();
			var r = radius,
				xl = x, xr = xl + w, yt = y, yb = yt + h,
				xl2 = xl + r, xr2 = xr - r, yt2 = yt + r, yb2 = yb - r;
			ctx.moveTo(xl2, yt);
			if(r){
				ctx.arc(xr2, yt2, r, -halfPI, 0, false);
				ctx.arc(xr2, yb2, r, 0, halfPI, false);
				ctx.arc(xl2, yb2, r, halfPI, pi, false);
				ctx.arc(xl2, yt2, r, pi, pi + halfPI, false);
			}else{
				ctx.lineTo(xr2, yt);
				ctx.lineTo(xr, yb2);
				ctx.lineTo(xl2, yb);
				ctx.lineTo(xl, yt2);
			}
	 		ctx.closePath();
			return this;
		},

		oval : function(x,y,w,h){
			var ctx = this;
			ctx.beginPath();
			x += this.lineWidth;
			y += this.lineWidth;
			w -= 2 * this.lineWidth;
			h -= 2 * this.lineWidth;

			var kappa = 0.5522848, ox = (w / 2) * kappa, oy = (h / 2) * kappa,
			    xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
			ctx.moveTo(x, ym);
			ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		},

		polyline : function(points,close){
			var ctx = this.getContext();
			ctx.beginPath();
		    ctx.moveTo(points[0].x, points[0].y);
		    for(var i=1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
		    if (close) ctx.lineTo(points[0].x, points[0].y);
		},

		polyStar : function(x, y, radius, sides, pointSize, angle) {
			var ctx = this.getContext();
			ctx.beginPath();
			if (pointSize == null) { pointSize = 0; }
			pointSize = 1-pointSize;
			if (angle == null) { angle = 0; }
			else { angle /= 180/Math.PI; }
			var a = Math.PI/sides;
			
			ctx.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
			for (var i=0; i<sides; i++) {
				angle += a;
				if (pointSize != 1) {
					_ctx.lineTo(x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize);
				}
				angle += a;
				ctx.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
			}
			return this;
		},
		
        //geometry shape api
		drawLine : function(x1, y1, x2, y2){
			return this.line(x1,y1,x2,y2).stroke();
		},

		/**
		 * Draws a  rectangle with all corners with the specified radius.
		 * @method drawRoundRect
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} w
		 * @param {Number} h
		 * @param {Number} radius Corner radius.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		drawRect : function(x, y, w, h, radius) {
			return this.rect(x,y,w,h,radius).stroke();
		},

		/**
		 * Draws a circle with the specified radius at (x, y).
		 *
		 *      var g = new DrawContext();
		 *	    g.setStrokeStyle(1);
		 *	    g.beginStroke(DrawContext.getRGB(0,0,0));
		 *	    g.beginFill(DrawContext.getRGB(255,0,0));
		 *	    g.drawCircle(0,0,3);
		 *
		 *	    var s = new Shape(g);
		 *		s.x = 100;
		 *		s.y = 100;
		 *
		 *	    stage.addChild(s);
		 *	    stage.update();
		 *
		 * @method drawCircle
		 * @param {Number} x x coordinate center point of circle.
		 * @param {Number} y y coordinate center point of circle.
		 * @param {Number} radius Radius of circle.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		drawCircle : function(x, y, radius) {
			return this.arc(x,y, radius, 0, twoPI, 1).stroke();
		},

		/**
		 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {{#crossLink "DrawContext/drawCircle"}}{{/crossLink}},
		 * except the width and height can be different.
		 * @method drawEllipse
		 * @param {Number} x x coordinate center point of ellipse.
		 * @param {Number} y y coordinate center point of ellipse.
		 * @param {Number} w height (horizontal diameter) of ellipse. The horizontal radius will be half of this number.
		 * @param {Number} h width (vertical diameter) of ellipse. The vertical radius will be half of this number.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		drawEllipse : function(x,y,w,h) {
		    return this.oval(x, y, w, h).stroke();
		},

		drawPolyline : function(points){
		    return this.polyline(points).stroke();
		},

		drawPolygon : function(points){
		    return this.polyline(points,true).stroke();
		},

		drawDottedRect : function(x,y,w,h) {
		    var ctx = this, m = ["moveTo", "lineTo", "moveTo"];
		    function dv(x, y, s) { for(var i=0; i < s; i++) ctx[m[i%3]](x + 0.5, y + i); }
		    function dh(x, y, s) { for(var i=0; i < s; i++) ctx[m[i%3]](x + i, y + 0.5); }
		    ctx.beginPath();
		    dh(x, y, w);
		    dh(x, y + h - 1, w);
		    ctx.stroke();
		    ctx.beginPath();
		    dv(x, y, h);
		    dv(w + x - 1, y, h);
		    ctx.stroke();
		    return this;
		},

		drawDashLine : function(x,y,x2,y2) {
		    var pattern=[1,2], count = pattern.length, ctx = this, compute = null,
		        dx = (x2 - x), dy = (y2 - y), b = (Math.abs(dx) > Math.abs(dy)),
		        slope = b ? dy / dx : dx / dy, sign = b ? (dx < 0 ?-1:1) : (dy < 0?-1:1);

		    if (b) {
		        compute = function(step) {
		            x += step;
		            y += slope * step;
		        };
		    }
		    else {
		        compute = function(step) {
		            x += slope * step;
		            y += step;
		        };
		    }

		    ctx.moveTo(x, y);
		    var dist = Math.sqrt(dx * dx + dy * dy), i = 0;
		    while (dist >= 0.1) {
		        var dl = $MMI(dist, pattern[i % count]), step = Math.sqrt(dl * dl / (1 + slope * slope)) * sign;
		        compute(step);
		        ctx[(i % 2 === 0) ? 'lineTo' : 'moveTo'](x + 0.5, y + 0.5);
		        dist -= dl;
		        i++;
		    }
		    ctx.stroke();
		    return this;
		},
		
		/**
		 * Draws a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of
		 * points. For example, the following code will draw a familiar 5 pointed star shape centered at 100, 100 and with a
		 * radius of 50:
		 *      myDrawContext.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90);
		 *      // Note: -90 makes the first point vertical
		 *
		 * @method drawPolyStar
		 * @param {Number} x Position of the center of the shape.
		 * @param {Number} y Position of the center of the shape.
		 * @param {Number} radius The outer radius of the shape.
		 * @param {Number} sides The number of points on the star or sides on the polygon.
		 * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
		 * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
		 * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
		 * directly to the right of the center.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		drawPolyStar : function(x, y, radius, sides, pointSize, angle) {
			return this.polyStar(x,y, radius, sides, pointSize,angle).stroke();
		},

		fillEllipse : function(x,y,width,height){
		    return this.oval(x, y, width, height).fill();
		},
		fillRect  : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h,radius){
			return this.rect(x,y,w,h,radius).fill();
		},		
		fillCircle : function(x, y, radius) {
			return this.arc(x,y, radius, 0, twoPI, 1).fill();
		},

		fillPolygon : function(poins){
		    return this.polyline(poins,true).fill();
		},
		fillPolyStar : function(x, y, radius, sides, pointSize, angle) {
			return this.polyStar(x,y, radius, sides, pointSize,angle).fill();
		}
	});
	
	
	var Canvas = delcare(null,{
		dndController: _dndSource,

		_onVisualMouseEnter : function() {
		},
		
		_onVisualMouseLeave : function() {
		},
		
		
		
		_onMouseEnter : function() {
		},
		
		_onMouseLeave : function() {
		},
		
		_onMouseDown : function() {
		},
		 b
		_onMouseMove : function() {
		},

		_onMouseUp : function() {
		},

		_onKeyDown : function() {
		},

		_onKeyUp : function() {
		},
		
		_onKeyPress : function() {
		},
		
		_onDragStart : function() {
		},
		
		_onDragEnd : function() {
		},
		

		
		"-attributes-" : {
			rootVisual : {
				getter : function() {
				},
				
				setter : function(width) {
				}
			}
		},
		
		"-methods-" : {      
			position : function(visual) {
			},
			
		},
		
		
		consturctor : function(canvas) {
			this._canvas = canvas;
			if(this.dndController){
				if(lang.isString(this.dndController)){
					this.dndController = lang.getObject(this.dndController);
				}
				var params={};
				for(var i=0; i<this.dndParams.length;i++){
					if(this[this.dndParams[i]]){
						params[this.dndParams[i]] = this[this.dndParams[i]];
					}
				}
				this.dndController = new this.dndController(this, params);
			}
			
			var self = this;
			this._events = [
				on(canvas, touch.enter, function(e) {
					self._onMouseEnter(new MouseEnterEvent(e)))
				}),
				on(canvas, touch.leave, function(e) {
					self._onMouseLeave(new MouseLeaveEvent(e)))
				}),
				on(canvas, touch.press, function(e) {
					self._onMouseDown(new MouseEnterEvent(e)))
				}),
				on(canvas, touch.move, function(e) {
					self._onMouseMove(new MouseEnterEvent(e)))
				}),
				on(canvas, touch.release, function(e) {
					self._onMouseUp(new MouseEnterEvent(e)))
				}),
				on(canvas, "keydown", function(e) {
					self._onKeyDown(new MouseEnterEvent(e)))
				}),
				on(canvas, "keypress", function(e) {
					self._onKeyPress(new MouseEnterEvent(e)))
				}),
				on(canvas, "keyup", function(e) {
					self._onKeyUp(new MouseEnterEvent(e)))
				}),
				on(canvas, "focus", function(e) {
					self._onMouseEnter(new MouseEnterEvent(e)))
				}),
				on(canvas, "blur", function(e) {
					self._onMouseEnter(new MouseEnterEvent(e)))
				}),

				lang.hitch(this,"onMouseLeave")),
				on(canvas, touch.press, lang.hitch(this,"onMouseDown")),
				on(canvas, touch.move, lang.hitch(this, "onMouseMove")),
				on(canvas, touch.release,   lang.hitch(this, "onMouseUp")),
				on(canvas, "keydown",   lang.hitch(this, "onKeyDown")),
				on(canvas, "keyup",     lang.hitch(this, "onKeyUp")),
				// cancel text selection and text dragging
				on(canvas, "dragstart",   event.stop),
				on(canvas, "selectstart", event.stop)
			];
			
		},
		destroy: function(){
			// summary:
			//		Prepares this object to be garbage-collected

			var h;
			while(h = this.events.pop()){ h.remove(); }

			// this.clearItems();
			this.domNode =  null;
		},
		
	});

	var HostCanvas = {
		create : function(canvas){
			//this.Container_initialize();
			this.canvas = (typeof canvas == "string") ? document.getElementById(canvas) : canvas;
			this._pointerData = {};
			this.enableDOMEvents(true);		
		},
		/**
		 * Enables or disables (by passing a frequency of 0) mouse over events (mouseover and mouseout) for this stage's display
		 * list. These events can be expensive to generate, so they are disabled by default, and the frequency of the events
		 * can be controlled independently of mouse move events via the optional <code>frequency</code> parameter.
		 * @method enableMouseOver
		 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
		 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
		 * responsive, but uses less CPU.
		 **/
		enableMouseOver : function(frequency) {
			if (this._mouseOverIntervalID) {
				clearInterval(this._mouseOverIntervalID);
				this._mouseOverIntervalID = null;
			}
			if (frequency == null) { frequency = 20; }
			else if (frequency <= 0) { return; }
			var o = this;
			this._mouseOverIntervalID = setInterval(function(){ o._testMouseOver(); }, 1000/Math.min(50,frequency));
		},
		
		/**
		 * Enables or disables the  event listeners that stage adds to DOM elements (window, document and canvas).
		 * It is good practice to disable events when disposing of a Stage instance, otherwise the stage will
		 * continue to receive events from the page.
		 * @method enableDOMEvents
		 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events. Default is true.
		 **/
		enableDOMEvents : function(enable) {
			if (enable == null) { enable = true; }
			var n, o, ls = this._eventListeners;
			if (!enable && ls) {
				for (n in ls) {
					o = ls[n];
					o.t.removeEventListener(n, o.f);
				}
				this._eventListeners = null;
			} else if (enable && !ls) {
				var t = window.addEventListener ? window : document;
				var _this = this;
				ls = this._eventListeners = {};
				ls["mouseup"] = {t:t, f:function(e) { _this._handleMouseUp(e)} };
				ls["mousemove"] = {t:t, f:function(e) { _this._handleMouseMove(e)} };
				ls["dblclick"] = {t:t, f:function(e) { _this._handleDoubleClick(e)} };
				t = this.canvas;
				if (t) { ls["mousedown"] = {t:t, f:function(e) { _this._handleMouseDown(e)} }; }
				
				for (n in ls) {
					o = ls[n];
					o.t.addEventListener(n, o.f);
				}
			}
		},


		// private methods:
		
		/**
		 * @method _getPointerData
		 * @protected
		 * @param {Number} id
		 **/
		_getPointerData : function(id) {
			var data = this._pointerData[id];
			if (!data) {
				data = this._pointerData[id] = {x:0,y:0};
				// if it's the mouse (id == NaN) or the first new touch, then make it the primary pointer id:
				if (this._primaryPointerID == null) { this._primaryPointerID = id; }
			}
			return data;
		},

		/**
		 * @method _handleMouseMove
		 * @protected
		 * @param {MouseEvent} e
		 **/
		_handleMouseMove : function(e) {
			if(!e){ e = window.event; }
			this._handlePointerMove(-1, e, e.pageX, e.pageY);
		},
		
		/**
		 * @method _handlePointerMove
		 * @protected
		 * @param {Number} id
		 * @param {Event} e
		 * @param {Number} pageX
		 * @param {Number} pageY
		 **/
		_handlePointerMove : function(id, e, pageX, pageY) {
			if (!this.canvas) { return; } // this.mouseX = this.mouseY = null;
			var evt;
			var o = this._getPointerData(id);

			var inBounds = o.inBounds;
			this._updatePointerPosition(id, pageX, pageY);
			if (!inBounds && !o.inBounds && !this.mouseMoveOutside) { return; }
			
			if (this.onMouseMove || this.hasEventListener("stagemousemove"))  {
				evt = new createjs.MouseEvent("stagemousemove", o.x, o.y, this, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
				this.onMouseMove&&this.onMouseMove(evt);
				this.dispatchEvent(evt);
			}
			
			var oEvt = o.event;
			if (oEvt && (oEvt.onMouseMove || oEvt.hasEventListener("mousemove"))) {
				evt = new createjs.MouseEvent("mousemove", o.x, o.y, oEvt.target, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
				oEvt.onMouseMove&&oEvt.onMouseMove(evt);
				oEvt.dispatchEvent(evt, oEvt.target);
			}
		},

		/**
		 * @method _updatePointerPosition
		 * @protected
		 * @param {Number} id
		 * @param {Number} pageX
		 * @param {Number} pageY
		 **/
		_updatePointerPosition : function(id, pageX, pageY) {
			var rect = this._getElementRect(this.canvas);
			pageX -= rect.left;
			pageY -= rect.top;
			
			var w = this.canvas.width;
			var h = this.canvas.height;
			pageX /= (rect.right-rect.left)/w;
			pageY /= (rect.bottom-rect.top)/h;
			var o = this._getPointerData(id);
			if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w-1 && pageY <= h-1)) {
				o.x = pageX;
				o.y = pageY;
			} else if (this.mouseMoveOutside) {
				o.x = pageX < 0 ? 0 : (pageX > w-1 ? w-1 : pageX);
				o.y = pageY < 0 ? 0 : (pageY > h-1 ? h-1 : pageY);
			}
			
			o.rawX = pageX;
			o.rawY = pageY;
			
			if (id == this._primaryPointerID) {
				this.mouseX = o.x;
				this.mouseY = o.y;
				this.mouseInBounds = o.inBounds;
			}
		},
		
		/**
		 * @method _getElementRect
		 * @protected
		 * @param {HTMLElement} e
		 **/
		_getElementRect : function(e) {
			var bounds;
			try { bounds = e.getBoundingClientRect(); } // this can fail on disconnected DOM elements in IE9
			catch (err) { bounds = {top: e.offsetTop, left: e.offsetLeft, width:e.offsetWidth, height:e.offsetHeight}; }
			
			var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
			var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || document.body.clientTop  || 0);
			
			var styles = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle; // IE <9 compatibility.
			var padL = parseInt(styles.paddingLeft)+parseInt(styles.borderLeftWidth);
			var padT = parseInt(styles.paddingTop)+parseInt(styles.borderTopWidth);
			var padR = parseInt(styles.paddingRight)+parseInt(styles.borderRightWidth);
			var padB = parseInt(styles.paddingBottom)+parseInt(styles.borderBottomWidth);
			
			// note: in some browsers bounds properties are read only.
			return {
				left: bounds.left+offX+padL,
				right: bounds.right+offX-padR,
				top: bounds.top+offY+padT,
				bottom: bounds.bottom+offY-padB
			}
		},

		/**
		 * @method _handleMouseUp
		 * @protected
		 * @param {MouseEvent} e
		 **/
		_handleMouseUp : function(e) {
			this._handlePointerUp(-1, e, false);
		},
		
		/**
		 * @method _handlePointerUp
		 * @protected
		 * @param {Number} id
		 * @param {Event} e
		 * @param {Boolean} clear
		 **/
		_handlePointerUp : function(id, e, clear) {
			var o = this._getPointerData(id);
			var evt;
			
			if (this.onMouseMove || this.hasEventListener("stagemouseup")) {
				evt = new createjs.MouseEvent("stagemouseup", o.x, o.y, this, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
				this.onMouseUp&&this.onMouseUp(evt);
				this.dispatchEvent(evt);
			}
			
			var oEvt = o.event;
			if (oEvt && (oEvt.onMouseUp || oEvt.hasEventListener("mouseup"))) {
				evt = new createjs.MouseEvent("mouseup", o.x, o.y, oEvt.target, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
				oEvt.onMouseUp&&oEvt.onMouseUp(evt);
				oEvt.dispatchEvent(evt, oEvt.target);
			}
			
			var oTarget = o.target;
			if (oTarget && (oTarget.onClick  || oTarget.hasEventListener("click")) && this._getObjectsUnderPoint(o.x, o.y, null, true, (this._mouseOverIntervalID ? 3 : 1)) == oTarget) {
				evt = new createjs.MouseEvent("click", o.x, o.y, oTarget, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
				oTarget.onClick&&oTarget.onClick(evt);
				oTarget.dispatchEvent(evt);
			}
			
			if (clear) {
				if (id == this._primaryPointerID) { this._primaryPointerID = null; }
				delete(this._pointerData[id]);
			} else { o.event = o.target = null; }
		},

		/**
		 * @method _handleMouseDown
		 * @protected
		 * @param {MouseEvent} e
		 **/
		_handleMouseDown : function(e) {
			this._handlePointerDown(-1, e, false);
		},
		
		/**
		 * @method _handlePointerDown
		 * @protected
		 * @param {Number} id
		 * @param {Event} e
		 * @param {Number} x
		 * @param {Number} y
		 **/
		_handlePointerDown : function(id, e, x, y) {
			var o = this._getPointerData(id);
			if (y != null) { this._updatePointerPosition(id, x, y); }
			
			if (this.onMouseDown || this.hasEventListener("stagemousedown")) {
				var evt = new createjs.MouseEvent("stagemousedown", o.x, o.y, this, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
				this.onMouseDown&&this.onMouseDown(evt);
				this.dispatchEvent(evt);
			}
			
			var target = this._getObjectsUnderPoint(o.x, o.y, null, (this._mouseOverIntervalID ? 3 : 1));
			if (target) {
				o.target = target;
				if (target.onPress || target.hasEventListener("mousedown")) {
					evt = new createjs.MouseEvent("mousedown", o.x, o.y, target, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
					target.onPress&&target.onPress(evt);
					target.dispatchEvent(evt);
					
					if (evt.onMouseMove || evt.onMouseUp || evt.hasEventListener("mousemove") || evt.hasEventListener("mouseup")) { o.event = evt; }
				}
			}
		},

		/**
		 * @method _testMouseOver
		 * @protected
		 **/
		_testMouseOver : function() {
			// for now, this only tests the mouse.
			if (this._primaryPointerID != -1) { return; }
			
			// only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
			if (this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) { return; }
			var target = null;
			if (this.mouseInBounds) {
				target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
				this._mouseOverX = this.mouseX;
				this._mouseOverY = this.mouseY;
			}
			
			var mouseOverTarget = this._mouseOverTarget;
			if (mouseOverTarget != target) {
				var o = this._getPointerData(-1);
				if (mouseOverTarget && (mouseOverTarget.onMouseOut ||  mouseOverTarget.hasEventListener("mouseout"))) {
					var evt = new createjs.MouseEvent("mouseout", o.x, o.y, mouseOverTarget, null, -1, o.rawX, o.rawY);
					mouseOverTarget.onMouseOut&&mouseOverTarget.onMouseOut(evt);
					mouseOverTarget.dispatchEvent(evt);
				}
				if (mouseOverTarget) { this.canvas.style.cursor = ""; }
				
				if (target && (target.onMouseOver || target.hasEventListener("mouseover"))) {
					evt = new createjs.MouseEvent("mouseover", o.x, o.y, target, null, -1, o.rawX, o.rawY);
					target.onMouseOver&&target.onMouseOver(evt);
					target.dispatchEvent(evt);
				}
				if (target) { this.canvas.style.cursor = target.cursor||""; }
				
				this._mouseOverTarget = target;
			}
		},

		/**
		 * @method _handleDoubleClick
		 * @protected
		 * @param {MouseEvent} e
		 **/
		_handleDoubleClick : function(e) {
			var o = this._getPointerData(-1);
			var target = this._getObjectsUnderPoint(o.x, o.y, null, (this._mouseOverIntervalID ? 3 : 1));
			if (target && (target.onDoubleClick || target.hasEventListener("dblclick"))) {
				evt = new createjs.MouseEvent("dblclick", o.x, o.y, target, e, -1, true, o.rawX, o.rawY);
				target.onDoubleClick&&target.onDoubleClick(evt);
				target.dispatchEvent(evt);
			}
		}
		
	
	};
	returen EventedCanvas;
});
