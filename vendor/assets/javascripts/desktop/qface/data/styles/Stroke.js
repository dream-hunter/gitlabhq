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
	"qface/lang/Stateful",
	"qface/data/styles/Fill"
],function(declare,Stateful,Fill) {
	var Stroke = declare(Stateful,{
		"--attributes--" : {
			//ストロークの太さを取得または設定します。
			lineWidth : {
				type   : Number,	
			},
			//ストロークの終点に使用する形状の種類を取得または設定します。
			lineCap : {
				type  : StrokeStyle.LineGap
			},
			//形状のアウトラインの頂点で使用する接合の種類を取得または設定します。 既定値 Miter です
			lineJoin : {
			},
			
			//Thickness の半分に対する、接合部の長さの割合に関する制限を取得または設定します。
			//Thickness の半分に対する、接合部の長さの割合に関する制限を取得または設定します。
			miterLimit : {
				type   : Number,			
			},
			//
			lineDash : {
				type   : Number,			
			},
			//
			lineDashOffset : {
				type   : Number,			
			},
			//
			lineDashOffset : {
				fill   : Fill,			
			}
			
			
		}
	});
	
	Stroke.LineGap = Enum.declare(["butt", "round", "square"]);

	Stroke.LineJoin = Enum.declare(["round", "bevel", "miter"]);
	
	return Stroke;
	
});	