/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare"
],function(declare) {

	var Size = declare(null,{
		"-privates-" : {
					
		},
		"-attributes-" : {
			// width: Number
			//		The width of the default rectangle, value 100.
			"width" : {
				type : Number
			},
			// height: Number
			//		The height of the default rectangle, value 100.
			"height" : {
				type : Number
			},
			// changable: Boolean
			"changeable" : {
				type : Boolean
			}
		},
		"-methods-" : {
			change	: function(width,height) {
				this._width = width;
				this._height = height;
				this.onChanged();
			}
		},


		constructor	: function(width, height) {
			this._width = width;
			this._height = height;
		}
	});
	
	
	return Size;
	
});	
