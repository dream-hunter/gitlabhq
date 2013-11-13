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
	var Alignment = declare(null,{
	});
	
	Alignment.Horz = Enum.declare(["Left","Center","Right","Stretch"]);
	
	Alignment.Vert = Enum.declare(["Top","Center","Bottom","Stretch"]);

	return aspect;
	
});	