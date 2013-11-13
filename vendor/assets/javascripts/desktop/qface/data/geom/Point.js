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

	var Point = declare(Geometry,{
		"-attributes-" : {
			// x: Number
			//		The X coordinate of the point, default value 0.
			"x" : {
				type : Number
			},
			// y: Number
			//		The Y coordinate of the point, default value 0.
			"y" : {
				type : Number
			}
		},
		"-methods-" : {
			move	: function(dx,dy) {
				this.x = thisx.+dx;
				this.y = this.y+dy;
			}
		},
		
		constructor	: function(x,y) {
			this.x = (x == null ? 0 : x);
			this.y = (y == null ? 0 : y);
		}
	});
	
	
	return Point;
	
});	
