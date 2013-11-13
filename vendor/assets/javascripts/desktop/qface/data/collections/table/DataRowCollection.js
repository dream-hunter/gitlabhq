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

	var DataRowCollection = declare(null,{
		initialize : function (table) {
			this._table = table;
			this._pageIndex = 1;
			this._pageCount = 1;
			this._pages = new Array();
			this._visibleDataRowCount = 0;
			this._recordCount = 0;
		},

		DataRowCollection.prototype = new Collection();
		destroy : function() {
			this._doClearData();
		},

		clearData : function() {
			this._pageIndex = 1;
			this._pageCount = 1;
			this._pages = new Array();
			this._visibleDataRowCount = 0;
			this._recordCount = 0;
			this._doClearData();
			this.initIndexs();
			this._first = null;
			this._last = null;
			this._size = 0;
		},

		_doClearData : function() {
			if (this._table._recordSet == this) {
				this._table.setCurrent(null);
			};
			var element = this._first;
			while (element != null) {
				var record = element;
				if (record) {
					record.destroy();
				};
				element = element._phsNext;
			}
		},

		getPage : function(pageIndex) {
			return this._pages[pageIndex - 1];
		},

		getPageObject : function(pageIndex) {
			var $ba = new Object();
			this._pages[pageIndex - 1] = $ba;
			return $ba;
		}
	});
	
	
	return DataRowCollection;
	
});	