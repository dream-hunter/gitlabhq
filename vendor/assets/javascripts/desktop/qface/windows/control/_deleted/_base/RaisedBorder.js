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
	"qface/windows/controlss/_base/UIElement"
],function(declare,UIElement) {

	var RaisedBorder = declare(UIElement,{
		
		constructor	: function(brightest,middle) {
	        this.brightest = brightest == null ? "white" : brightest;
	        this.middle    = middle    == null ? "gray"  : middle;
		},

		paint	: function(g,x1,y1,w,h,d) {
            var x2 = x1 + w - 1, y2 = y1 + h - 1;
            g.setColor(this.brightest);
            g.drawLine(x1, y1, x2, y1);
            g.drawLine(x1, y1, x1, y2);
            g.setColor(this.middle);
            g.drawLine(x2, y1, x2, y2 + 1);
            g.drawLine(x1, y2, x2, y2);
		}
	});
	
	
	return RaisedBorder;
	
});	
