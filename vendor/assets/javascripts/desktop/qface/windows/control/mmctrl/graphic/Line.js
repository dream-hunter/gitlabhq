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
	"qface/windows/controlss/shape/Shape"
],function(declare,Shape) {

	var Line = declare(Shape,{
		getBoundingBox: function(){
			// summary:
			//		returns the bounding box
			if(!this.bbox){
				var shape = this.shape;
				this.bbox = {
					x:		Math.min(shape.x1, shape.x2),
					y:		Math.min(shape.y1, shape.y2),
					width:	Math.abs(shape.x2 - shape.x1),
					height:	Math.abs(shape.y2 - shape.y1)
				};
			}
			return this.bbox;	// dojox/gfx.Rectangle
		},
		// summary:
		//		a line shape (Canvas)
		_renderShape: function(/* Object */ ctx){
			var s = this.shape;
			ctx.beginPath();
			ctx.moveTo(s.x1, s.y1);
			ctx.lineTo(s.x2, s.y2);
		}		
	});
	
	
	return Line;
	
});	
