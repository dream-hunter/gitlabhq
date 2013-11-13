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
	"qface/data/geom/Position",
	"qface/windows/input/_InputEvent"
],function(declare,Position,InputEvent) {
	var MouseEvent = declare([InputEvent],{
		"-attributes-" : {
			leftButton : {
				type	:	Boolean,
				default	:	false,
				readOnly : true
			},
			middleButton : {
				type	:	Boolean,
				default	:	false,
				readOnly : true
			},
			rightButton : {
				type	:	Boolean,
				default	:	false,
				readOnly : true
			},
			position : {
				type	:	Position,
				default	:	new Position(0,0),
				readOnly : true
			},
			idDragging	:	{
				type	:	Boolean,
				default	:	false,
				readOnly : true
			},
			idDraggable	:	{
				type	:	Boolean,
				default	:	false,
				readOnly : true
			},
			dragObject	:	{
				type	:	DragObject,
				default	:	null,
				readOnly	: true
			}
			
			
		}
	
	});
	

	return MouseEvent;
	
});	
