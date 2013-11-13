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

	//2-D の x-y 座標系内にある指定した点を中心として、オブジェクトを時計回りに回転します。

	var SkewTransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return Matrix.rotateAt(angle,this.centerX,this.centerY);
			}
		},
		"--attributes--" : {
			/**
			 * The factor to skew this visual object horizontally.
			 * @property skewX
			 * @type {Number}
			 * @default 0
			 **/
			"skewX" : {
				type : Number,
				default : 0
			},

			/**
			 * The factor to skew this visual object vertically.
			 * @property skewY
			 * @type {Number}
			 * @default 0
			 **/
			"skewY" : {
				type : Number,
				default : 0
			}
		},
		
		constructor : function(/*Number*/skewX,/*Number*/skewY) {
			this._skewX = skewX?skewX:0;
			this._skewY = skewY?skewY:0;
		},
		
		//この SkewTransform の値の詳細コピーを作成して返します。
		clone : /*SkewTransform*/function() {
		},
		
		//指定した点を変換し、結果を返します。
		transform : /*Point*/function(/*Point*/point) {
		},
		
		//指定された境界ボックスを変換し、それをちょうど格納できる大きさの軸平行境界ボックスを返します。
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		}
	});

	return SkewTransform;
	
});	
