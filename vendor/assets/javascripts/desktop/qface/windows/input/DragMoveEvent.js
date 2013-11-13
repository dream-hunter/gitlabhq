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
	"qface/windows/input/_DragTargetEvent"
],function(declare,DragTargetEvent) {
	var DragMoveEvent = declare([DragTargetEvent],{
		touchCounter : 1,
		
		constructor	:     function (params){
	    }
	
	});
	

	return DragMoveEvent;
	
});	
