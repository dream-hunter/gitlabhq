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
	"dojo/_base/Color"
],function(declare,lang,number,Color) {
	var Font = declare(null,{
		_c		: null,
		_name	: null,
		_size	: null,
		_unit	: null,
		_color	: null,

		_b		: false,
		_i		: false,
		_u		: false,
		_s		: false,

		

		_initialize	: function(c) {
			this._c = c;
		},

		_finalize	: function() {
			this._c = null;
		},

		getName	: function() {
			return this._name;
		},

		setName	: function(name) {
			if (this._c) {
				UIElement.setFontName(this._c._el,name);
			} else {
				this._name = name;
			}

		},
		
		getBold	: function() {
			if (this._c) {
				return UIElement.getFontBold(this._c._el);
			} else {
				return this._b;
			}
		},

		setBold	: function(bBold) {
			if (this._c) {
				UIElement.setFontBold(this._c._el,bBold);
			} else {
				this._b = bBold;
			}

		},

		getItalic	: function() {
			if (this._c) {
				return UIElement.getFontItalic(this._c._el);
			} else {
				return this._i;
			}
		},

		setItalic	: function(bItalic) {
			if (this._c) {
				UIElement.setFontItalic(this._c._el,bItalic);
			} else {
				this._b = bItalic;
			}
		},

		getUnderline	: function() {
			if (this._c) {
				return UIElement.getFontUnderline(this._c._el);
			} else {
				return this._u;
			}
		},

		setUnderline	: function(bUnderline) {
			if (this._c) {
				UIElement.setFontUnderline(this._c._el,bUnderline);
			} else {
				this._u = bUnderline;
			}
		},

		getStrikeout	: function() {
			if (this._c) {
				return UIElement.getFontStrikeout(this._c._el);
			} else {
				return this._s;
			}
		},

		setStrikeout	: function(bStrikeout) {
			if (this._c) {
				UIElement.setFontStrikeout(this._c._el,bStrikeout);
			} else {
				this._s = bStrikeout;
			}
		},

		getUnit	: function() {
			if (this._c) {
				return UIElement.getFontUnit(this._c._el);
			} else {
				return this._unit;
			}
		},

		setUnit	: function(unit) {
			if (this._c) {
				UIElement.setFontUnit(this._c._el,unit);
			} else {
				this._unit = unit;
			}
		},

		getSize	: function() {
			if (this._c) {
				return UIElement.getFontSize(this._c._el);
			} else {
				return this._size;
			}
		},

		setSize	: function(size) {
			if (this._c) {
				UIElement.setFontSize(this._c._el,size);
			} else {
				this._size = size;
			}
		},

		getColor	: function() {
			if (this._c) {
				return UIElement.getFontColor(this._c._el);
			} else {
				return this._color;
			}
		},

		setColor	: function(oColor){
			if (this._c) {
				UIElement.setFontColor(this._c._el,oColor);
			} else {
				if (System.instanceOf(oColor,String)){
					this._color = W.Color.vfroms(oColor);
				} else {
					this._color = oColor;
				}
			}

		},

		assign	: function(oFont) {
			this.setName(oFont.getName());
			this.setBold(oFont.getBold());
			this.setItalic(oFont.getItalic());
			this.setUnderline(oFont.getUnderline());
			this.setStrikeout(oFont.getStrikeout());
			this.setUnit(oFont.getUnit());
			this.setSize(oFont.getSize());
		}
	});

	return Color;
	
});	