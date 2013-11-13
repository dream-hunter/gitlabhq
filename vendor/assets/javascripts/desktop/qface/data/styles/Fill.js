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
	"qface/data/geom/transform/Transform"
],function(declare,Stateful,Transform) {
	var Fill = declare(Stateful,{
		"--attributes--" : {
			//塗りつぶし(Brush)の不透明度を取得または設定します。
			"opacity" : {
				type : Number
			},
			//塗りつぶし(Brush)に適用される変換を取得または設定します。 この変換は、
			//ブラシの出力がマップされて配置された後に適用されます。
			"transform" : {
				type : Transform 
			}
		}
	});

	return Fill;
	
});	
