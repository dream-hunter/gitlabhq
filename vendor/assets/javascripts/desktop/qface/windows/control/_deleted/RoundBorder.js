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

	var RoundBorder = declare(UIElement,{
		
		constructor	:function (col,size){
            this.color = null;
            this.size  = 1;

            if (arguments.length > 0) {
                if (zebra.isNumber(col)) this.size = col;
                else {
                    this.color = col;
                    if (zebra.isNumber(size)) this.size = size;
                }
            }
            this.gap = this.size;
        },    

        paint : function(g,x,y,w,h,d){
            if (this.color != null && this.size > 0) {
                this.outline(g,x,y,w,h,d);
                g.setColor(this.color);
                g.stroke();
            }
        },

        outline : function(g,x,y,w,h,d) {
            g.beginPath();
            g.lineWidth = this.size;
            g.arc(x + w/2, y + h/2, w/2, 0, 2*Math.PI, false);
            return true;
        }

	});
	
	
	return RoundBorder;
	
});	
