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
	"qface/lang/Array"
],function(declare,array) {
	var State = DataRow.State = Enum.declare("Non","Added","Deleted","Detached","Unchanged");
	var Version = DataRow.Version = Enum.declare("Current","Default","Original","Proposed");
	
		DRS_NON 		: "non",
		DRS_ADDED 		: "Added",
		DRS_DELETED 	: "Deleted",
		DRS_DETACHED 	: "Detached",
		DRS_MODIFIED 	: "Modified",
		DRS_UNCHANGED 	: "Unchanged",

		VER_CURRENT 	: "current",
		VER_DEFAULT 	: "default",
		VER_ORIGINAL 	: "original",
		VER_PROPOSED	: "proposed"

	var DataRow = declare(null,{
		initialize : function (table) {
			this._visible = false;
			this._table = table;
			this._pageIndex = table._pageIndex;
//			this._id = _getUniqueIndex();
			this._state = DataRow.DRS_NON;
			this._dirty = false;
			this._validDataRow = null;
			
			this._originalVer = null;
			this._currentVer  = null;
			this._proposedVer = null;

			this._loaded  = false;
			this._editing = false;
		},

		toString : function() {
			var text = "[DataRow]\n";
			text += "id: " + this._id + "\n";
			text += "state: " + this._state + "\n";
			text += "isDirty: " + this._dirty + "\n";
			text += "\n";
			var table = this._table;
			var dataColumnCount = table.getDataColumnCount();
			for (var i = 0; i < dataColumnCount; i++) {
				var dataColumn = table.getDataColumn(i);
				text += i + "." + dataColumn.getName() + ": " + this.getValue(i) + "\n";
			};
			return text;
		},

		finalize   : function() {
			var ddrcs = this._detailDataRowCollections;
			if (ddrcs != null) {
				var size = detailDataRowCollections.size();
				for (var i = 0; i <ddrcs.length; i++) {
					ddrcs[i].dispose();
				}
			};
			this._recordSet = null;
			this._table = null;
		},

		getPageIndex : function() {
			return this._pageIndex;
		},

		setPageIndex : function(pageIndex) {
			this._pageIndex = pageIndex;
		},

		getState : function() {
			return this._state;
		},

		setState : function(state) {
			this._state = state;
		//	this._table.broadcastDatasetMessage($Gn,[this]);
		},

		getTable : function() {
			return this._table;
		},

		isDirty : function() {
			return this._dirty;
		},

		setDirty : function(dirty) {
			this._dirty = dirty;
		},

		getValueAt : function (coloumnIndex,version) {
			var dataColumn = this._table._dataColumns[coloumnIndex];
			if (dataColumn == null) {
				alert(__DATASET_FIELD_NOT_FOUND.replace(/ \ $ \ {
					dataColumn \ }
				/ g, this._table.id + "." + name));
				return null;
			};
			if (!version) {
				version = Version.Default;
			}	
			
			var value = undefined;
			
			if (version == Version.Default) {
				if  (this._proposedVer != null) {
					value = this._proposedVer[columnIndex];
				} else if (this._currentVer!=null) {
					value = this._currentVer[columnIndex];
				} else 	if (this._originalVer!=null) {
					value = this._originalVer[columnIndex];
				}
			} else  if (version ==Version.Current) {
				if (this._currentVer!=null) {
					value = this._currentVer[columnIndex];
				}	
			} else if (version == Version.Original) {
				if (this._originalVer!=null) {
					value = this._originalVer[columnIndex];
				}	
			} else if (version == Version.Proposed) {
				if  (this._proposedVer != null) {
					value = this._proposedVer[columnIndex];
				}	
			} 
			
			return value;
		},

		getValue : function(columnName,version) {
			var coloumnIndex =  this._table._dataColumns.indexOf(columnName);
			return this.getValueAt(columnIndex,version);
		},

		hasVersion : function(version) {
			if (version == Version.Current) {
				return this._currentVer !=null;
			} else if (version == Version.Original) {
				return this._originalVer !=null;
			} else if (version == Version.Proposed) {
				return this._proposedVer !=null;
			}
		},

		getString : function(name) {
			var index;
			if (typeof(name) == "number") {
				index = name;
			} else {
				index = this._table._dataColumns.indexOf(name.toLowerCase());
			};
			var text = "";
			var dataColumn = this._table._dataColumns.get(index);
			if (dataColumn != null) {
				var value = this[index];
				if (typeof(value) == "undefined")
					value = null;
				var table = this._table;
				if (table.$oL != null) {
					value = fireDoradoEvent(table, "onGetValue",[table, this, dataColumn, value]);
				};
				if (value != null) {
					switch (dataColumn._dataType) {
						case "int" :
							;
						case "long" :
							{
								if (dataColumn._format != null) {
									text = formatFloat(value, dataColumn._format);
								} else {
									text = value;
								};
								break;
							};
						case "float" :
							;
						case "double" :
							;
						case "bigdecimal" :
							{
								text = formatFloat(value, dataColumn._format);
								break;
							};
						case "date" :
							;
						case "time" :
							;
						case "datetime" :
							{
								text = formatDate(value, dataColumn._format);
								break;
							};
						default :
							{
								text = value.toString();
								break;
							}
					}
				}
			} else {
		//		alert(__DATASET_FIELD_NOT_FOUND.replace(/ \ $ \ {
		//			dataColumn \ }
		//		/ g, this._table.id + "." + name));
			};
			return text;
		},


		doSetValue : function(name, value,version) {
			function round(value, scale) {
				if (value != 0) {
					var mul = Math.pow(10, value);
					return Math.round(value * mul) / mul;
				} else {
					return 0;
				}
			};
			var index;
			if (typeof(name) == "number") {
				index = name;
			} else {
				index = this._table._dataColumns.indexOf(name.toLowerCase());
			};
			
			var table = this._table;
			var dataColumn = table._dataColumns.get(index);
			if (dataColumn != null) {
				if (table._disableEventCount <= 0
					&& table._beforeSelectionChange != null
					&& dataColumn.name == "select") {
					var result = fireDoradoEvent(table, "beforeSelectionChange",[table, this]);
					if (result != null)
						throw result;
				};
				if (table._disableEventCount <= 0 && table._beforeChange != null) {
					var result =
						fireDoradoEvent(table, "beforeChange",[table, this, dataColumn, value]);
					if (result != null)
						throw result;
				};
				if (table._onSetValue != null) {
					value = fireDoradoEvent(table, "onSetValue",[table, this, dataColumn, value]);
				};
				var $Bm = this[index];
				var $9m = value;
				if (value != null) {
					switch (dataColumn._dataType) {
						case "byte" :
							;
						case "short" :
							;
						case "int" :
							;
						case "long" :
							{
								if (value + "" == "") {
									value = null;
								} else if (typeof(value) != "number") {
									value = parseInt(value);
									if (isNaN(value)) {
										throw $8k.replace(/ \ $ \ {
											value \ }
										/ g, $9m);
									}
								};
								break;
							};
						case "float" :
							;
						case "double" :
							;
						case "bigdecimal" :
							{
								if (value + "" == "") {
									value = null;
								} else if (typeof(value) != "number") {
									value = parseFloat(value);
									if (dataColumn._scale > 0) {
										value = $jx(value, dataColumn._scale);
									};
									if (isNaN(value)) {
										throw __DATASET_INVALID_FLOAT.replace(/ \ $ \ {
											value \ }
										/ g, $9m);
									}
								};
								break;
							};
						case "date" :
						case "datetime" :
							{
								if (value + "" == "") {
									value = null;
								} else if (typeof(value) == "string") {
									value = parseDate(value);
									if (isNaN(value)) {
										throw __DATASET_INVALID_DATE;
									}
								};
								break;
							};
						case "time" :
							{
								if (value + "" == "") {
									value = null;
								} else if (typeof(value) == "string") {
									value = parseTime(value);
									if (isNaN(value)) {
										throw __DATASET_INVALID_TIME;
									}
								};
								break;
							}
						case "boolean" :
							{
								if (typeof(value) != "boolean") {
									value = parseBoolean(value);
								};
								break;
							}
					}
				};
				var validators = dataColumn._validators;
				for (var i = 0; i < validators.length; i++) {
					var validator = validators[i];
					if (validator._validateImmediately) {
						if (!validator.validate(value)) {
							if (table._disableEventCount <= 0 && validator._onValidateFailed != null) {
								if (!fireDoradoEvent(validator,
									"onValidateFailed",
									[validator,
									dataColumn,
									value]))
									continue;
							};
							throw validator.getFinalErrorMessage().replace(/ \ $ \ {
								dataColumn \ }
							/ g, dataColumn.getCaption());
						}
					}
				};
				this[index] = value;
				if (dataColumn._supportsSum) {
					var table = this._table;
					var sum = table._sum;
					if (sum == null) {
						sum = new Object();
						table._sum = sum;
					};
					var sumDataColumnName = "_" + dataColumn.name;
					var sumValue = sum[sumDataColumnName];
					if (typeof(sumValue) != "number") {
						sumValue = 0;
					};
					var $wD = parseFloat($Bm);
					if (!isNaN($wD))
						sumValue -= $wD;
					$wD = parseFloat(value);
					if (!isNaN($wD))
						sumValue += $wD;
					sum[sumDataColumnName] = sumValue;
				};
				if (!this.$42) {
					this._dirty = true;
					table.broadcastDatasetMessage($Gn,[this]);
				};
				table.broadcastDatasetMessage(__Dataset_MSG_DATA_CHANGED,[this, name, $Bm]);
				if (table._disableEventCount <= 0 && table._afterChange != null) {
					fireDoradoEvent(table, "afterChange",[table, this, dataColumn, $Bm]);
				};
				if (table._disableEventCount <= 0
					&& table._beforeSelectionChange != null
					&& dataColumn.name == "select") {
					var result = fireDoradoEvent(table, "afterSelectionChange",[table, this]);
					if (result != null)
						throw result;
				}
			} else {
				alert(__DATASET_FIELD_NOT_FOUND.replace(/ \ $ \ {
					dataColumn \ }
				/ g, table.id + "." + name));
			}
		},

		setValueAt : function(columnIndex, columnValue) {
			try {
				var version ;
				if  (this._loading) {
					version = DataRow.VER_ORIGINAL;
				} else if (this._editing) {
					version = DataRow.VER_PROPOSED;
				} else {
					version = DataRow.VER_CURRENT;
				}
				this.doSetValue(columnIndex, columnValue,version);
			} catch (e) {
				processException(e);
			}
		},

		setValue : function(columnName, columnValue) {
			var columnIndex = this._table._dataColumns.indexOf(name.toLowerCase());
			setValueAt(columnIndex,columnValue);
		},


		endEdit :  function() {
			var dataColumnCount = this._table.getDataColumnCount();
			for (var i = 0; i < dataColumnCount; i++) {
				this._currentVer[i] = this._proposed[i];
			}
			this._proposed = null;
			this._editing = false;
		},

		cancelEdit : function() {
			this._proposed = null;
			this._editing = false;
		},

		validate : function() {
			var table = this._table;
			var dataColumns = table._dataColumns;
			var dataColumnCount = dataColumns.size();
			for (var i = 0; i < dataColumnCount; i++) {
				var dataColumn = dataColumns.get(i);
				var validators = dataColumn._validators;
				for (var i = 0; i < validators.length; i++) {
					var validator = validators[i];
					if (!validator._validateImmediately) {
						var value = this.getValue(i);
						if (!validator.validate(value)) {
							if (table._disableEventCount <= 0 && validator._onValidateFailed != null) {
								if (!fireDoradoEvent(validator,
									"onValidateFailed",
									[validator,
									dataColumn,
									value]))
									continue;
							};
							throw validator.getFinalErrorMessage().replace(/ \ $ \ {
								dataColumn \ }
							/ g, dataColumn.getCaption());
						}
					}
				}
			}
		},


		acceptChanges  : function() {
			try {
				var table = this.getTable();
	//			table.broadcastDatasetMessage(__Dataset_MSG_GAINING_CHANGE, null);
				if (this._dirty) {
	//				if (table._disableEventCount <= 0) {
	//					var result = fireDoradoEvent(table, "beforePost",[table, this]);
	//					if (result != null)
	//						throw result;
	//				};
					this.validate();
					var validDataRow = this._current;
					if (validDataRow != null) {
						var dataColumnCount = this._table.getDataColumnCount();
						for (var i = 0; i < dataColumnCount; i++) {
							validDataRow[i] = this[i];
						}
					};
					this._dirty = false;
					if (this._state == RECORD_STATUS_NONE) {
						this.setState(RECORD_STATUS_MODIFY);
					} else if (this._state == RECORD_STATUS_NEW) {
						this.setState(RECORD_STATUS_INSERT);
					};
					table.broadcastDatasetMessage(__Dataset_MSG_REFRESH_RECORD,[this]);
					if (table._disableEventCount <= 0) {
						fireDoradoEvent(table, "afterPost",[table, this]);
					}
				} else if (this._state == RECORD_STATUS_NEW) {
					if (table._disableEventCount <= 0) {
						var result = fireDoradoEvent(table, "beforePost",[table, this]);
						if (result != null)
							throw result;
					};
					var $Un = this.getNextDataRow();
					if ($Un == null) {
						$Un = this.getPrevDataRow();
					};
					table.__deleteDataRow(this);
					table.setCurrent($Un);
					table.broadcastDatasetMessage(__Dataset_MSG_RECORD_DELETED,[this]);
					this.destroy();
				}
				return true;
			} catch (e) {
				processException(e);
				return false;
			}
		}

	});
	
	
	return DataRow;
	
});	