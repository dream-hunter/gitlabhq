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

	var MasterDetailLink = declare(null,{
		initialize		: function(masterDataset,detailDataset) {
			this._masterDataset = masterDataset;
			this._detailDataset = detailDataset;
			this.setMasterKeyDataColumns(null);
			this.setDetailKeyDataColumns(null);
			this.setDetailKeyparas(null);
		},

		getMasterDataset : function() {
			return this._masterDataset;
		},

		getDetailDataset : function() {
			return this._detailDataset;
		},

		getMasterKeyDataColumns : function() {
			return this._masterKeyDataColumns;
		},

		setMasterKeyDataColumns : function(masterKeyDataColumns) {
			this._masterKeyDataColumns = masterKeyDataColumns;
			if (masterKeyDataColumns != null) {
				this._masterKeyDataColumnArray = masterKeyDataColumns.split(",");
			} else {
				this._masterKeyDataColumnArray = new Array();
			}
		},

		getDetailKeyDataColumns : function() {
			return this._detailKeyDataColumns;
		},

		setDetailKeyDataColumns : function(detailKeyDataColumns) {
			this._detailKeyDataColumns = detailKeyDataColumns;
			if (detailKeyDataColumns != null) {
				this._detailKeyDataColumnArray = detailKeyDataColumns.split(",");
			} else {
				this._detailKeyDataColumnArray = new Array();
			}
		},

		getDetailKeyparas : function() {
			return this._detailKeyparas;
		},

		setDetailKeyparas : function(detailKeyparas) {
			this._detailKeyparas = detailKeyparas;
			if (detailKeyparas != null) {
				this._detailKeyParameterArray = detailKeyparas.split(",");
			} else {
				this._detailKeyParameterArray = new Array();
			}
		},

		getMasterKeyDataColumnArray : function() {
			return this._masterKeyDataColumnArray;
		},

		getDetailKeyDataColumnArray : function() {
			return this._detailKeyDataColumnArray;
		},

		getDetailKeyParameterArray : function() {
			return this._detailKeyParameterArray;
		}
	});
	
	
	return MasterDetailLink;
	
});	