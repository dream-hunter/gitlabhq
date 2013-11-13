/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/kernel",
	"dojo/Deferred"
],function(kernel,Deferred) {
	var global = kernel.global;
	
	return global.Deferred = Deferred;
	
});	