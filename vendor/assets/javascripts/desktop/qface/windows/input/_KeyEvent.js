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
	"qface/windows/input/_InputEvent"
],function(declare,InputEvent) {
	var KeyEvent = declare([InputEvent],{
		"--attributes--" : {
			//�C�x���g�Ɋ֘A�t�����Ă���L�[�{�[�h �L�[���擾���܂��B
			keyCode : {
				readOnly : true,
				getter : function() {
				}
			}
		},
		
		constructor	: function(params) {
	        this._keyCode = params.keyCode;
	    },

	    
	    
	
	});
	

	return KeyEvent;
	
});	