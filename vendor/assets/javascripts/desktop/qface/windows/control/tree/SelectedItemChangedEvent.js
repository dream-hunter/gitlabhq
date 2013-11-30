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
	var SelectedItemChangedEvent = declare([InputEvent],{
		"-attributes-" : {
			
		}
	
	});
	

	return SelectedItemChangedEvent;
	
});	