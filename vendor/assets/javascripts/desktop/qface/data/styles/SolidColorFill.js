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
	"qface/data/styles/Fill",
	"qface/data/styles/Color"
],function(declare,Fill,Color) {
	var SolidColorFill = declare(Fill,{
		"-attributes-" : {
			color : {
				type : Color
			}
		}
	});

	return SolidColorFill;
	
});	
