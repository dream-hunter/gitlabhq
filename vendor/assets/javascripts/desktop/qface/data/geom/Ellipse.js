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

	var Ellipse = declare(Geometry,{
		"-privates-" : {
			_boundsGetter: function(){
				// summary:
				//		returns the bounding box
				var box = {
					x: this.cx - this.rx, 
					y: this.cy - this.ry,
					width: 2 * this.rx, 
					height: 2 * this.ry
				};
				return box;	
			}
		
		},
		"-attributes-" : {
			// cx: Number
			//		The X coordinate of the center of the ellipse, default value 0.
			"cx" : {
				type : Number
			},
			// cy: Number
			//		The Y coordinate of the center of the ellipse, default value 0.
			"cy" : {
				type : Number
			},
			// rx: Number
			//		The radius of the ellipse in the X direction, default value 200.
			"rx": {
				type : Number
			},
			// ry: Number
			//		The radius of the ellipse in the Y direction, default value 200.
			"ry": {
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

		constructor	: function(cx, cy, rx,ry) {
			this.cx = (cx == null ? 0 : cx);
			this.cy = (cy == null ? 0 : cy);
			this.rx = (rx == null ? 0 : rx);
			this.ry = (rx == null ? 0 : ry);
		}
	});
	
	
	return Ellipse;
	
});	
