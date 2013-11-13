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
	"qface/data/styles/GradientFill"
],function(declare,GradientFill) {
	//���`�O���f�[�V�����ŗ̈��h��Ԃ��܂�
	//���ɉ������O���f�[�V�������`���܂��B���̏I�_�́A���`�O���f�[�V������ StartPoint 
	//�v���p�e�B����� EndPoint �v���p�e�B�ɂ���Ē�`����܂��BLinearGradientBrush �u���V�́A
	//���̐��ɉ����� GradientStops ��h��Ԃ��܂��B
	//����̐��`�O���f�[�V�����͎ΐ��ł��B����ł́A���`�O���f�[�V������ StartPoint �� (0,0)
	// (�h��Ԃ����̈�̍����) �ł���AEndPoint �� (1,1) (�h��Ԃ����̈�̉E����) �ł��B
	//���������O���f�[�V�����̐F�́A�ΐ��̃p�X�ɉ����ĕ�Ԃ���܂��B
	var LinearGradientFill = declare(GradientFill,{
		"--attributes--" : {
			//���`�O���f�[�V�����̊J�n�� 2 �������W���擾�܂��͐ݒ肵�܂�
			"startPoint" : {
				type : Point,
				readOnly : true
			},
			//���`�O���f�[�V�����̏I���� 2 �������W���擾�܂��͐ݒ肵�܂�
			"endPoint" : {
				type : Point,
				readOnly : true
			}
		},
		constructor : function(startPoint,endPoint){
			this._startPoint = startPoint;
			this._endPoint = endPoint;
		}

	});

	return LinearGradientFill;
	
});	