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
	var PanelVisual = declare(Visual, {
		// summary:
		//		a Shape object, which knows how to apply
		//		graphical attributes and transformations

		"-attributes-" : {
			// fillStyle: qfacex/data/styles/Fill
			//		a fill object
			//		(see qface/data/styles/LinearGradientFill,
			//		qface/data/styles/RadiaGradientFill,
			//		qface/data/styles/SolidColorFill)
			border : {
				type : Fill
			},
	
			// strokeStyle: qface/data/styles/Stroke
			//		a stroke object
			//		(see qface/data/styles/Stroke)

			border : {
				type : Stroke
			}
		},
		
		"-methods-"	:	{
			drawRaisedRect : function(g,x1,y1,w,h,d,brightest,middle) {
	            var x2 = x1 + w - 1, y2 = y1 + h - 1;
	            g.setColor(this.brightest);
	            g.drawLine(x1, y1, x2, y1);
	            g.drawLine(x1, y1, x1, y2);
	            g.setColor(this.middle);
	            g.drawLine(x2, y1, x2, y2 + 1);
	            g.drawLine(x1, y2, x2, y2);
			},
			
			drawSunkenRect : function(g,x1,y1,w,h,d,brightest,middle) {
	            var x2 = x1 + w - 1, y2 = y1 + h - 1;
	            g.setColor(this.middle);
	            g.drawLine(x1, y1, x2 - 1, y1);
	            g.drawLine(x1, y1, x1, y2 - 1);
	            g.setColor(this.brightest);
	            g.drawLine(x2, y1, x2, y2 + 1);
	            g.drawLine(x1, y2, x2, y2);
	            g.setColor(this.darkest);
	            g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2);
	            g.drawLine(x1 + 1, y1 + 1, x2, y1 + 1);
			},

			drawEtchedRect : function(g,x1,y1,w,h,d,brightest,middle) {
	            var x2 = x1 + w - 1, y2 = y1 + h - 1;
	            g.setColor(this.middle);
	            g.drawLine(x1, y1, x1, y2 - 1);
	            g.drawLine(x2 - 1, y1, x2 - 1, y2);
	            g.drawLine(x1, y1, x2, y1);
	            g.drawLine(x1, y2 - 1, x2 - 1, y2 - 1);

	            g.setColor(this.brightest);
	            g.drawLine(x2, y1, x2, y2);
	            g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2 - 1);
	            g.drawLine(x1 + 1, y1 + 1, x2 - 1, y1 + 1);
	            g.drawLine(x1, y2, x2 + 1, y2);
			},

			drawRaisedRect : function(g,x1,y1,w,h,d,brightest,middle) {
	            var x2 = x1 + w - 1, y2 = y1 + h - 1;
	            g.setColor(this.brightest);
	            g.drawLine(x1, y1, x2, y1);
	            g.drawLine(x1, y1, x1, y2);
	            g.setColor(this.middle);
	            g.drawLine(x2, y1, x2, y2 + 1);
	            g.drawLine(x1, y2, x2, y2);
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
		draw	:	function(){
		}
	});
		
	
	return Shape;
	
});	
