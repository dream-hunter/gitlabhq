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
		constructor: function(params){
			this.appWindow = params.appWindow;
		},

		dispName: "UnFull Scene",
		
		postCreate: function(){
			
			var div = domConstruct.create('div',{
				class:"nav appletContent",
				title : this.dispName
			}, this.containerNode);
			
			var i = domConstruct.create("i",{class:"icon-16-actions-window-unfull"},div);

			on(i,"click",lang.hitch(this,this.unFullScene));
		    
			on(i,"mouseover",function(){
				domClass.add(i,"actived");
			});
		    
			on(i,"mouseout",function(){
				domClass.remove(i,"actived");
			});

		    this.inherited(arguments);
		},

		unFullScene : function() {
			this.appWindow.unfull();
			this.onUnFull();
		},
		
		onUnFull : function() {
		},
	});

});
