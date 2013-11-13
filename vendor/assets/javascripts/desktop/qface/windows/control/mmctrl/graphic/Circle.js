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

	var Circle = declare(Shape,{
		getBoundingBox: function(){
			// summary:
			//		returns the bounding box
			if(!this.bbox){
				var shape = this.shape;
				this.bbox = {x: shape.cx - shape.r, y: shape.cy - shape.r,
					width: 2 * shape.r, height: 2 * shape.r};
			}
			return this.bbox;	// dojox/gfx.Rectangle
		},
		// summary:
		//		a line shape (Canvas)
		_renderShape: function(/* Object */ ctx){
			var s = this.shape;
			ctx.beginPath();
			ctx.arc(s.cx, s.cy, s.r, 0, twoPI, 1);
		}		
	});
	
	
	return Circle;
	
});	
