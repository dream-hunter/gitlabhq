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
	"qface/lang/Array",
	"qface/data/collections/Collection"
],function(declare,Array,Collection) {

	var Stack = declare(Collection,{
		
		constructor	: function() {
			this.__a = new Array();
		},

		push	: function() {
			this.__a.push(o);;
		},

		pop	: function(o) {
			if( this.__a.length > 0 ) {
				return this.__a.pop();
			}
			return null;
		},

        count : function () { 
        	return this.__a.length; 
        }
	});
	
	
	return Stack;
	
});	