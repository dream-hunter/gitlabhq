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
	"qface/lang/Enum",
	"qface/data/geom/Geometry",
	"qface/data/geom/Point"
],function(declare,Geometry,Point) {
	var Direction = Arrow.Direction = Enum.declare(["Left","Right","Top","Bottom"]);
	var Arrow = declare(Geometry,{
		"-privates-" : {
			_boundsGetter: function(){
				// summary:
				//		returns the bounding box
				var box = {
					x:		this.x,
					y:		this.y,
					width:	this.width,
					height:	this.height
				};
				return box;	
			}
		
		},
		"-attributes-" : {
			"x" : {
				type : Number
			},
			// y: Number
			//		The Y coordinate of the default rectangle's position, value 0.
			"y" : {
				type : Number
			},
			// width: Number
			//		The width of the default rectangle, value 100.
			"width" : {
				type : Number
			},
			// height: Number
			//		The height of the default rectangle, value 100.
			"height" : {
				type : Number
			},
			// r: Number
			//		The corner radius for the default rectangle, value 0.
			"direction": {
				type : Direction
			},
			"leftTop" :{
				getter : function(){
					return new Point(this.x,this.y);
				}
			},
			"leftBottom" :{
				getter : function(){
					return new Point(this.x,this.y+this.height);
				}
			},
			"rightTop" :{
				getter : function(){
					return new Point(this.x+this.width,this.y);
				}
			}
			"rightBottom" :{
				getter : function(){
					return new Point(this.x+this.width,this.y+this.height);
				}
			}
		},
		"-methods-" : {
			move	: function(dx,dy) {
				this.x = thisx.+dx;
				this.y = this.y+dy;
			},

			containPoint : function(p) {
				var x = p.x;
				var y = p.y;
				return (x>=this.x) && (x<this.x+this.width) && (y>=this.y) && (y<this.y+this.height);
			}
		},


		constructor	: function(x, y, width, height,direction) {
			this._x = x ? x : 0;
			this._y = y ? y : 0;
			this._width = width ?  width : 0;
			this._height = height  ? height : 0;
			this._direction = direction ? direction : Direction.Left;
		}
	});
	
	
	return Arrow;
	
});	
