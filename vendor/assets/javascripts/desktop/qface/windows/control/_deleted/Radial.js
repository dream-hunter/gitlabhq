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
	"qface/windows/Control/UIElement"
],function(declare,UIElement) {

	var Radial = declare(UIElement,{
		
		constructor	:function (c,w,r){
            this.colors = Array.prototype.slice.call(arguments, 0);
        },    

        paint : function(g,x,y,w,h,d){
            var cx1 = w/2, cy1 = w/2;
            this.gradient = g.createRadialGradient(cx1, cy1, 10, cx1, cy1, w < h ? w : h);
            for(var i=0;i<this.colors.length;i++) {
                this.gradient.addColorStop(i, this.colors[i].toString());
            }
            g.fillStyle = this.gradient;
            g.fillRect(x, y, w, h);
        }

	});
	
	
	return Radial;
	
});	
