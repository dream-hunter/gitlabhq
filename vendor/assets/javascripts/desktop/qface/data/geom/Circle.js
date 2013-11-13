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
	"qface/data/geom/Geometry"
],function(declare,Geometry) {

	var Circle = declare(Geometry,{
		"-privates-" : {
			_boundsGetter: function(){
				// summary:
				//		returns the bounding box
				var box = {
					x: this.cx - this.r, 
					y: this.cy - this.r,
					width: 2 * this.r, 
					height: 2 * this.r
				};
				return box;	
			}
		
		},
		"-attributes-" : {
			// cx: Number
			//		The X coordinate of the center of the circle, default value 0.
			"cx" : {
				type : Number
			},
			// cy: Number
			//		The Y coordinate of the center of the circle, default value 0.
			"cy" : {
				type : Number
			},
			// r: Number
			//		The radius, default value 100.
			"r": {
				type : Number
			}
		},
		"-methods-" : {
			move	: function(dx,dy) {
				this.cx = this.cx.+dx;
				this.cy = this.cy+dy;
			},

			containPoint : function(p) {
			}
		},

		constructor	: function(cx, cy, r) {
			this.cx = (cx == null ? 0 : cx);
			this.cy = (cy == null ? 0 : cy);
			this.r = (r == null ? 0 : r);
		}
	});
	
	
	return Circle;
	
});	
