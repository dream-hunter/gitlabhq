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
	"qface/windows/control/primitives/PanelVisual"
],function(declare,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Fill,PanelVisual) {
	var ScrolledEvent = Control.ScrolledEvent = declare(InputEvent,{
		"-attributes-"	:	{
			sx	:	{
				type	:	Number
			},
			sy	:	{
				type	:	Number
			},
		},
		
		"-methods-"	:	{
	        scrollTo : function(x, y){
	            var psx = this.getSX(), psy = this.getSY();
	            if (psx != x || psy != y){
	                this.sx = x;
	                this.sy = y;
	                if (this.updated) this.updated(x, y, psx, psy);
	                if (this.target.catchScrolled) this.target.catchScrolled(psx, psy);
	                this._.scrolled(psx, psy);
	            }
	        },

	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        },
	        scrollXTo : function(v){ 
	        	this.scrollTo(v, this.getSY()); 
	        },
	        scrollYTo : function(v){ 
	        	this.scrollTo(this.getSX(), v); 
	        },
	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        }
		
		}
	
	});
	
	
	var ScrollManagerListeners = Listeners.Class("scrolled");

	var	ScrollManager = declare(null,{
		"-attributes-"	:	{
			sx	:	{
				type	:	Number
			},
			sy	:	{
				type	:	Number
			},
		},
		
		"-methods-"	:	{
	        scrollTo : function(x, y){
	            var psx = this.getSX(), psy = this.getSY();
	            if (psx != x || psy != y){
	                this.sx = x;
	                this.sy = y;
	                if (this.updated) this.updated(x, y, psx, psy);
	                if (this.target.catchScrolled) this.target.catchScrolled(psx, psy);
	                this._.scrolled(psx, psy);
	            }
	        },

	        makeVisible : function(x,y,w,h){
	            var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
	            this.scrollTo(p[0], p[1]);
	        },
	        scrollXTo : function(v){ 
	        	this.scrollTo(v, this.getSY()); 
	        },
	        scrollYTo : function(v){ 
	        	this.scrollTo(this.getSX(), v); 
	        }
		},
	
		constructor	:	function (c){
			this.sx = this.sy = 0;
			this._ = new ScrollManagerListeners();
			this.target = c;
		}
	});

	
	return ScrollManager;
	
});	
