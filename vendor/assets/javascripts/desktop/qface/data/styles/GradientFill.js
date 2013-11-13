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
	"qface/data/collections/ArrayList",
	"qface/data/styles/Fill",
	"qface/data/styles/Color",
	"qface/data/styles/GradientStop"
],function(declare,Fill,Color,GradientStop) {
	var GradientFill = declare(Fill,{
		"--attributes--" : {
			//���݂̕ϊ��� Matrix �I�u�W�F�N�g�Ƃ��Ď擾���܂��B
			"colors" : {
				type : Array,
				getter : function() {
					return this._colors.toArray();
				}	
			}
		},
		
		"--methods--" : {
			addColorStop : function(offset, color) {
				this._colors.add(new GradientStop(offset,color));
			}
		},
	
		constructor : function(){
			this._colors = new ArrayList();
		}

	});

	return GradientFill;
	
});	

