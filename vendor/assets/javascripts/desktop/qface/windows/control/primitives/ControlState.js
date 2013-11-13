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
	"qface/lang/Enum"
],function(declare,Enmu) {
	
	//Creating:
	//LButtonDown:
	//Clicked
	//Focusing
	//Destroying
	//
	//
	var ControlState = Enum.declare(["Creating","LButtonDown","Clicked","Focusing","Disabled","Destroying",""]);

	return ControlState;
	
});	