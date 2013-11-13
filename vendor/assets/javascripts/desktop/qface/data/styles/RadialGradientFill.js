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
	var RadialGradientFill = declare(GradientFill,{
		"--attributes--" : {
			//���ˏ�O���f�[�V�����̊O���̉~�̒��S���擾�܂��͐ݒ肵�܂��B
			"center" : {
				type : Point,
				readOnly : true
			},
			//���ˏ�O���f�[�V�����̊O���̉~�̉����a���擾�܂��͐ݒ肵�܂��B
			"radiusX" : {
				type : Point,
				readOnly : true
			},
			//���ˏ�O���f�[�V�����̊O���̉~�̏c���a���擾�܂��͐ݒ肵�܂��B
			"radiusY" : {
				type : Point,
				readOnly : true
			}
		},	
		constructor : function(center,radiusX,radiusY) {
			this._center   = center;
			this._radiusX  = radiusX;
			this._radiusY  = radiusY;
		}	

	});

	return LinearGradientFill;
	
});	