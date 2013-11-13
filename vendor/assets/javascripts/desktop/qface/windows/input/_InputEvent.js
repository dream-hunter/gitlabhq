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
	"qface/lang/Event"
],function(declare,Event) {

	var InputEvent = declare([Event],{

		"-attributes-" : {
			source : {
				readOnly : true,
				getter : function() {
				}
			},
			//Ç±ÇÃÉCÉxÉìÉgÇ™î≠ê∂ÇµÇΩéûçè
			ctrlKey : {
				readOnly : true,
				getter : function() {
		        	return this._ctrlKey; 
				}
			},
			
			shiftKey : {
				readOnly : true,
				getter : function() {
		        	return this._shiftKey; 
				}
			},

			altKey : {
				readOnly : true,
				getter : function() {
		        	return this._altKey; 
				}
			},

			cmdKey : {
				readOnly : true,
				getter : function() {
		        	return this._cmdKey; 
				}
			}
			
		},
		
		constructor	: function(params) {
	        this._source = params.source;
			this._ctrlKey = params.ctrlKey;
			this._shiftKey = paramas.shiftKey;
			this._altKey = params.altKey;
			this._cmdKey = params.cmdKey;
		}
	});
	
	return InputEvent;
	
});	