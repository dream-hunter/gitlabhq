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
  "dojo/request",
  "dojo/request/iframe",
	"dojo/_base/array",
  "dijit/form/DropDownButton",
  "dijit/DropDownMenu",
  "dijit/MenuItem",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,request,iframe,array,DropDownButton,DropDownMenu,MenuItem,Applet) {

	return declare([Applet], {

		dispName: "linkArea",
		
		postCreate: function(){
			var self = this;
			var baseUrl = "./";
			var links = ["public-globe#Public Area","admin-cogs#Admin Area","projects/new-plus#Create New Project","profile-user#My Profile"];
	    var ul = domConstruct.create("ul",{class:"nav appletContent"},this.containerNode);
	    array.forEach(links,function(link){
	    	var matcher = link.match(/(\w*)(\/\w*)?-(\w*)#(.*)/);
	    	var url = matcher[1];
	    	if(matcher[2]) url += matcher[2];
	    	var iconClass = matcher[3];
	    	var title = matcher[4];
		    var li = domConstruct.create("li",{},ul);
		    var a = domConstruct.create("a",{
		    	class:"has_bottom_tooltip",
		    	"data-original-title":title,
		    	onclick: function(){
		    		self.getLinkContent(baseUrl+url);
		    	}
		    },li);
		    domConstruct.create("i",{class:"icon-" + iconClass},a);
	    });
		},

		getLinkContent: function(url){
			iframe(url);
		}
		
	});

});


