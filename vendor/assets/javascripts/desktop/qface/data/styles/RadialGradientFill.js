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
	"qface/data/styles/GradientFill"
],function(declare,GradientFill) {
	var RadialGradientFill = declare(GradientFill,{
		"--attributes--" : {
			//放射状グラデーションの外側の円の中心を取得または設定します。
			"center" : {
				type : Point,
				readOnly : true
			},
			//放射状グラデーションの外側の円の横半径を取得または設定します。
			"radiusX" : {
				type : Point,
				readOnly : true
			},
			//放射状グラデーションの外側の円の縦半径を取得または設定します。
			"radiusY" : {
				type : Point,
				readOnly : true
			}
		},	
		constructor : function(center,radiusX,radiusY) {
			this._center   = center;
			this._radiusX  = radiusX;
			this._radiusY  = radiusY;
		}	

	});

	return LinearGradientFill;
	
});	