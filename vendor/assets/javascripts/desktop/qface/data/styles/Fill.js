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
	"qface/data/geom/transform/Transform"
],function(declare,Stateful,Transform) {
	var Fill = declare(Stateful,{
		"--attributes--" : {
			//�h��Ԃ�(Brush)�̕s�����x���擾�܂��͐ݒ肵�܂��B
			"opacity" : {
				type : Number
			},
			//�h��Ԃ�(Brush)�ɓK�p�����ϊ����擾�܂��͐ݒ肵�܂��B ���̕ϊ��́A
			//�u���V�̏o�͂��}�b�v����Ĕz�u���ꂽ��ɓK�p����܂��B
			"transform" : {
				type : Transform 
			}
		}
	});

	return Fill;
	
});	
