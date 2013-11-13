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

	//���� Transform �I�u�W�F�N�g�ō\������镡�� Transform ��\���܂��B

	var TransformGroup = declare(Transform,{
		"--attributes--" : {
			//���� TransformGroup ���`���� TransformCollection ���擾�܂��͐ݒ肵�܂��B
			"children" : {
				type : Collection,
				readOnly : true
			}
		},
		
		constructor : function() {
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

	return TransformGroup;
	
});	
