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

	var PolyStar = declare(Geometry,{
		"-privates-" : {
			_boundsGetter: function(){
				// summary:
				//		returns the bounding box
				var p = this.points;
				var l = p.length;
				var t = p[0];
				var bbox = {l: t.x, t: t.y, r: t.x, b: t.y};
				for(var i = 1; i < l; ++i){
					t = p[i];
					if(bbox.l > t.x) bbox.l = t.x;
					if(bbox.r < t.x) bbox.r = t.x;
					if(bbox.t > t.y) bbox.t = t.y;
					if(bbox.b < t.y) bbox.b = t.y;
				}
				var box = {
					x:		bbox.l,
					y:		bbox.t,
					width:	bbox.r - bbox.l,
					height:	bbox.b - bbox.t
				};
				return box;	
			}
		
		},
		"-attributes-" : {
			"x" : {
				type : Number
			},
			"y" : {
				type : Number
			},
			"radius" : {
				type : Number
			},
			"sides" : {
				type : Number
			},
			"pointSize" : {
				type : Number
			},
			"angle" : {
				type : Number
			}
		},
		constructor : function(x, y, radius, sides, pointSize, angle){
			this._x = x;
			this._y = y;
			this._radius = radius;
			this._sides = sides;
			this._pointSize = pointSize;
			this._angle = angle;
		}
	});
	
	
	return PolyStar;
	
});	
