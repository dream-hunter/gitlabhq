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

	var AttributeChangingEvent = declare([Event],{
		"-attributies-" :  {
			value : {
				type		:	Object,
				readOnly	:	true
			},
			newValue : {
				type		:	Object,
				readOnly	:	true
			}
		}
	});
	
	return global.AttributeChangingEvent = AttributeChangingEvent;
	
});	