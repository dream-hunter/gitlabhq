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
	"qface/lang/Object",
	"qface/data/style/_TRBLA"
],function(declare,Object_TRBLA) {
	var _WIDTH_R	= /\d+/ ,
		_WIDTHS_R	= /\d+\D*\s*/g ;

	var Paddings = declare(_TRBLA,{
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
		constructor	: function(s) {
			var a = s.match(_WIDTHS_R);
			var t,
				r,
				l,
				b,
				len = a.length;
			for (var i = 0;i<len ; i++){
				a[i] = _WIDTH_R.exec(a[i]);
				a[i] = Math.parseInt(a[i]);
			}
			switch (len)	{
				case 1:
					t = r = l = b = a[0];
					break;
				
				case 2:
					t =  b = a[0];
					r =  l = a[1];
					break;
				case 3:
					t = a[0];
					r =  l = a[1];
					b = a[2]
					break;
				case 4:
					t = a[0];
					r = a[1];
					l = a[2]
					b = a[3];
					break;
				}
			}
			this._applyAttributes({
				"left"	:	l,
				"right"	:	r,
				"top"	:	t,
				"bottom":	b
			});
		},
		
		equale	:	function(target){
			return 	this.left == target.left &&
					this.top == target.top &&
					this.right == target.right &&
					this.bottom == target.bottom;
		}
	});
	
	Object.mixin(Padding,{
		vtos	: function(o) {
			var count = 0,
				l = o.left,
				t = o.top,
				r = o.right,
				b = o.bottom;
			if (r == l) {
				if (t == b){
					if (t == r){
						return t.toString();
					} else {
						return t + " " + r;
					}
				} else {
						return t + " " + r+ " " + b ;
				}
			} else {
					return t + " " + r + " " + l+ " " + b ;
			}
		
		},

		vfroms	: function(sValue) {
			return new Paddings(sValue);
		},
		
	});

	return Paddings;
	
});	