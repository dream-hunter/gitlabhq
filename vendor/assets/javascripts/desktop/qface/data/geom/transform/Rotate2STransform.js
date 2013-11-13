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

	var Rotate2STransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return Matrix.rotateAt(angle,this.centerX,this.centerY);
			}
		},
		"--attributes--" : {
			//角度 (°) の単位で時計回りの回転の角度を取得または設定します。
			"angle" : {
				type : Number,
				readOnly : true
			},
			//回転の中心点の x 座標を取得または設定します。
			"centerX" : {
				type : Number,
				readOnly : true
			},
			//回転の中心点の y 座標を取得または設定します。
			"centerY" : {
				type : Number,
				readOnly : true
			},
			
			/**
			 * The x offset for this visual object's registration point. For example, to make a 100x100px Bitmap rotate around
			 * it's center, you would set regX and regY to 50.
			 * @property regX
			 * @type {Number}
			 * @default 0
			 **/
			"regX" : {
				type : Number,
				default : 0
			},

			/**
			 * The y offset for this visual object's registration point. For example, to make a 100x100px Bitmap rotate around
			 * it's center, you would set regX and regY to 50.
			 * @property regY
			 * @type {Number}
			 * @default 0
			 **/
			"regY" : {
				type : Number,
				default : 0
			},

			/**
			 * The rotation in degrees for this visual object.
			 * @property rotation
			 * @type {Number}
			 * @default 0
			 **/
			"rotation" : {
				type : Number,
				default : 0
			},

			/**
			 * The factor to stretch this visual object horizontally. For example, setting scaleX to 2 will stretch the display
			 * object to twice it's nominal width.
			 * @property scaleX
			 * @type {Number}
			 * @default 1
			 **/
			"scaleX" : {
				type : Number,
				default : 1
			},

			/**
			 * The factor to stretch this visual object vertically. For example, setting scaleY to 0.5 will stretch the display
			 * object to half it's nominal height.
			 * @property scaleY
			 * @type {Number}
			 * @default 1
			 **/
			"scaleY" : {
				type : Number,
				default : 1
			},

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
			},
			
		},
		
		constructor : function(/*Number*/angle,/*Number*/centerX,/*Number*/centerY,/*Number*/scaleX,/*Number*/scaleY,/*Number*/skewX,/*Number*/skewY) {
			this._angle = angle ? angle :0;
			this._centerX = centerX ? centerX :0;
			this._centerY = centerY ? centerY :0;
			this._scaleX = scaleX ? scaleX :1;
			this._scaleY = scaleY ? scaleY :1;
			this._skewX = skewX?skewX:0;
			this._skewY = skewY?skewY:0;
		
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

	return Rotate2STransform;
	
});	
