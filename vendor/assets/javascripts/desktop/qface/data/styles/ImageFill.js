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
	"qface/data/styles/TileFill"
],function(declare,Fill) {
	var ImageFill = declare(TileFill,{


		getImageSource	: function() {
			return this.get("imageSource");
		},

		setImageSource	: function(/*String*/source){
			this.set("imageSource",source);
		}


	});

	return ImageFill;
	
});	