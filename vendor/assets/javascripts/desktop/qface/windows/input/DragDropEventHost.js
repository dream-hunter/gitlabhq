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
	"qface/windows/input/MouseLeaveEvent"
],function(declare,MouseDownEvent,MouseMoveEvent,MouseUpEvent,MouseEnterEvent,MouseLeaveEvent) {

	var DragDropEventHost = declare({

		"-events-"	:	{
			"dragStart"	:	{
				"type"	:	KeyDownEvent
			},
			"dragEnd"	:	{
				"type"	:	DragEndEvent
			},
			"dragMove"	:	{
				"type"	:	DragMoveEvent
			},
			"dragEnter"	:	{
				"type"	:	DragEnterEvent
			}
			"dragLeave"	:	{
				"type"	:	DragLeaveEvent
			},
			"dragMove"	:	{
				"type"	:	DragMoveEvent
			},
			"dragDrop"	:	{
				"type"	:	DragDropEvent
			}
		}
	});
	
	Object.mixin(DragDropEventHost,{
		"DragStartEvent" : DragStartEvent,
		"DragEndEvent" : DragEndEvent,
		"DragEnterEvent" : DragEnterEvent,
		"DragMoveEvent" : DragMoveEvent,
		"DragLeaveEvent" : DragLeaveEvent,
		"DragDropEvent" : DragDropEvent
	});

	return DragDropEventHost;
	
});	
