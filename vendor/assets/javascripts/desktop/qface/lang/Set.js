/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"qface/lang/Enum"
],function(kernel,declare,lang,Enum) {
	var global = kernel.global;

	var _CS_SET_METAS = {};
	
	var Set = declare(null,{
		_items  : null,
		constructor : function() {
			this._items = new Array();
		},
		include	: function(item){
			var enumc  =  _CS_SET_METAS[this.declaredClass];
			if (item instanceof enumc) {
				if (this._items.indexOf(item)<0) {
					this._items.push(item);
				};	
			} else {
				throw new Error("invalid parameter");
			}
		},

		exclude	: function(item) {
			var enumc  =  _CS_SET_METAS[this.declaredClass];
			if (item instanceof enumc) {
				this._items.remove(item);
			} else {
				throw new Error("invalid parameter");
			}
		},
		contains : function(item) {
			return this._items.indexOf(item)>-1;
		},

		clear 	: function() {
			this._items.clear();
		},

		toArray : function() {
			return lang.clone(this._items);
		}
		
	});

	lang.mixin(Set,{
		declare : function(enumc){
			var c = declare([Set],{});
			_CS_SET_METAS[name] = enmuc;
			return c;
		}
	});

	return global.Set = Set;
});	
