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
	"qface/lang/Stateful"
],function(declare,Stateful) {

	var UIElement = declare(Stateful,{
		gap : 2,
		
		constructor	: function() {
		},

		getLeft	: function() {
			return this.gap;
		},

		getTop	: function() {
			return this.gap;
		},

		getRight	: function() {
			return this.gap;
		},
		
		getBottom	: function() {
			return this.gap;
		},


		getPreferredSize	: function(){
			return { width:0, height:0 }; 
		},

		paint	: function() {
		}
	});
	
	
	return UIElement;
	
});	