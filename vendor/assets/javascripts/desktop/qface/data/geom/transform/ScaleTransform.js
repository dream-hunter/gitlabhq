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
	var ScaleTransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return Matrix.scaleAt(this.scaleX,this.scaleY,this.centerX,this.centerY);
			}
		},	
		"--attributes--" : {
			//x 軸のスケール ファクターを取得または設定します。
			"scaleX" : {
				type : Number,
				readOnly : true
			},
			//y 軸のスケール ファクターを取得または設定します。
			"scaleY" : {
				type : Number,
				readOnly : true
			}
			//この ScaleTransform の中心点の x 座標を取得または設定します。
			"centerX" : {
				type : Number,
				readOnly : true
			}
			//この ScaleTransform の中心点の y 座標を取得または設定します。
			"centerY" : {
				type : Number,
				readOnly : true
			}
		},
		
		constructor : function(/*Number*/scaleX,/*Number*/scaleY,/*Number*/centerX,/*Number*/centerY) {
			this._scaleX = scaleX ? scaleX :1;
			this._scaleY = scaleY ? scaleY :1;
			this._centerX = centerX ? centerX :0;
			this._centerY = centerY ? centerY :0;
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

	return ScaleTransform;
	
});	
