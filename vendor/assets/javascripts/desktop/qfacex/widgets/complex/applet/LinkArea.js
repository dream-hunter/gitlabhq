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
			this.configName = args.configName || "actionZone";
		},
		dispName: "linkArea",
		
		postCreate: function(){
			request("/qface/dashboard/link").then(lang.hitch(this,function(text){
        var config = JSON.parse(text);
		    var ul = domConstruct.create("ul",{class:"nav appletContent"},this.containerNode);
	    	array.forEach(config[this.configName],function(item){
		    	var li = domConstruct.create("li",{},ul);
		    	var a = domConstruct.create("a",{
		    		class:item.class,
		    		title:item.title,
		    		target: "_blank",
		    		"data-original-title":item.title,
		    		href:item.href
		    	},li);
		    	if(item.iconClass){
		    		domConstruct.create("i",{class:item.iconClass},a);
		    	} else {
		    		if(item.userAvatar){
							domConstruct.create("img",{class: "avatar",src:item.userAvatar,title:item.name},a);
		    		} else {
			    		domConstruct.create("span",{innerHTML:item.name},a);
		    		}
		    	}
	    	});
      }));
		}
		
	});

});


