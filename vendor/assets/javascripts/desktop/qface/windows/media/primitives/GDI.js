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
	"qface/data/geom/Point",
	"qface/data/geom/Line",
	"qface/data/geom/Rect",
	"qface/data/geom/Circle",
	"qface/data/geom/Ellipse",
	"qface/data/geom/Polyline",
	"qface/data/geom/PolyStar"
], function(declare,extend,Object,Point,Line,Rect,Circle,Ellipse,Polyline,PolyStar){
	var pi = Math.PI, 
		twoPI = 2 * pi, 
		halfPI = pi /2;
		
    var canvas = document.createElement('canvas'), 
        context = canvas.getContext('2d'), 
        GDI = Object.getPrototypeOf(context);

	
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
		applyBrush : function(fillStyle){
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
		applyPen: function(strokeStyle, /* Boolean */ apply){
			var s = strokeStyle;
			if(s){
				this.strokeStyle = s.color.toRgba();
				this.lineWidth = s.lineWidth;
				gctx.lineCap = s.lineCap;
				gctx.miterLimit = s.miterLimit;

				gctx.lineJoin = s.lineJoin;
			}
		},

		//path api
		line : function(x1, y1, x2, y2){
			var ctx = this.getContext();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			return this;
		},

		roundRect    : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h,radius){
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
		
        //stroke api
		/**
		 * Stroke a line with all corners.
		 * @method strokeRect
		 * @param {Number} x1 x coordinate start point of line.
		 * @param {Number} y1 y coordinate start point of line.
		 * @param {Number} x2 x coordinate end point of line.
		 * @param {Number} y2 y coordinate end point of line.
		 * @return {DrawContext} The GDI instance the method is called on (useful for chaining calls.)
		 **/
		strokeLine : function(x1, y1, x2, y2){
			return this.line(x1,y1,x2,y2).stroke();
		},

		/**
		 * Stroke a rectangle with all corners with the specified radius.
		 * @method strokeRect
		 * @param {Number} x  x coordinate center point of rect.
		 * @param {Number} y  y coordinate center point of rect.
		 * @param {Number} w  width (horizontal diameter) of rect.
		 * @param {Number} h  height (vertical diameter) of rect.
		 * @param {Number} radius Corner radius.
		 * @return {DrawContext} The GDI instance the method is called on (useful for chaining calls.)
		 **/
		strokeRoundRect : function(x, y, w, h, radius) {
			return this.roundRect(x,y,w,h,radius).stroke();
		},

		/**
		 * Stroke a circle with the specified radius at (x, y).
		 * @method strokeCircle
		 * @param {Number} x x coordinate center point of circle.
		 * @param {Number} y y coordinate center point of circle.
		 * @param {Number} radius Radius of circle.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		strokeCircle : function(x, y, radius) {
			return this.arc(x,y, radius, 0, twoPI, 1).stroke();
		},

		/**
		 * Stroke an ellipse (oval) with a specified width (w) and height (h). Similar to {{#crossLink "DrawContext/drawCircle"}}{{/crossLink}},
		 * except the width and height can be different.
		 * @method strokeEllipse
		 * @param {Number} x x coordinate center point of ellipse.
		 * @param {Number} y y coordinate center point of ellipse.
		 * @param {Number} w width (horizontal diameter) of ellipse. The horizontal radius will be half of this number.
		 * @param {Number} h height (vertical diameter) of ellipse. The vertical radius will be half of this number.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		strokeEllipse : function(x,y,w,h) {
		    return this.oval(x, y, w, h).stroke();
		},

		/**
		 * Stroke an polyline  with  specified points.
		 *
		 **/
		strokePolyline : function(points){
		    return this.polyline(points).stroke();
		},

		/**
		 * Stroke an polygon  with  specified points.
		 *
		 **/
		strokePolygon : function(points){
		    return this.polyline(points,true).stroke();
		},

		/**
		 * Stroke a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of
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
		strokePolyStar : function(x, y, radius, sides, pointSize, angle) {
			return this.polyStar(x,y, radius, sides, pointSize,angle).stroke();
		},

		/**
		 * Fill a rectangle with all corners with the specified radius.
		 * @method strokeRect
		 * @param {Number} x  x coordinate center point of rect.
		 * @param {Number} y  y coordinate center point of rect.
		 * @param {Number} w  width (horizontal diameter) of rect.
		 * @param {Number} h  height (vertical diameter) of rect.
		 * @param {Number} radius Corner radius.
		 * @return {DrawContext} The GDI instance the method is called on (useful for chaining calls.)
		 **/
		fillRoundRect  : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h,radius){
			return this.roundRect(x,y,w,h,radius).fill();
		},		

		/**
		 * Fill a circle with the specified radius at (x, y).
		 * @method strokeCircle
		 * @param {Number} x x coordinate center point of circle.
		 * @param {Number} y y coordinate center point of circle.
		 * @param {Number} radius Radius of circle.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		fillCircle : function(x, y, radius) {
			return this.arc(x,y, radius, 0, twoPI, 1).fill();
		},


		/**
		 * Fill an ellipse (oval) with a specified width (w) and height (h). Similar to {{#crossLink "DrawContext/drawCircle"}}{{/crossLink}},
		 * except the width and height can be different.
		 * @method strokeEllipse
		 * @param {Number} x x coordinate center point of ellipse.
		 * @param {Number} y y coordinate center point of ellipse.
		 * @param {Number} w width (horizontal diameter) of ellipse. The horizontal radius will be half of this number.
		 * @param {Number} h height (vertical diameter) of ellipse. The vertical radius will be half of this number.
		 * @return {DrawContext} The DrawContext instance the method is called on (useful for chaining calls.)
		 **/
		fillEllipse : function(x,y,width,height){
		    return this.oval(x, y, width, height).fill();
		},

		/**
		 * Fill an polygon  with  specified points.
		 *
		 **/
		fillPolygon : function(poins){
		    return this.polyline(poins,true).fill();
		},

		/**
		 * Fill a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of
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
		fillPolyStar : function(x, y, radius, sides, pointSize, angle) {
			return this.polyStar(x,y, radius, sides, pointSize,angle).fill();
		},
		
        //draw  api
		drawLine : function(x1, y1, x2, y2){
			return this.line(x1,y1,x2,y2).stroke();
		},

		/**
		 * Draws a  rectangle with the specified geometry.
		 *
		 * @method drawRect
		 **/
		drawRect : function(pen,brush,/*Rect*/rect) {
			this.applyPen(pen).applyBrush(brush);
			return this.rect(rect.x,rect.y,rect.width,rect.height,rect.radius).fill().stroke();
		},

		/**
		 * Draws a circle with the specified geometry.
		 *
		 * @method drawCircle
		 **/
		drawCircle : function(pen,brush,/*Circle*/circle) {
			this.applyPen(pen).applyBrush(brush);
			return this.arc(circle.x,circle..y, circle.radius, 0, twoPI, 1).fill().stroke();
		},

		/**
		 * Draws an ellipse with the specified geometry.
		 * 
		 * @method drawEllipse
		 **/
		drawEllipse : function(pen,brush,/*Ellipse*/ellipse) {
			this.applyPen(pen).applyBrush(brush);
		    return this.oval(ellipse.x, ellipse.y, ellipse.width, ellipse.height).fill().stroke();
		},

		/**
		 * Draws an ellipse with the specified geometry.
		 * 
		 * @method drawPolygon
		 **/
		drawPolygon : function(pen,brush,/*Polyline*/polyline){
			this.applyPen(pen).applyBrush(brush);
		    return this.polyline(polyline.points,true).fill().stroke();
		},

		
		/**
		 * Draws a star if with the specified geometry.
		 * 
		 **/
		drawPolyStar : function(pen,brush,x, y, radius, sides, pointSize, angle) {
			return this.polyStar(x,y, radius, sides, pointSize,angle).fill().stroke();
		}
		
	});
	
	

	returen GDI;
});
