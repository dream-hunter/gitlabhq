/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang"
	
],function(declare,lang) {

	lang.mixin(Function,{
		"hitch"    : lang.hitch,
		"delegate" : lang.delegate,
		"partial"  : lang.partial
	});


	// Cheap polyfill to approximate bind(), make Safari happy
	Function.prototype.bind = Function.prototype.bind || function(that){ 
	  return Function.hitch(that, this);
	};

	Function.Empty = function() {
	};

	return Function;
	
});	