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
	"qface/windows/input/KeyDownEvent",
	"qface/windows/input/KeyUpEvent",
	"qface/windows/input/CharInputEvent"
],function(declare,KeyDownEvent,KeyUpEvent,CharInputEvent) {

	var KeyEventHost = declare({

		"-events-"	:	{
			"keyDown"	:	{
				"type"	:	KeyDownEvent
			}
			"keyUp"	:	{
				"type"	:	KeyUpEvent
			},
			"charInput"	:	{
				"type"	:	CharInputEvent
			}
		}
	});
	
	Object.mixin(KeyEventHost,{
		"KeyDownEvent"	:	KeyDownEvent,
		"KeyUpEvent"	:	KeyUpEvent,
		"CharInputEvent":	CharInputEvent
	});

	return KeyEventHost;
	
});	
