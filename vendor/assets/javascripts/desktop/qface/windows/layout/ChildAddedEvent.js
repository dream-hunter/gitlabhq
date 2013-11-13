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
	"qface/lang/Event"
],function(kernel,declare,Event) {

	var ChildAddedEvent = declare([Event],{
		"-attributies-" :  {
			child : {
				type		:	Object,
				readOnly	:	true
			},
			index : {
				type		:	Number,
				readOnly	:	true
			}
		}
	});
	
	return ChildAddedEvent;
	
});	