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
	"qface/windows/input/GetFocusEvent",
	"qface/windows/input/LostFocusEvent"
],function(declare,GetFocusEvent,LostFocusEvent) {

	var FocusEventHost = declare({

		"-events-"	:	{
			"getFocus"	:	{
				"type"	:	GetFocusEvent
			},
			"lostFocus"	:	{
				"type"	:	LostFocusEvent
			},
		}
	});
	
	Object.mixin(FocusEventHost,{
		"GetFocusEvent"	:	GetFocusEvent,
		"LostFocusEvent"	:	LostFocusEvent
	});
	return FocusEventHost;
	
});	
