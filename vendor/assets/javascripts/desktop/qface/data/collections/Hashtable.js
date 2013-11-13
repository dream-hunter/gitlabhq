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
	"qface/lang/Array",
	"qface/data/collections/Collection"

],function(declare,Array,Collection) {

	var ElOpType = Collection.ElementOperationType;
	
	var Hashtable = declare(Collection,{

		constructor	: function() {
			this._hashKeys= new Array(); 
			this._hashValues = new Object();
		},

		contain : function(strKey) {  
		     return Array.indexOf(this._hashKeys,strKey) >= 0;  
		},

		get: function(/*String*/key,/*Boolean*/silent){
			if(typeof (key) != "string"){
		         throw "hash key is not string!";  
			}
			if (!silent && !this.contain(key) {
	        	throw "hash key is not  existed";
	        }
	        
	        return this._hashValues[key];
		},
		
		add : function(key, value) {
			if(typeof (key) != "string"){
		         throw "hash key is not string!";  
			}
			if (this.contain(key) {
	        	throw "hash key already existed";
	        }
			this._changeAttrValue(strKey,value);
        	this._watchElementCallbacks(ElOpType.Added,strKey);
			return this;  
		},
		
		set: function(/*String*/key, /*Object*/value){
			if(typeof (key) != "string"){
		         throw "hash key is not string!";  
			}
			if (!this.contain(key) {
	        	throw "hash key is not existed";
			}
			return this._changeAttrValue(name,value);
		},

		put	: function(/*String*/key, /*Object*/value){
			if (this.contain(key)){
				this.set(key,value);
			} else {
				this.add(key,value);
			}
		},
		
		count : function () {  
		     return this._hashKeys.length;  
		 },
		 
		remove : function(strKey) {
			if(typeof (strKey) != "string"){
		         throw "hash key is not string!";  
			}
			var idx = Array.indexOf(this._hashKeys,strKey);
			if (idex>=0) {
			     	this._changeAttrValue(strKey,undefined);
		             delete this[strkey];
		             delete this._hashKeys[idx];
			         this._watchElementCallbacks(ElOpType.Removed,strKey);
			} else {  
	        	throw "hash key is not existed";
		    }  
		 }, 
		 
		clear : function () {  
			for (var i=0;i<this._hashKeys.length;i++) {
				var strKey = this._hashKeys[i];
				this._changeAttrValue(strKey,undefined);
				delete this[strKey];  
				this._watchElementCallbacks(ElOpType.Removed,strKey);
			}  
			this._watchElementCallbacks(ElOpType.Cleared);
		}
	});
	
	
	return Hashtable;
	
});	