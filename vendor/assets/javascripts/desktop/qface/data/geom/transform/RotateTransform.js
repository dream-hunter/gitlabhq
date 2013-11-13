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

	var RotateTransform = declare(Transform,{
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
			}
		},
		
		constructor : function(/*Number*/angle,/*Number*/centerX,/*Number*/centerY) {
			this._angle = angle ? angle :0;
			this._centerX = centerX ? centerX :0;
			this._centerY = centerY ? centerY :0;
		
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

	return RotateTransform;
	
});	
