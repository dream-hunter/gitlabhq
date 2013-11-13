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
	"qface/windows/input/MouseDownEvent",
	"qface/windows/input/MouseMoveEvent",
	"qface/windows/input/MouseUpEvent",
	"qface/windows/input/MouseEnterEvent",
	"qface/windows/input/MouseLeaveEvent",
	"qface/windows/input/ClickEvent",
	"qface/windows/input/DoubleClickEvent"
],function(declare,MouseDownEvent,MouseMoveEvent,MouseUpEvent,MouseEnterEvent,MouseLeaveEvent,ClickEvent,DoubleClickEvent) {
	var Mouse = {
		"MouseDownEvent" 	: MouseDownEvent,
		"MouseMoveEvent"	: MouseMoveEvent,
		"MouseUpEvent"		: MouseUpEvent,
		"MouseEnterEvent" 	: MouseEnterEvent,
		"MouseLeaveEvent" 	: MouseLeaveEvent,
		"ClickEvent" 		: ClickEvent,
		"DoubleClickEvent" 	: DoubleClickEvent
	
	};

	return Mouse;
	
});	