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
	"dojo/_base/array",
  "dojo/text!config/utilhub.json", 
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,array,utilhubConfig,Applet) {

	return declare([Applet], {

		dispName: "account",
		
		postCreate: function(){
			var self = this;
			var aConfig = JSON.parse(utilhubConfig)["accountZone"];
	    var div = domConstruct.create("div",{
	    	class:"accountContent",
				onclick: function(){
					domClass.contains(this,"accountActive") ? domClass.remove(this,"accountActive") : domClass.add(this,"accountActive");
					var displayValue = domStyle.get(self.ul,"display");
					domStyle.set(self.ul,"display",displayValue === "none" ? "block" : "none");
					domStyle.set(self.arrow,"display",displayValue === "none" ? "block" : "none");
	    	}
	    },this.containerNode);
	    domConstruct.create("i",{class:"avatar"},div);
	    var arrow = this.arrow = domConstruct.create("span",{class:"arrowUp"},div);
    	
    	var ul = this.ul = domConstruct.create("ul",{class:"accountList"},div);
    	for(var i = 0,length = aConfig.length; i<length; i++){
				var li = domConstruct.create("li",{},ul);
	    	var a = domConstruct.create("a",{href:aConfig[i]["href"],title:aConfig[i]["title"]},li);
		    domConstruct.create("i",{class:aConfig[i]["iconClass"] + " actionIcon"},a);
		    domConstruct.create("i",{innerHTML:aConfig[i]["name"],class:"actionTitle"},a);
		    if(i < length - 1){
		    	domConstruct.create("li",{class:"menuDivider"},ul);
		    }    		
    	}
		}
	});

});

