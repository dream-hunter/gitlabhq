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
	"qface/data/geom/Point"
],function(declare,Point) {
	var Location = declare(Point,{
	});

	Location.x0y0 = new Location(0,0);
	
	return Location;
	
});	