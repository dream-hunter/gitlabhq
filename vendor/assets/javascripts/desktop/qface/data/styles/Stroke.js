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
	"qface/lang/Stateful",
	"qface/data/styles/Fill"
],function(declare,Stateful,Fill) {
	var Stroke = declare(Stateful,{
		"--attributes--" : {
			//�X�g���[�N�̑������擾�܂��͐ݒ肵�܂��B
			lineWidth : {
				type   : Number,	
			},
			//�X�g���[�N�̏I�_�Ɏg�p����`��̎�ނ��擾�܂��͐ݒ肵�܂��B
			lineCap : {
				type  : StrokeStyle.LineGap
			},
			//�`��̃A�E�g���C���̒��_�Ŏg�p����ڍ��̎�ނ��擾�܂��͐ݒ肵�܂��B ����l Miter �ł�
			lineJoin : {
			},
			
			//Thickness �̔����ɑ΂���A�ڍ����̒����̊����Ɋւ��鐧�����擾�܂��͐ݒ肵�܂��B
			//Thickness �̔����ɑ΂���A�ڍ����̒����̊����Ɋւ��鐧�����擾�܂��͐ݒ肵�܂��B
			miterLimit : {
				type   : Number,			
			},
			//
			lineDash : {
				type   : Number,			
			},
			//
			lineDashOffset : {
				type   : Number,			
			},
			//
			lineDashOffset : {
				fill   : Fill,			
			}
			
			
		}
	});
	
	Stroke.LineGap = Enum.declare(["butt", "round", "square"]);

	Stroke.LineJoin = Enum.declare(["round", "bevel", "miter"]);
	
	return Stroke;
	
});	