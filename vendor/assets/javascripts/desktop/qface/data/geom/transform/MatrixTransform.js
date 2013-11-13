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

	//2-D の x-y 座標系内にある指定した点を中心として、オブジェクトを時計回りに回転します。

	var MatrixTransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return this.matrix.clone();
			}
		},
		"--attributes--" : {
			//この変換を定義する Matrix 構造体を取得または設定します。
			"matrix" : {
				type : Matrix,
				readOnly : true
			}
		},
		
		constructor : function(/*Martix*/matrix) {
			this._matrix = matrix;
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

	return MatrixTransform;
	
});	
