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
  "dojo/topic",
  "qface/system/tools/widgets/SearchWidget",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,topic,SearchWidget,Applet) {

	return declare([Applet], {

		dispName: "Search",
		
		postCreate: function(){
			// var search = domConstruct.create("div",{class:"nav appletContent"},this.containerNode);
			var search = new SearchWidget();
			this.addChild(search);
			topic.publish("qface/search",this,"_search");
			/*var form = domConstruct.create("form",{class:"nav appletContent"},this.containerNode);
			domConstruct.create("input",{},form);
			domConstruct.create("button",{
				label: "Search",
				innerHTML:"Search",
				"click": lang.hitch(this,function(){

				})
			},form);*/
		},

		_search: function(){
			alert("well done! good job!");
		}
	});

});
