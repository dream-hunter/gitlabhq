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

	var ParameterSet = declare(null,{
		initialize : function() {
			this._paras = new Hash();
		},

		toString : function() {
			var s = "ParameterSet:\n";
			var paras = this._paras.values();
			for (var i = 0; i < paras.length; i++) {
				var para = paras[i];
				s += para._name + ": " + paraname._value + "\n";
			}
			return s;
		},

		addParameter : function(name, dataType) {
			var parameter = new Parameter(name, dataType);
			var name = name.toLowerCase();
			this._paras.put(name, parameter);
			return parameter;
		},

		removeParameter : function(name) {
			var name = name.toLowerCase();
			var parameter = this._paras.get(name);
			this._paras.remove(name);
			return parameter;
		},

		getParameter : function(name) {
			var name = name.toLowerCase();
			var parameter = this._paras.get(name);
			return parameter;
		},

		getCount : function() {
			return this._paras.count();
		},

		setValue : function(name, value) {
			var parameter = this.getParameter(name);
			if (!parameter) {
				parameter = this.addParameter(name);
			};
			
			if (parameter != null) {
				if (value != null) {
					switch (parameter._dataType) {
						case "byte" :
							;
						case "short" :
							;
						case "int" :
							;
						case "long" :
							{
								if (typeof(value) != "number") {
									value = parseInt(value);
								};
								break;
							};
						case "float" :
							;
						case "double" :
							;
						case "bigdecimal" :
							{
								if (typeof(value) != "number") {
									value = parseFloat(value);
								};
								break;
							};
						case "date" :
						case "datetime" :
							{
								if (typeof(value) != "number") {
									value = parseDate(value).getTime();
								};
								break;
							};
						case "time" :
							{
								if (typeof(value) != "number") {
									value = parseTime(value).getTime();
								};
								break;
							};
						case "boolean" :
							{
								if (typeof(value) != "boolean") {
									value = parseBoolean(value);
								};
								break;
							}
					}
				};
				parameter._value = value;
			}
		},

		getValue : function(name) {
			var parameter = this.getParameter(name);
			if (parameter != null) {
				return parameter._value;
			}
		},

		setDataType : function(name, dataType) {
			var parameter = this.getParameter(name);
			if (!parameter && typeof(name) != "number") {
				parameter = this.addParameter(name);
			};
			if (parameter != null) {
				parameter._dataType = dataType;
			}
		},

		getDataType : function(name) {
			var parameter = this.getParameter(name);
			if (parameter != null) {
				return parameter._dataType;
			}
		},

		clear : function() {
			this._paras.clear();
		}
	});
	
	
	return ParameterSet;
	
});	