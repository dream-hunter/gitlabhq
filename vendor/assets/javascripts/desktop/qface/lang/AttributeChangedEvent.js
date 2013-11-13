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
	"qface/lang/declare",
	"qface/lang/Event"
],function(kernel,declare,Event) {
	var global = kernel.global;

	var AttributeChangedEvent = declare([Event],{
		"-attributies-" :  {
			oldValue : {
				type		:	Object,
				readOnly	:	true
			},
			value : {
				type		:	Object,
				readOnly	:	true
			}
		}
	});
	
	return global.AttributeChangedEvent = AttributeChangedEvent;
	
});	