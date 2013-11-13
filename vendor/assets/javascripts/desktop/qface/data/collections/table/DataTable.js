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

	var DataTable = declare(null,{
		initialize		: function (id, viewModel, type) {
			if (!id)
				id = _getUniqueControlId();
			this.id = id;
			this._viewModel = viewModel;
			this._type = type;
			this._columns  = new HashList();
			this._recordSet = new RecordSet(this);
			this._paras = new paraset();
			this._recordSet = this._recordSet;
			this._observers = new Collection();
			this._readOnly = false;
			this._async = false;
			this._autoLoadPage = false;
			this._pageSize = 10000;
			this._showLoadingTip = false;
			this._first = true;
			this._last = true;
			this._current = null;
			this._disableControlCount = 0;
			this._disableEventCount = 0;
			this._loadDataAction = null;
			this._masterLink = null;
//			this.$0T = false;
			this._disableBindingCount = 0;
			this._recordSet.getPageObject(1);
//			fireDoradoEvent(this, "onCreate",[this]);
		},

		toString : function() {
			var text = "[DataTable]\n";
			text += "id: " + this.id + "\n";
			text += "master: " + ((this._masterDataset == null) ? "" : this._masterDataset.id) + "\n";
			text += "\n";
			var fieldCount = this.getFieldCount();
			for (var i = 0; i < fieldCount; i++) {
				var field = this.getField(i);
				text += i + "." + field.getName() + " (" + field.getDataType() + ")\n";
			};
			return text;
		},

		finalize : function() {
			var element = this._observers._first;
			while (element != null) {
				element._data = null;
				element = element._phsNext;
			};
			this._observers.clear();
		},

		disableBinding : function() {
			this._disableBindingCount++;
		},

		enableBinding : function() {
			this._disableBindingCount--;
		},

		paras : function() {
			return this._paras;
		},

		isReadOnly : function() {
			return this._readOnly;
		},

		setReadOnly : function(readOnly) {
			this._readOnly = readOnly;
			this.refreshControls();
		},

		isAsync : function() {
			return this._async;
		},

		setAsync : function(async) {
			this._async = async;
		},

		isAutoLoadPage : function() {
			return this._autoLoadPage;
		},

		setAutoLoadPage : function(autoLoadPage) {
			this._autoLoadPage = autoLoadPage;
		},

		getPageSize : function() {
			return this._pageSize;
		},

		setPageSize : function(pageSize) {
			this._pageSize = pageSize;
		},

		isShowLoadingTip : function() {
			return this._showLoadingTip;
		},

		setShowLoadingTip : function(showLoadingTip) {
			this._showLoadingTip = showLoadingTip;
		},

		getPageIndex : function() {
			return this._recordSet._pageIndex;
		},

		setPageIndex : function(pageIndex) {
			this._recordSet._pageIndex = pageIndex;
		},

		getPageCount : function() {
			return this._recordSet._pageCount;
		},

		setPageCount : function(pageCount) {
			this._recordSet._pageCount = pageCount;
		},

		getLoadDataAction : function() {
			return this._loadDataAction;
		},

		setLoadDataAction : function(action) {
			if (action.length > 0 && action.charAt(0) == '/') {
				action = __CONTEXT_PATH + action;
			};
			this._loadDataAction = action;
		},

		isInsertOnEmpty : function() {
			return this._insertOnEmpty;
		},

		setInsertOnEmpty : function(isInsertOnEmpty) {
			this._insertOnEmpty = isInsertOnEmpty;
		},


		addColumn : function(name, dataType) {
			if (name.toLowerCase() == "select")
				dataType = "boolean";
			var field = new Field(name, dataType);
			this._fields.put(name.toLowerCase(), field);
			return field;
		},

		getColumn : function(name) {
			if (typeof(name) == "string")
				name = name.toLowerCase();
			return this._fields.get(name);
		},

		removeColumn : function(name) {
			if (typeof(name) == "string")
				name = name.toLowerCase();
			return this._fields.get(name);
		},

		getFieldCount : function() {
			return this._fields.size();
		},

		setMasterLink : function(masterDataset, masterKeyFields, detailKeyparas) {
			var _masterLink = this._masterLink;
			if (_masterLink != null) {
				var _masterDataset = _masterLink._masterDataset;
				_masterDataset.removeDetailLink(_masterLink);
			};
			var masterDetailLink = null;
			if (masterDataset != null) {
				masterDetailLink = new MasterDetailLink(masterDataset, this);
				masterDetailLink.setMasterKeyFields(masterKeyFields);
				masterDetailLink.setDetailKeyparas(detailKeyparas);
				this._masterLink = masterDetailLink;
				masterDataset.addDetailLink(masterDetailLink);
			} else {
				this._masterLink = masterDetailLink;
			};
			return masterDetailLink;
		},

		addDetailLink : function(detailLink) {
			if (this._detailLinks == null) {
				this._detailLinks = new Collection();
			};
			this._detailLinks.insert(detailLink);
			this.addObserver(detailLink._detailDataset);
		},

		removeDetailLink : function(detailLink) {
			if (this._detailLinks != null) {
				this._detailLinks.remove(detailLink);
			}
		},

		addObserver : function(control) {
			this._observers.insert(control);
			if (this._disableControlCount > 0 || control._disableBindingCount > 0 || !control._active)
				return;
//			control.processDatasetMessage(__Dataset_MSG_REFRESH, this, null);
		},

		removeObserver : function(observer) {
			this._observers.remove(observer);
		},

		clearData : function() {
			this.disableControls();
			try {
				this._doClearData();
				this.moveFirst();
			} finally {
				this.enableControls();
				this.broadcastDatasetMessage(__Dataset_MSG_REFRESH, null);
			}
		},

		_doClearData : function() {
			this._recordSet.clearData();
		},



		isPageLoaded : function(pageIndex) {
			if (pageIndex <= this.getPageCount()) {
				var $ba = this._recordSet.getPage(pageIndex);
				return ($ba != null);
			} else {
				return false;
			}
		},


		doInsertRecord : function(mode) {
			if (this._current != null) {
				if (!this.postRecord())
					return;
			};
			if (this._disableEventCount <= 0) {
				var result = fireDoradoEvent(this, "beforeInsert",[this]);
				if (result != null)
					throw result;
			};
			var record = new DataRow(this);
			var fieldCount = this._fields.size();
			for (var i = 0; i < fieldCount; i++) {
				var field = this._fields.get(i);
				if (field._defaultValue != null) {
					record.doChangeValue(field.name, field._defaultValue);
				}
			};
			var masterDetailLink = this._masterLink;
			if (masterDetailLink != null) {
				var masterDataset = masterDetailLink._masterDataset;
				var masterRecord = masterDataset._current;
				var masterKeyFieldArray = masterDetailLink._masterKeyFieldArray;
				var detailKeyFieldArray = masterDetailLink._detailKeyFieldArray;
				if (masterRecord != null && (masterKeyFieldArray.length == detailKeyFieldArray.length)) {
					for (var i = 0; i < masterKeyFieldArray.length; i++) {
						record.doChangeValue(detailKeyFieldArray[i], masterRecord.getValue(masterKeyFieldArray[i]));
					}
				}
			}
			switch (mode) {
				case "before" :
					;
				case "after" :
					{
						record._pageIndex = this._current._pageIndex;
						break;
					};
				case "begin" :
					{
						record._pageIndex = 1;
						break;
					};
				default :
					{
						record._pageIndex = this._recordSet._pageCount;
						break;
					}
			};
			var recordSet = this._recordSet;
			recordSet.insertElement(record, mode, this._current);
			record.setState(RECORD_STATUS_NEW);
			record._dirty = true;
			this.setCurrent(record);
			if (recordSet._visibleRecordCount >= 0)
				recordSet._visibleRecordCount++;
			if (this._disableEventCount <= 0) {
				fireDoradoEvent(this, "afterInsert",[this]);
			};
			return record;
		},

		insertRecord : function(mode) {
			try {
				return this.doInsertRecord(mode);
			} catch (e) {
				processException(e)
			}
		},

		insertRecords : function(records, mode) {
			if (records.length == 0)
				return;
			try {
				var collection = new Collection();
				var record;
				for (var i = 0; i < records.length; i++) {
					record = records[i];
					record.setState(RECORD_STATUS_INSERT);
					collection.insertElement(record);
				};
				var recordSet = this._recordSet;
				recordSet.insertCollection(collection, mode, this._current);
				this.setCurrent(record);
				if (recordSet._visibleRecordCount >= 0)
					recordSet._visibleRecordCount += records.length;
				this.broadcastDatasetMessage(__Dataset_MSG_REFRESH, null);
			} catch (e) {
				processException(e)
			}
		},

		__deleteRecord : function(record) {
			record._dirty = false;
			if (record._state == RECORD_STATUS_NEW || record._state == RECORD_STATUS_INSERT) {
				this._recordSet.removeElement(record);
				record._state = RECORD_STATUS_DELETE;
			} else {
				record.setState(RECORD_STATUS_DELETE);
			};
			var recordSet = this._recordSet;
			if (recordSet._visibleRecordCount >= 0)
				recordSet._visibleRecordCount--;
			var fieldCount = this._fields.size();
			for (var i = 0; i < fieldCount; i++) {
				var field = this._fields.get(i);
				if (field._supportsSum) {
					var sum = recordSet._sum;
					if (sum == null) {
						sum = new Object();
						recordSet._sum = sum;
					};
					var sumFieldName = "_" + field.name;
					var sumValue = sum[sumFieldName];
					if (typeof(sumValue) != "number") {
						sumValue = 0;
					};
					var $wD = parseFloat(record.getValue(i));
					if (!isNaN($wD))
						sumValue -= $wD;
					sum[sumFieldName] = sumValue;
				}
			}
		},


		deleteRecord : function(record) {
			try {
				if (record == null)
					record = this._current;
				if (record == null) {
					throw __DATASET_ERR_NO_CURRENT.replace(
						/ % s / g,
						this.id + ".deleteRecord");
					return;
				};
				if (this._disableEventCount <= 0) {
					var result = fireDoradoEvent(this, "beforeDelete",[this, record]);
					if (result != null)
						throw result;
				};
				var nextCurRecord = null;
				if (record == this._current) {
					nextCurRecord = record.getNextRecord();
					if (nextCurRecord == null) {
						nextCurRecord = record.getPrevRecord();
					}
				} else {
					nextCurRecord = this._current;
				};
				var isNew = record._state == RECORD_STATUS_NEW;
				this.__deleteRecord(record);
				if (nextCurRecord != this._current) {
					this.setCurrent(nextCurRecord);
				};
				this.broadcastDatasetMessage(__Dataset_MSG_RECORD_DELETED,[record]);
				if (this._disableEventCount <= 0) {
					fireDoradoEvent(this, "afterDelete",[this, record]);
				};
				if (isNew)
					record.destroy();
			} catch (e) {
				processException(e)
			}
		},


		broadcastDatasetMessage : function(message, args) {
			if (this._disableControlCount > 0)
				return;
			var element = this._observers._first;
			while (element) {
				var control = element.getData();
				if (control._disableBindingCount <= 0) {
					control.processDatasetMessage(message, this, args);
				};
				element = element._phsNext;
			}
		},

		initOnMasterRecord : function(masterRecord) {
			var recordSet = this._recordSet;
			var masterDetailLink = this._masterLink;
			var masterKeyFieldArray = masterDetailLink._masterKeyFieldArray;
			var detailKeyParameterArray = masterDetailLink._detailKeyParameterArray;
			var paras = this._paras;
			var detailRecordSet = null;
			var paras = this._paras;
			if (masterRecord != null) {
				detailRecordSet = masterRecord.addDetailRecordSet(this.id);
				if (masterRecord._state == RECORD_STATUS_NEW) {
					detailRecordSet.getPageObject(1);
				};
				for (var i = 0; i < masterKeyFieldArray.length; i++) {
					paras.setValue(detailKeyParameterArray[i], masterRecord.getValue(masterKeyFieldArray[i]));
				}
			} else {
				for (var i = 0; i < masterKeyFieldArray.length; i++) {
					paras.setValue(detailKeyParameterArray[i], null);
				}
			};
			if (recordSet != detailRecordSet) {
				this.disableControls();
//				this.$0T = true;
				this.setRecordSet(detailRecordSet);
//				this.$0T = false;
				this.enableControls();
			}
		},

		processDatasetMessage : function(message, dataset, args) {
			if (message == __Dataset_MSG_REFRESH
				|| message == __Dataset_MSG_CURRENT_CHANGED) {
				var masterDetailLink = this._masterLink;
				if (masterDetailLink != null && masterDetailLink._masterDataset == dataset) {
					this.initOnMasterRecord(masterDetailLink._masterDataset._current);
					this.refreshControls();
				}
			}
		},


		refreshControls : function() {
			this.validateCurrent();
			this.broadcastDatasetMessage(__Dataset_MSG_REFRESH, null);
		},

		disableControls : function() {
			this._disableControlCount++;
		},

		enableControls : function() {
			if (this._disableControlCount < 1) {
				this._disableControlCount = 0;
			} else {
				this._disableControlCount--;
			}
		},

		disableEvents : function() {
			this._disableEventCount++;
		},

		enableEvents : function() {
			if (this._disableEventCount < 1) {
				this._disableEventCount = 0;
			} else {
				this._disableEventCount--;
			}
		},



		sort : function(fieldNames) {
			function quickSort(array, fields, low, high) {
				function compareRecord(record, mid_data) {
					if (fields.length > 0) {
						var value1, value2;
						for (var i = 0; i < fields.length; i++) {
							var field = fields[i];
							if (field.ascent) {
								value1 = 1;
								value2 = -1;
							} else {
								value1 = -1;
								value2 = 1;
							};
							var value = record.getValue(field.field);
							var $r_ = mid_data.getValue(field.field);
							if (value > $r_) {
								return value1;
							} else if (value < $r_) {
								return value2;
							}
						}
					} else {
						if (record._pageIndex > mid_data._pageIndex) {
							return 1;
						} else if (record._pageIndex < mid_data._pageIndex) {
							return -1;
						} else {
							if (record._id > mid_data._id) {
								return 1;
							} else if (record._id < mid_data._id) {
								return -1;
							}
						}
					};
					return 0;
				};
				var low1 = low;
				var high1 = high;
				var $EP = parseInt((low1 + high1) / 2);
				var mid_data = array[$EP];
				do {
					while (compareRecord(array[low1], mid_data) < 0)
						low1++;
					while (compareRecord(array[high1], mid_data) > 0)
						high1--;
					if (low1 <= high1) {
						var $4h = array[low1];
						array[low1] = array[high1];
						array[high1] = $4h;
						low1++;
						high1--;
					}
				}
				while (low1 <= high1)
					if (high1 > low)
						quickSort(array, fields, low, high1);
				if (high > low1)
					quickSort(array, fields, low1, high);
			};
			var recordSet = this._recordSet;
			if (this._autoLoadPage && recordSet._pageCount > 1) {
				alert(__DATASET_SORT_NOT_SUPPORTED);
				return false;
			};
			var fields = new Array();
			if (fieldNames) {
				var fieldName_array = fieldNames.split(",");
				for (var i = 0; i < fieldName_array.length; i++) {
					var $kn = new Object();
					var fieldName = fieldName_array[i];
					var $gg = fieldName.charAt(0);
					if ($gg == "+") {
						$kn.ascent = true;
						$kn.field = fieldName.substring(1);
					} else if ($gg == "-") {
						$kn.ascent = false;
						$kn.field = fieldName.substring(1);
					} else {
						$kn.ascent = true;
						$kn.field = fieldName;
					};
					fields.push($kn);
				}
			};
			if (this.getCurrent() != null) {
				var array = new Array();
				var record = recordSet._first;
				while (record != null) {
					array.push(record);
					record = record._phsNext;
				};
				quickSort(array, fields, 0, array.length - 1);
				var element = recordSet._first;
				while (element) {
					if (element._data) {
						delete element._data;
					};
					element = element._phsNext;
				};
				recordSet.initIndexs();
				recordSet._first = null;
				recordSet._last = null;
				recordSet._size = 0;
				for (var i = 0; i < array.length; i++) {
					recordSet.insertElement(array[i]);
				};
				this._first = false;
				this._last = false;
			};
			var fieldCount = this._fields.size();
			for (var i = 0; i < fieldCount; i++) {
				this._fields.get(i)._sortType = null;
			};
			for (var i = 0; i < fields.length; i++) {
				var $kn = fields[i];
				this._fields.get($kn.field.toLowerCase())._sortType =
					(($kn.ascent) ? "ascent" : "descent");
			};
			this.broadcastDatasetMessage(__Dataset_MSG_REFRESH, null);
		},

		getSum : function(field) {
			var sum = this._recordSet._sum;
			if (sum != null) {
				var sumValue = sum["_" + field];
				if (typeof(sumValue) == "number") {
					return sumValue;
				}
			};
			return 0;
		},

		find : function(fieldNames, values, startRecord) {
			if (fieldNames.length > 0 && fieldNames.length == values.length) {
				var array = new Array();
				for (var i = 0; i < fieldNames.length; i++) {
					array.push(this._fields.indexOf(fieldNames[i].toLowerCase()));
				};
				var record = ((startRecord != null) ? startRecord : this.getFirstRecord());
				while (record != null) {
					var isObjectRecord = true;
					for (var i = 0; i < array.length; i++) {
						if (record[array[i]] != values[i]) {
							isObjectRecord = false;
							break;
						}
					};
					if (isObjectRecord) {
						return record;
					};
					record = record.getNextRecord();
				}
			};
			return null;
		}
	});
	
	
	return DataTable;
	
});	