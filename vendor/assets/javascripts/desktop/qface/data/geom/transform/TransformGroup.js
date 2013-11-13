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
	"qface/data/geom/transform/Transform",
	"qface/data/geom/Point",
	"qface/data/geom/Rect"
],function(declare,Stateful,Transform,Point,Rect) {

	//他の Transform オブジェクトで構成される複合 Transform を表します。

	var TransformGroup = declare(Transform,{
		"--attributes--" : {
			//この TransformGroup を定義する TransformCollection を取得または設定します。
			"children" : {
				type : Collection,
				readOnly : true
			}
		},
		
		constructor : function() {
		},
		
		//この ScaleTransform の値の詳細コピーを作成して返します。
		clone : /*ScaleTransform*/function() {
		},
		
		//指定した点を変換し、結果を返します。
		transform : /*Point*/function(/*Point*/point) {
		},
		
		//指定された境界ボックスを変換し、それをちょうど格納できる大きさの軸平行境界ボックスを返します。
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		}
	});

	return TransformGroup;
	
});	
