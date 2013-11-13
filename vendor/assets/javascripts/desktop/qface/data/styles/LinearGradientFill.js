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
	//線形グラデーションで領域を塗りつぶします
	//線に沿ったグラデーションを定義します。線の終点は、線形グラデーションの StartPoint 
	//プロパティおよび EndPoint プロパティによって定義されます。LinearGradientBrush ブラシは、
	//この線に沿って GradientStops を塗りつぶします。
	//既定の線形グラデーションは斜線です。既定では、線形グラデーションの StartPoint は (0,0)
	// (塗りつぶされる領域の左上隅) であり、EndPoint は (1,1) (塗りつぶされる領域の右下隅) です。
	//生成されるグラデーションの色は、斜線のパスに沿って補間されます。
	var LinearGradientFill = declare(GradientFill,{
		"--attributes--" : {
			//線形グラデーションの開始の 2 次元座標を取得または設定します
			"startPoint" : {
				type : Point,
				readOnly : true
			},
			//線形グラデーションの終了の 2 次元座標を取得または設定します
			"endPoint" : {
				type : Point,
				readOnly : true
			}
		},
		constructor : function(startPoint,endPoint){
			this._startPoint = startPoint;
			this._endPoint = endPoint;
		}

	});

	return LinearGradientFill;
	
});	