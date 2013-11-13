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
	"qface/windows/input/_DragSourceEvent"
],function(declare,DragSourceEvent) {
	var DragEndEvent = declare([DragSourceEvent],{
		touchCounter : 1,
		
		constructor	:     function (params){
	    }
	
	});
	

	return DragEndEvent;
	
});	
