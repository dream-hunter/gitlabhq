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

	//2-D �� x-y ���W�n���ɂ���w�肵���_�𒆐S�Ƃ��āA�I�u�W�F�N�g�����v���ɉ�]���܂��B

	var Rotate2STransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return Matrix.rotateAt(angle,this.centerX,this.centerY);
			}
		},
		"--attributes--" : {
			//�p�x (��) �̒P�ʂŎ��v���̉�]�̊p�x���擾�܂��͐ݒ肵�܂��B
			"angle" : {
				type : Number,
				readOnly : true
			},
			//��]�̒��S�_�� x ���W���擾�܂��͐ݒ肵�܂��B
			"centerX" : {
				type : Number,
				readOnly : true
			},
			//��]�̒��S�_�� y ���W���擾�܂��͐ݒ肵�܂��B
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
		
		//���� ScaleTransform �̒l�̏ڍ׃R�s�[���쐬���ĕԂ��܂��B
		clone : /*ScaleTransform*/function() {
		},
		
		//�w�肵���_��ϊ����A���ʂ�Ԃ��܂��B
		transform : /*Point*/function(/*Point*/point) {
		},
		
		//�w�肳�ꂽ���E�{�b�N�X��ϊ����A��������傤�Ǌi�[�ł���傫���̎����s���E�{�b�N�X��Ԃ��܂��B
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		}
	});

	return Rotate2STransform;
	
});	
