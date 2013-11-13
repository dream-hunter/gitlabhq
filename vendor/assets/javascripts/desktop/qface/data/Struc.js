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

	var Struc = declare(null,{
		"-privates-" : {
		
		},
		"-attributes-" : {
			// changable: Boolean
			"changeable" : {
				type : Boolean
			}
		},
		"-events-" : {
			onChanged	: function() {
			}
		},
		"-methods-" : {
			lock	: function() {
				this._changable = !noChange;
			},
			change	: function() {
			}
		},

		constructor	: function() {
		}
	});
	
	
	return Struc;
	
});	
