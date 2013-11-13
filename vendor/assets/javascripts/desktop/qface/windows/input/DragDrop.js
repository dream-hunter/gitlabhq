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
	"qface/windows/input/DragStartEvent",
	"qface/windows/input/DragEndEvent",
	"qface/windows/input/DragEnterEvent",
	"qface/windows/input/DragMoveEvent",
	"qface/windows/input/DragLeaveEvent",
	"qface/windows/input/DragDropEvent"
],function(declare,DragStartEvent,DragEndEvent,DragEnterEvent,DragMoveEvent,DragLeaveEvent,DragDropEvent) {

	var DragDrop = {
		"DragStartEvent" : DragStartEvent,
		"DragEndEvent" : DragEndEvent,
		"DragEnterEvent" : DragEnterEvent,
		"DragMoveEvent" : DragMoveEvent,
		"DragLeaveEvent" : DragLeaveEvent,
		"DragDropEvent" : DragDropEvent
	};
	
	return DragDrop;
	
});	