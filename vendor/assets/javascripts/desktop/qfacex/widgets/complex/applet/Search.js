/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: lihongwang
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/lang", 
	"dojo/_base/declare", 
  "dojo/dom-style",
  "dojo/dom-class",
	"dojo/dom-construct", 
  "dojo/on",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,Applet) {

	return declare([Applet], {

		dispName: "Search",
		
		postCreate: function(){
			// var search = domConstruct.create("div",{class:"nav appletContent"},this.containerNode);
			domConstruct.create("input",{},this.containerNode);
			domConstruct.create("button",{
				label: "Search",
				innerHTML:"Search",
				"click": lang.hitch(this,function(){

				})
			},this.containerNode);
		}
	});

});
