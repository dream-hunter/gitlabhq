define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array"
], function(declare,lang, array){
	/*
	 *every    			: {Boolean} function ({Array|String}arr,{ Function|String}callback,{Object?}thisObject)
	 *some		        : {Boolean} function ({Array|String}arr,{ Function|String}callback,{Object?}thisObject)
	 *indexOf			: {Number} function ({Array}arr,{Object}value,{Integer?}fromIndex,{Boolean?}findLast)
	 *lastIndexOf       : {Number} function ({Array}arr,{Object}value,{Integer?}fromIndex)
	 *forEach           : function ({Array|String}arr,{ Function|String}callback,{Object?}thisObject)
	 *map		        : {Array} function ({Array|String}arr,{ Function|String}callback,{Object?}thisObject)
	 *filter	        : {Array} function ({Array|String}arr,{ Function|String}callback,{Object?}thisObject)
	 *toArray	        : {Array} function ({Object}obj,{Number?}offset,{Array?}startWith)
	 */
	lang.mixin(Array,array,{
		"toArray" : lang._toArray,
		"arraycopy" :function(src, spos, dest, dpos, dlen) {
		    for(var i=0; i<dlen; i++) dest[i + dpos] = src[spos + i];
		}
	});
	
	return Array;
});
