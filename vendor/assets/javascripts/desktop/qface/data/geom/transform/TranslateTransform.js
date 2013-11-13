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
	//TranslateTransform �́Ax ������� y ���ɉ����������s�ϊ����`���܂��B �I�t�Z�b�g (dx�Ady) ��
	//���ϊ��̕ϊ��s������̐}�Ɏ����܂��B
	//2-D �ϊ��̕W���� 3 x 3 �s��
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
			//x ���ɉ����ĕ��s�ړ����鋗�����擾�܂��͐ݒ肵�܂��B
			"x" : {
				type : Number,
				readOnly : true
			},
			//y ���ɉ����ăI�u�W�F�N�g��ϊ� (�ړ�) ���鋗�����擾�܂��͐ݒ肵�܂��B
			"y" : {
				type : Number,
				readOnly : true
			}
		},
		
		constructor : function(x,y) {
			this._x = x ? x :0;
			this._y = y ? y :0;
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

	return TranslateTransform;
	
});	
