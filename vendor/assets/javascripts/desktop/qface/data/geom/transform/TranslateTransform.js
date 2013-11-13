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
	"qface/data/geom/transform/Matrix",
	"qface/data/geom/Point",
	"qface/data/geom/Rect"
],function(declare,Transform,Matrix,Point,Rect) {
	//TranslateTransform は、x 軸および y 軸に沿った軸平行変換を定義します。 オフセット (dx、dy) に
	//よる変換の変換行列を次の図に示します。
	//2-D 変換の標準の 3 x 3 行列
    //|1   0   dx|
    //|0   1   dy|
    //|0   0    1|

	var TranslateTransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return Matrix.translate(this.x,this.y);
			}
		},
		"--attributes--" : {
			//x 軸に沿って平行移動する距離を取得または設定します。
			"x" : {
				type : Number,
				readOnly : true
			},
			//y 軸に沿ってオブジェクトを変換 (移動) する距離を取得または設定します。
			"y" : {
				type : Number,
				readOnly : true
			}
		},
		
		constructor : function(x,y) {
			this._x = x ? x :0;
			this._y = y ? y :0;
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

	return TranslateTransform;
	
});	
