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
	"dojo/date"
],function(declare,lang,date) {
	/*
	 *getDaysInMonth    : {Number} function ({Date}dateObject)
	 *isLeapYear        : {Boolean}function ({Date}dateObject)
	 *getTimezoneName   : {String} function ({Date}dateObject)
	 *compare           : {int}    function ({Date}date1, {Date?}date2, {String?}portion)
	 *add               : {Date}   function ({Date}date, {String}interval, {int{amount)
	 *difference        : {Number} functionv({Date}date1, {Date?}date2, {String?}interval)
	 */
	lang.mixin(Date,date);
	
	return Date;
	
});	