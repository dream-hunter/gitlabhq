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
	"qface/lang/Set",
	"qface/windows/control/primitives/ControlStyle"
],function(declare,Set,ControlStyle) {
	
	//ControlStyle プロパティは，コントロールがマウスイベントをキャプチャするかどうか，コントロールが固定サイズかどうかなどの
	//コントロールの各種の属性を調べることができます。ControlStyle プロパティにはこれらの属性を示す一連のスタイルフラグが入っています。
	//CaptureMouse:マウスをクリックしたとき，コントロールはマウスイベントをキャプチャする。
	//
	//var ControlStyle =  Enum.declare(["CaptureMouse","Movable","Focusable","Scrollable"]);

	return Set.declare(ControlStyle);
	
});	