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
	"qface/data/geom/Point"
],function(declare,Geometry,Point) {

	var Line = declare(Geometry,{
		"-privates-" : {
			_boundsGetter: function(){
				// summary:
				//		returns the bounding box
				var box = {
					x:		Math.min(this.x1, this.x2),
					y:		Math.min(this.y1, this.y2),
					width:	Math.abs(this.x2 - this.x1),
					height:	Math.abs(this.y2 -this.y1)
				};
				return box;	
			}
		
		},
		
		"-attributes-" : {
			// x1: Number
			//		The X coordinate of the start of the line, default value 0.
			"x1" : {
				type : Number
			},
			// y1: Number
			//		The Y coordinate of the start of the line, default value 0.
			"y1" : {
				type : Number
			},
			// x2: Number
			//		The X coordinate of the end of the line, default value 100.
			"x2" : {
				type : Number
			},
			// y2: Number
			//		The Y coordinate of the end of the line, default value 100.
			"y2" : {
				type : Number
			},
			"startPoint" :{
				getter : function(){
					return new Point(this.x1,this.y1);
				}
			},
			"endPointer" :{
				getter : function(){
					return new Point(this.x2,this.y2);
				}
			}
		},
		
		"-methods-" : {
			move	: function(dx,dy) {
			},

			containPoint : function(p) {
			}
		}

		constructor	: function(x1, y1, x2, y2) {
			this.x1 = (x1 == null ? 0 : x1);
			this.y1 = (y1 == null ? 0 : y1);
			this.x2 = (x2 == null ? 0 : x2);
			this.y2 = (y2 == null ? 0 : y2);
		}

	});
	
	
	return Line;
	
});	
