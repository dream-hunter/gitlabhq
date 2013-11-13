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
	
	//ControlStyle プロパティは，コントロールがマウスイベントをキャプチャするかどうか，コントロールが固定サイズかどうかなどの
	//コントロールの各種の属性を調べることができます。ControlStyle プロパティにはこれらの属性を示す一連のスタイルフラグが入っています。
	//CaptureMouse:マウスをクリックしたとき，コントロールはマウスイベントをキャプチャする。
	//
	var ControlStyle =  Enum.declare(["CaptureMouse","Movable","Focusable","Scrollable","CanHaveChildren","CanHaveOneChild"]);

	return ControlStyle;
	
});	