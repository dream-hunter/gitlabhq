/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 *
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/string"
],function(declare,lang,string) {
	var digitRE = /[0-9]/;
	var letterRE = /[A-Za-z]/;

	/*
	 *rep               : {String} function ({String}str, {Integer}num)
	 *pad               : {String} function ({String}text, {Integer}size, {String?}ch, {Boolean?}end)
	 *substitute        : {String} function ({String}template,{Object|Array}map,{Function?}transform,{Object?}thisObject)
	 *trim              : {String} function ({String}str)
	 *add               : {Date}   function ({Date}date, {String}interval, {int{amount)
	 *difference        : {Number} function ({Date}date1, {Date?}date2, {String?}interval)
	 */
	lang.mixin(String,string,{
		str2bytes : function(s) {
			var ar = [];
			for (var i = 0; i < s.length; i++) {
				var code = s.charCodeAt(i);
				ar.push((code >> 8) & 0xFF);
				ar.push(code & 0xFF);
			}
			return ar;
		},

		isDigit : function(ch) {
			if (ch.length != 1) throw new Error("Incorrect character");
			return digitRE.test(ch);
		},

		isLetter : function (ch) {
			if (ch.length != 1) throw new Error("Incorrect character");
			return letterRE.test(ch);
		},

		isString : lang.isString
	});

	return String;

});
