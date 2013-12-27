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
	"dojo/mouse",
	"dojo/_base/array",
  "dojo/text!config/utilhub.json",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,mouse,array,utilhubConfig,Applet) {

	return declare([Applet], {

		dispName: "account",
		constructor: function(args){
			this.config = args.config || {};
		},
		
		postCreate: function(){
			var self = this;
			var aConfig = JSON.parse(utilhubConfig)["accountZone"];
			var div = domConstruct.create("div",{
				class:"accountContent",
				onclick: function(){
					domClass.contains(this,"accountActive") ? domClass.remove(this,"accountActive") : domClass.add(this,"accountActive");
					var displayValue = domStyle.get(self.ul,"display");
					domStyle.set(self.ul,"display",displayValue === "none" ? "block" : "none");
					// domStyle.set(arrowContainer,"display",displayValue === "none" ? "block" : "none");
				}
			},this.containerNode);
			
			if(this.config.userAvatar){
				domConstruct.create("img",{class: "avatar desktopAvatar",src:this.config.userAvatar,title:this.config.username},div);
			} else {
				domConstruct.create("i",{class:"avatar defaultAvatar",title:this.config.username},div);
			}

			// var arrowContainer = domConstruct.create("div",{class:"arrowContainer"},div);
			// domConstruct.create("span",{class:"arrowUp"},arrowContainer);

			var ul = this.ul = domConstruct.create("ul",{class:"accountList"},div);
			for(var i = 0,length = aConfig.length; i<length; i++){
				var li = domConstruct.create("li",{},ul);
				var a = domConstruct.create("a",{href:aConfig[i]["href"],title:aConfig[i]["title"],target: "_blank"},li);
				domConstruct.create("i",{class:aConfig[i]["iconClass"] + " actionIcon"},a);
				domConstruct.create("i",{innerHTML:aConfig[i]["name"],class:"actionTitle"},a);
				if(i < length - 1){
					domConstruct.create("li",{class:"menuDivider"},ul);
				}
			}

			on(div,mouse.enter,function(){
				domClass.add(this,"accountActive");
				domStyle.set(ul,"display","block");
				// domStyle.set(arrowContainer,"display","block");
			});

			on(div,mouse.leave,function(){
				domClass.remove(this,"accountActive");
				domStyle.set(ul,"display","none");
				// domStyle.set(arrowContainer,"display","none");
			});

		}
	});

});

