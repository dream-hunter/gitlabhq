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
	"qface/data/styles/Fill",
	"qface/data/styles/Color"
],function(declare,Fill,Color) {
	var GradientStop = declare(null,{
		"--attributes--" : {
			//現在の変換を Matrix オブジェクトとして取得します。
			"offset" : {
				type : Number,
				readOnly : true
			},
			"color" : {
				type : Color,
				readOnly : true
			}
		},
		
		constructor : function(offset,color){
			this._offset = offset;
			if (String.isString(color)) {
				this._color = Color.from(color);
			} else {
				this._color = color;
			}	
		}
	});

	
	return GradientStop;
});
