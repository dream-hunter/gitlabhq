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
	"qface/data/geom/Geometry",
	"qface/data/geom/Rect",
	"qface/data/geom/Ellipse",
	"qface/data/geom/Line",
	"qface/data/geom/Polyline",
	"qface/data/geom/Arrow",
	"qface/data/styles/Stroke",
	"qface/data/styles/Fill",
	"qface/windows/media/Visual"
],function(declare,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Fill,Visual) {
	var GeometryRender = {
		Rect.qfaceId : function(gctx,gs){
			gctx.rect(gs.x,gs.y.gs.width,gs.height,gs.r);
		},
		Ellipse.qfaceId : function(gctx,gs){
			gctx.oval(gs.cx-gs.rx,gs.cy-gs.ry,gs.rx*2,gs.ry*2);
		},
		Line.qfaceId : function(gctx,gs){
			gctx.line(gs.x1,gs.y1.gs.x2,gs.y2);
		},
		Polyline.qfaceId : function(gctx,gs){
			gctx.polyline(gs.cx-gs.r,gs.cy-gs.r,gs.r*2,gs.r*2);
		},
		Circle.qfaceId : function(gctx,gs) {
			gctx.oval(gs.cx-gs.r,gs.cy-gs.r,gs.r*2,gs.r*2);
		},
		Arrow.qfaceId : function(gctx,gs) {
			var x = gs.x,y=gs.y,w=gs.width,h=gs.height,d=gs.direction,g=gctx,D=Arrow.Direction;
			var s = Math.min(w, h);

			x = x + (w-s)/2;
			y = y + (h-s)/2;

			g.beginPath();
			if (D.Bottom == d) {
			    g.moveTo(x, y);
			    g.lineTo(x + s, y);
			    g.lineTo(x + s/2, y + s);
			    g.lineTo(x, y);
			}
			else {
			    if (D.Top == d) {
			        g.moveTo(x, y + s);
			        g.lineTo(x + s, y + s);
			        g.lineTo(x + s/2, y);
			        g.lineTo(x, y + s);
			    }
			    else {
			        if (D.Left == this.direction) {
			            g.moveTo(x + s, y);
			            g.lineTo(x + s, y + s);
			            g.lineTo(x, y + s/2);
			            g.lineTo(x + s, y);
			        }
			        else {
			            g.moveTo(x, y);
			            g.lineTo(x, y + s);
			            g.lineTo(x + s, y + s/2);
			            g.lineTo(x, y);
			        }
			    }
			}
         }
		
	};
	
	
	var GeometryVisual = declare(Visual, {
		// summary:
		//		a Shape object, which knows how to apply
		//		graphical attributes and transformations

		"-attributes-" : {
			// fillStyle: qfacex/data/styles/Fill
			//		a fill object
			//		(see qface/data/styles/LinearGradientFill,
			//		qface/data/styles/RadiaGradientFill,
			//		qface/data/styles/SolidColorFill)
			fillStyle : {
				type : Fill
			},
	
			// strokeStyle: qface/data/styles/Stroke
			//		a stroke object
			//		(see qface/data/styles/Stroke)

			strokeStyle : {
				type : Stroke
			},

			// geometry: Object
			//		an abstract Geometry object
			//		(see qface/data/geom/Path,
			//		qface/data/geom/Polyline,
			//		qface/data/geom/Rect,
			//		qface/data/geom/Ellipse,
			//		qface/data/geom/Circle,
			//		qface/data/geom/Line)
			geometry : {
				type : Geometry
			}
			
		},

	
		constructor: function(){
	
			this.strokeStyle = null;
		},
		
		destroy: function(){
			// summary:
			//		Releases all internal resources owned by this shape. Once this method has been called,
			//		the instance is considered destroyed and should not be used anymore.
		},
	
		getBoundingBox: function(){
			// summary:
			//		Returns the bounding box Rectangle for this shape or null if a BoundingBox cannot be
			//		calculated for the shape on the current renderer or for shapes with no geometric area (points).
			//		A bounding box is a rectangular geometric region
			//		defining the X and Y extent of the shape.
			//		(see dojox/gfx.defaultRect)
			//		Note that this method returns a direct reference to the attribute of this instance. Therefore you should
			//		not modify its value directly but clone it instead.
			return this.geometry.bounds;	//{x:0,y:0,width:100,height:100}
		},
		_render: function(/* Object */ gctx){
			// summary:
			//		render the shape
			this._renderGeometry(gctx);
			gctx.applyFill(this,fillStyle);
			gctx.fill();
			gctx.applyStroke(this.strokeStyle);
			gctx.stroke();
		},
		_renderGeometry: function(/* Object */ gctx){
			// nothing
			var id = this.geometry.qfaceId;
			if (id && GeometryRender[id]) {
				GeometryRender[id](gctx,this.geometry);
			}
		}
		
	});
		
	
	return Shape;
	
});	
