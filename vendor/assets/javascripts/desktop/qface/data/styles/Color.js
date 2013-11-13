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
	"dojo/colors"
],function(declare,lang,number,Color) {
	var	_HEX_R =/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
		_TRANS_R = /^transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/i ,
		_SYSTEM_R = /^(ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText)$/i ,
		_RGB_R	= /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
		_HEX3_R	= /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;


	/*
	 *static methods:
	 *fromRgb     : {Color} function({String} color, {Color?} obj)
	 *fromHex     : {Color} function({String} color, {Color?} obj)
	 *fromArray   : {Color} function({String} color, {Color?} obj)
	 *fromString  : {Color} function({String} color, {Color?} obj)
     *
	 *instance methods:
	 *setColor    : {Color} function({Array|String|Object} color)
	 *toRgb       : {Array} function ()
	 *toRgba      : {Array} function ()
	 *toHex       : {String}function ()
	 *toCss       : {String} function ()
	 *toString    : {String} function ()
	 */
	lang.mixin(Color,{
		rgb2hsl	 : function(r, g, b){
			var sl_h,sl_s,sl_l;
			var h,s,l,v,m;
			r /= 255, g /= 255, b /= 255;
			v = Math.max(r, g), v = Math.max(v, b);
			m = Math.min(r, g), m = Math.min(m, b);
			l = (m+v)/2;
			if (v == m)  {
				sl_h = 0, sl_s = 0, sl_l = Math.round(l*255);
			} else {
				if (l <= 0.5) s = (v-m)/(v+m);
				else s = (v-m)/(2-v-m);
				if (r == v) h = (g-b)/(v-m);
				if (g == v) h = 2+(b-r)/(v-m);
				if (b == v) h = 4+(r-g)/(v-m);
				h *= 60; if (h<0) h += 360;
				sl_h = Math.round(h/360*255);
				sl_s = Math.round(s*255);
				sl_l = Math.round(l*255);
			}
			return {h:sl_h,s:sl_s,l:sl_l};
		},
		
		hsl2rgb : function(h, s, l){
			var sl_r,sl_g,sl_b;
			var r, g, b, v, m, se, mid1, mid2;
			h /= 255, s /= 255, l /= 255;
			if (l <= 0.5) v = l*(1+s);
			else v = l+s-l*s;
			if (v <= 0) {
				sl_r = 0, sl_g = 0, sl_b = 0;
			} else {
				m = 2*l-v,h*=6, se = Math.floor(h);
				mid1 = m+v*(v-m)/v*(h-se);
				mid2 = v-v*(v-m)/v*(h-se);
				switch (se)	{
					case 0 : r = v;    g = mid1; b = m;    break;
					case 1 : r = mid2; g = v;    b = m;    break;
					case 2 : r = m;    g = v;    b = mid1; break;
					case 3 : r = m;    g = mid2; b = v;    break;
					case 4 : r = mid1; g = m;    b = v;    break;
					case 5 : r = v;    g = m;    b = mid2; break;
				}
				sl_r = Math.round(r*255);
				sl_g = Math.round(g*255);
				sl_b = Math.round(b*255);
			}
			return {r:sl_r,g:sl_g,b:sl_b};
		},

        rgb2hex: function (r,g,b) {
            return "#"+r.toString(16).toUpperCase() + g.toString(16).toUpperCase() + b.toString(16).toUpperCase();
        },
     
        hex2rgb: function(s) { 
			var r,g,b;
			c =_HEX_R.exec(s);
			if(c&&c.length==4){
				r = Math.parseInt(c[1],16),g = Math.parseInt(c[2],16),b = Math.parseInt(c[3],16);
				return {r:r,g:g,b:b};
			} else {
				c=_RGB_R.exec(s);
				if(c&&c.length==4){
					r = Math.parseInt(c[1],10),g = Math.parseInt(c[2],10),b = Math.parseInt(c[3],10);
					return {r:r,g:g,b:b};
				} else {
					c=_HEX3_R.exec(s);
					if(c&&c.length==4){
						r = Math.parseInt(c[1]+c[1],16),g = Math.parseInt(c[2]+c[2],16),b = Math.parseInt(c[3]+c[3],16);
						return {r:r,g:g,b:b};
					}
				}
			}
			return ; 
        }
	});
	
	for (var colorName in Color.named) {
		Color[colorName] = Color.fromArray(Color.named[colorName]);
	
	}
	
	lang.mixin(Color,{
	});

	return Color;
	
});	