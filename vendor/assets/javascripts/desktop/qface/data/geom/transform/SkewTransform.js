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
		
		//���� SkewTransform �̒l�̏ڍ׃R�s�[���쐬���ĕԂ��܂��B
		clone : /*SkewTransform*/function() {
		},
		
		//�w�肵���_��ϊ����A���ʂ�Ԃ��܂��B
		transform : /*Point*/function(/*Point*/point) {
		},
		
		//�w�肳�ꂽ���E�{�b�N�X��ϊ����A��������傤�Ǌi�[�ł���傫���̎����s���E�{�b�N�X��Ԃ��܂��B
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		}
	});

	return SkewTransform;
	
});	
