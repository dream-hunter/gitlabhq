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
	"dojo/_base/array"
],function(declare,array) {

	var Parameter = declare(null,{
		_name	   : "",
		_dataType  : "",
		_value     : "",

		initialize : function (name, dataType) {
			this._name = name;
			if (dataType) {
				this._dataType = dataType;
			} else {
				this._dataType = $D.DT_STRING;
			};
			this._value = null;
		},

		getName : function() {
			return this._name;
		},

		getDataType : function() {
			return this._dataType;
		},

		setDataType : function(dataType) {
			this._dataType = dataType;
		},

		getValue : function() {
			return this._value;
		},

		setValue : function(value) {
			this._value = value;
		}

	});
	
	
	return Parameter;
	
});	