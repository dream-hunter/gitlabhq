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
	"qface/data/style/_TRBLA"
],function(declare,lang,_TRBLA) {
	var	_STYLES_R	= /\S+\s*/g ,
		_COLORS_R	= /\S+\s*/g ,
		_WIDTH_R	= /\d+/ ,
		_WIDTHS_R	= /\d+\D*\s*/g ,


	var BorderStyle = declare(_TRBLA,{
		constructor	: function(s) {
			if (s) {
				var a = s.match(_STYLES_R);
				var len = a.length;
				for (var i = 0;i<len ; i++){
					a[i] = BorderStyle.vfroms(a[i]);
				}
				switch (len)	{
					case 1:
						this._t = this._r = this._l = this._b = a[0];
						break;
					
					case 2:
						this._t =  this._b = a[0];
						this._r =  this._l = a[1];
						break;
					case 3:
						this._t = a[0];
						this._r =  this._l = a[1];
						 this._b = a[2]
						break;
					case 4:
						this._t = a[0];
						this._r = a[1];
						this._b = a[2]
						this._l = a[3];
						break;
				}
			} else {
				this._t = this._r = this._l = this._b = "none";
			}
		}
	});
	
	lang.mixin(BorderStyle,{
		vtos	: function(o) {
			var count = 0; 

			with (BorderStyle) { 
				if (o._r == o._l) {
					if (o._t == o._b){
						if (o._t == o._r){
							return vtos(o._t);
						} else {
							return vtos(o._t) + " " + vtos(o._r);
						}
					} else {
							return vtos(o._t) + " " + vtos(o._r)+ " " + vtos(o._b) ;
					}
				} else {
						return vtos(o._t) + " " + vtos(o._r) + " " + vtos(o._b)+ " " + vtos(o._l) ;
				}
			}
		
		},

		vfroms	: function(sValue) {
			return new BorderStyle(sValue);
		}
	});

	var BorderColor = declare(_TRBLA,{
		constructor	: function(s) {
			var a = s.match(_COLORS_R);
			var len = a.length;
			for (var i = 0;i<len ; i++){
				a[i] = W.Color.vfroms(a[i]);
			}
			switch (len)	{
			case 1:
				this._t = this._r = this._b = this._l = a[0];
				break;
			
			case 2:
				this._t =  this._b = a[0];
				this._r =  this._l = a[1];
				break;
			case 3:
				this._t = a[0];
				this._r =  this._l = a[1];
				 this._b = a[2]
				break;
			case 4:
				this._t = a[0];
				this._r = a[1];
				this._b = a[2]
				this._l= a[3];
				break;
			}
		}
	});
	
	lang.mixin(BorderColor,{
		vtos	: function(o) {
			var count = 0; 
			if (o._r == o._l) {
				if (o._t == o._b){
					if (o._t == o._r){
						return o._t._value;
					} else {
						return o._t._value + " " + o._r._value;
					}
				} else {
						return o._t._value + " " + o._r._value+ " " + o._b._value ;
				}
			} else {
					return o._t._value + " " + o._r._value + " " + o._b._value+ " " + o._l._value ;
			}
		
		},

		vfroms	: function(sValue) {
			return new BorderColor(sValue);
		}
	});
	
	var BorderWidth = declare(_TRBLA,{
		constructor	: function(s) {
			if (s) {
				var a = s.match(_WIDTHS_R);
				if (!a) {
					return null;
				}
				var len = a.length;
				for (var i = 0;i<len ; i++){
					a[i] = _WIDTH_R.exec(a[i]);
					a[i] = Math.parseInt(a[i]);
				}
				switch (len)	{
				case 1:
					this._t = this._r = this._l = this._b = a[0];
					break;
				
				case 2:
					this._t =  this._b = a[0];
					this._r =  this._l = a[1];
					break;
				case 3:
					this._t = a[0];
					this._r =  this._l = a[1];
					 this._b = a[2]
					break;
				case 4:
					this._t = a[0];
					this._r = a[1];
					this._l = a[2]
					this._b = a[3];
					break;
				}
			} else {
					this._t = this._r = this._l = this._b = 0;
			}
		}
	});
	
	lang.mixin(BorderWidth,{
		vtos	: function(o) {
			var count = 0; 
			if (o._r == o._l) {
				if (o._t == o._b){
					if (o._t == o._r){
						return o._t.toString();
					} else {
						return o._t + " " + o._r;
					}
				} else {
						return o._t + " " + o._r+ " " + o._b ;
				}
			} else {
					return o._t + " " + o._r + " " + o._l+ " " + o._b ;
			}
		
		},

		vfroms	: function(sValue) {
			return new BorderWidth(sValue);
		}
	});
	
	var Border = declare(_TRBLA,{
		_c		: null,

		_ws		: null,
		_ss		: null,
        _cs		: null,
		
		_initialize	: function(c) {
			this._c = c;
		},

		_finalize	: function() {
		},

		getStyles	: function() {
			var ss ;
			if (this._c){
				ss = UIElement.getBorderStyles(this._c._el);
			} else {
				ss = this._ss;
			}
			return ss;
		},

		setStyles	: function(oStyles) {
			if (this._c){
				UIElement.setBorderStyles(this._c._el,oStyles);
			} else {
				if (System.instanceOf(oStyles,String)) {
					this._ss = W.BorderStyles.vfroms(oStyles);
				} else {
					this._ss = oStyles;
				}
			}
		},

		getWidths	: function() {
			var ws ;
			if (this._c){
				ws = UIElement.getBorderWidths(this._c._el);
			} else {
				ws = this._ws;
			}
			return ws;
		},

		setWidths	: function(oWidths) {
			if (this._c){
				UIElement.setBorderWidths(this._c._el,oWidths);
			} else {
				if (System.instanceOf(oWidths,String)) {
					this._ws = W.BorderWidths.vfroms(oWidths);
				} else {
					this._ws = oWidths;
				}
			}
		},

		getColors	: function() {
			var cs ;
			if (this._c){
				cs = UIElement.getBorderColors(this._c._el);
			} else {
				cs = this._cs;
			}
			return cs;
		},

		setColors	: function(oColors) {
			if (this._c){
				UIElement.setBorderColors(this._c._el,oColors);
			} else {
				if (System.instanceOf(oColors,String)) {
					this._cs = W.BorderColors.vfroms(oColors);
				} else {
					this._cs = oColors;
				}
			}
		},

		assign		: function(oBorders) {
			this.setWidths(oBorders.getWidths());
			this.setStyles(oBorders.getStyles());
			this.setColors(oBorders.getColors());
		}
	});
	
	return Border;
	
});	