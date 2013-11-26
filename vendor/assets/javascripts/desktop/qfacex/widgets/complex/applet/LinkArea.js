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
	"dojo/dom-attr",
	"dojo/request",
	"dojo/request/iframe",
	"dojo/_base/array",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,domAttr,request,iframe,array,Applet) {

	return declare([Applet], {
		constructor: function(args){
			this.links = args && args.links ? args.links : ["public-globe#Public Area","admin-cogs#Admin Area","projects/new-plus#Create New Project","profile-user#My Profile"];
		},

		dispName: "linkArea",
		
		postCreate: function(){
			var self = this;
			var baseUrl = "./";
	    	var ul = domConstruct.create("ul",{class:"nav appletContent"},this.containerNode);
	    	array.forEach(this.links,function(link){
	    		// \w+(_|\b)?\w+      title         matcher[1]
	    		// \/\w+              action        matcher[3]
	    		// -(\w+(_|\b)?\w+)   class name    matcher[5]
	    		// #(.*)+             detail title  matcher[8]
	    		var matcher = link.match(/(\w+(_|\b)?\w+)(\/\w+)?(-(\w+(_|\b)?\w+)+)?(#(.*)+)?/);
	    		var url = matcher[1];
	    		var title = matcher[1];
	    		if(matcher[3]) url += matcher[3];
	    		var iconClass = matcher[5];
	    		var ditailTitle = matcher[8];
		    	var li = domConstruct.create("li",{},ul);
		    	var a = domConstruct.create("a",{
		    		class:"has_bottom_tooltip",
		    		"data-original-title":ditailTitle,
		    		onclick: function(){
		    			self.getLinkContent(baseUrl+url);
		    		}
		    	},li);
		    	if(iconClass){
		    		domConstruct.create("i",{class:"icon-" + iconClass},a);
		    	} else {
		    		domAttr.set(a,"title",ditailTitle);
		    		domConstruct.create("span",{innerHTML:title},a);
		    	}
	    	});
		},

		getLinkContent: function(url){
			iframe(url);
		}
		
	});

});


