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
	"dojo/number"
],function(declare,lang,number) {

	/*
	 *round               : {Number} function ({Number} value, {Number?} places, {Number?} increment)
	 *regexp              : {Number} function ({Number.__RegexpOptions?} options)
	 *parse               : {Number} function ({String} expression, {Number.__ParseOptions?} options)
	 */
	lang.mixin(Number,number);

	return Number;
	
});	