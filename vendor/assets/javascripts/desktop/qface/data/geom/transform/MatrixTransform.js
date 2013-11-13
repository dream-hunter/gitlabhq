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

	//2-D �� x-y ���W�n���ɂ���w�肵���_�𒆐S�Ƃ��āA�I�u�W�F�N�g�����v���ɉ�]���܂��B

	var MatrixTransform = declare(Transform,{
		"--privates--" : {
			_valueGetter : function(){
				return this.matrix.clone();
			}
		},
		"--attributes--" : {
			//���̕ϊ����`���� Matrix �\���̂��擾�܂��͐ݒ肵�܂��B
			"matrix" : {
				type : Matrix,
				readOnly : true
			}
		},
		
		constructor : function(/*Martix*/matrix) {
			this._matrix = matrix;
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

	return MatrixTransform;
	
});	
