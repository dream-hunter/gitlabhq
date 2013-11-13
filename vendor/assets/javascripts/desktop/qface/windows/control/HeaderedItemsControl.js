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
	"qface/windows/control/ItemsControl"
],function(declare,ItemsControl) {
	
	var HeaderedItemsControl  = declare(ItemsControl,{
		//<<summary
		//�����̍��ڂō\������A�w�b�_�[�����R���g���[����\���܂��B
		//summary>>
		"-privates-" : {
		},
		
		"-attributes-" : {
			"hasHeader"	: {
				//<<summary
				//���� HeaderedItemsControl �Ƀw�b�_�[�����邩�ǂ����������l���擾���܂��B
				//summary>>
				type : Boolean
			},
			"header" : {
				//<<summary
				//�R���g���[���Ƀ��x����t���鍀�ڂ��擾�܂��͐ݒ肵�܂��B
				//summary>>
				type : Object
			},
			
			headerTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return HeaderedItemsControl;
	
});	
