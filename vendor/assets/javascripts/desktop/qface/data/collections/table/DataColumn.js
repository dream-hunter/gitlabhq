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

	var DataColumn = declare(null,{
		_name			: "",
		_dataType		: $D.DT_STRING,
		_caption		: "",
		_readOnly		: false,
		_format			: "",
		_defaultValue	: null,
		_toolTip		: "",
		_valueProtected : false,
		_visible 		: true,
		_supportsSum 	: false,
		_validators 	: [],
		
		
		constructor : function (name, dataType,length,scale) {
		/*
			function $TY() {
				var $co = $dropdownDate;
				if ($co == null) {
					$co = DoradoFactory.initialize("DateDropDown", null, "$dropdownDate");
					$dropdownDate = $co;
				};
				return $co;
			};
		*/	
			this._name = name;
			if (dataType) {
				this._dataType = dataType;
			} else {
				this._dataType = "string";
			};
			this._caption = name;
			this._readOnly = false;
			this._format = null;
//			this._editorType = null;
//			this._dropDown = null;
			this._defaultValue = null;
			this._toolTip = null;
			this._valueProtected = false;
			this._visible = true;
			this._supportsSum = false;
			this._validators = new Array();
			switch (dataType) {
				case "float" :
					;
				case "double" :
					;
				case "bigdecimal" :
					{
						this._format = "#,##.##";
						this._scale = 2;
						break;
					};
				case "date" :
					{
						this._format = "yyyy-MM-dd";
//						this._dropDown = $TY();
						break;
					};
				case "time" :
					{
						this._format = "HH:mm:ss";
						break;
					};
				case "datetime" :
					{
						this._format = "yyyy-MM-dd HH:mm:ss";
//						this._dropDown = $TY();
						break;
					}
			}
		},

		getName : function() {
			return this._name;
		},

		getDataType : function() {
			return this._dataType;
		},

		getCaption : function() {
			return this._caption;
		},

		setCaption : function(caption) {
			this._caption = caption;
		},

		isReadOnly : function() {
			return this._readOnly;
		},

		setReadOnly : function(readOnly) {
			this._readOnly = readOnly;
		},

		getFormat : function() {
			return this._format;
		},

		setFormat : function(format) {
			this._format = format;
			if (format) {
				switch (this._dataType) {
					case "float" :
						;
					case "double" :
						;
					case "bigdecimal" :
						{
							var $wD = $mt($yP);
							this._scale = $wD.$YC;
						}
				}
			}
		},

/*
		getEditorType : function() {
			return this._editorType;
		},

		setEditorType : function(editorType) {
			this._editorType = editorType;
		},
*/
		getDropDown : function() {
			return this._dropDown;
		},

		setDropDown : function(dropDown) {
			this._dropDown = dropDown;
		},

		getDefaultValue : function() {
			return this._defaultValue;
		},

		setDefaultValue : function(defaultValue) {
			this._defaultValue = defaultValue;
		},

		getToolTip : function() {
			return this._toolTip;
		},

		setToolTip : function(toolTip) {
			this._toolTip = toolTip;
		},

		isValueProtected : function() {
			return this._valueProtected;
		},

		setValueProtected : function(valueProtected) {
			this._valueProtected = valueProtected;
		},

		isVisible : function() {
			return this._visible;
		},

		setVisible : function(visible) {
			this._visible = visible;
		},

		isSupportsSum : function() {
			return this._supportsSum;
		},

		setSupportsSum : function(supportSum) {
			this._supportsSum = supportSum;
		},

		addValidator : function(validator) {
			this._validators.push(validator);
		}
	});
	
	
	return DataColumn;
	
});	