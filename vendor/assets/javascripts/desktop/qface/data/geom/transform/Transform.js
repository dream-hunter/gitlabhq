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
	"qface/data/geom/transform/Matrix"
],function(declare,Stateful,Matrix) {
	var Transform = declare(Stateful,{
		"--attributes--" : {
			//現在の変換を Matrix オブジェクトとして取得します。
			"value" : {
				type : Matrix
			}
		}
	});

	return Transform;
	
});	
