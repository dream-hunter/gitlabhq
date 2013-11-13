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
	"qface/lang/Enum"
],function(declare,Enmu) {
	
	//ControlStyle �v���p�e�B�́C�R���g���[�����}�E�X�C�x���g���L���v�`�����邩�ǂ����C�R���g���[�����Œ�T�C�Y���ǂ����Ȃǂ�
	//�R���g���[���̊e��̑����𒲂ׂ邱�Ƃ��ł��܂��BControlStyle �v���p�e�B�ɂ͂����̑�����������A�̃X�^�C���t���O�������Ă��܂��B
	//CaptureMouse:�}�E�X���N���b�N�����Ƃ��C�R���g���[���̓}�E�X�C�x���g���L���v�`������B
	//
	var ControlStyle =  Enum.declare(["CaptureMouse","Movable","Focusable","Scrollable","CanHaveChildren","CanHaveOneChild"]);

	return ControlStyle;
	
});	