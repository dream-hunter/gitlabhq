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
    "dojo/text!config/utilhub.json", 
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,domAttr,request,iframe,array,utilhubConfig,Applet) {

	return declare([Applet], {
		constructor: function(args){
			this.configName = args.configName || "actionZone";
		},
		dispName: "linkArea",
		
		postCreate: function(){
	    	var ul = domConstruct.create("ul",{class:"nav appletContent"},this.containerNode);
			var config = JSON.parse(utilhubConfig);
	    	array.forEach(config[this.configName],function(item){
		    	var li = domConstruct.create("li",{},ul);
		    	var a = domConstruct.create("a",{
		    		class:item.class,
		    		title:item.title,
		    		"data-original-title":item.title,
		    		href:item.href
		    	},li);
		    	if(item.iconClass){
		    		domConstruct.create("i",{class:item.iconClass},a);
		    	} else {
		    		domConstruct.create("span",{innerHTML:item.name},a);
		    	}
	    	});
		}
		
	});

});


