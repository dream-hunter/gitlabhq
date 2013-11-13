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
	
	var Region = Enum.declare(["Top", "Bottom", "Leading", "Trailing", "Left", "Right", "Center"]);

	return Region;
	
});	