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
	"dojo/_base/lang"
],function(declare,lang) {
	var _TRBLA = declare(null,{
			"-attributes-"	:	{
				"left"	:	{
					"type"	:	Number
				},
				"top"	:	{
					"type"	:	Number
				},
				"right"	:	{
					"type"	:	Number
				},
				"bottom"	:	{
					"type"	:	Number
				}
			},
			_l	: null,
			_t  : null,
			_r	: null,
			_b  : null,

			_finalize	: function() {
				this._l = this._r = this._t = this._b = null;
			},

			getL	: function() {
				return this._l;
			},
			
			setL	: function(l) {
				this._l = l
			},

			getT	: function() {
				return this._t;
			},
			
			setT	: function(t) {
				this._t = t;
			},

			getR	: function() {
				return this._r;
			},
			
			setR	: function(r) {
				this._r = r;
			},

			getB	: function() {
				return this._b;
			},
			
			setB	: function(b) {
				this._b = nB;
			},

			getAll  : function() {
				if (this._t == this.b && this._t == this._r && this._r == this._l) {
					return this._t;
				} else {
					return null;
				}
			},

			setAll	: function(a) {
					this._t = this._r = this._l = this._b = a;
			}
	});

	return _TRBLA;
	
});	