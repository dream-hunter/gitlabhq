/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo",
	"require",
	"dojo/_base/lang", 
	"dojo/_base/declare", 
	"dojo/topic",
	"dojo/dom-style",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/Deferred",
	"dojo/_base/fx", // fx.Animation
	"dojo/dnd/Source",
	"dojo/has",
	"dojo/on",
	"dojo/topic",
	"dojo/json",
	"dojox/json/ref",
	"qface/system/desktop/_Desktop",
	"qfacex/widgets/layout/BorderContainer",
	"qface/system/desktop/scene/impl/singleap/Scene",
], function(dojo,require,lang,declare,topic,domStyle,domConstruct,domGeom,domClass,Deferred,dojoFx,dndSource,has,on,topic,JSON,jsonRef,_Desktop,BorderContainer,SingleScene){
	// module:
	//		openstar
	// summary:
	//		The openstar package main module
	
	return declare([_Desktop],{
		_createHost : function(){
			var mbc = this.mbc = new BorderContainer({
				design: "headline",
				"class":"UtilhubHomePage",
				gutters: false,
				liveSplitters: false,
				style:"width:98%;height:92%;margin:0 auto;;"
			});

			//domClass.add(mbc.domNode,"dijit soria tundra tsunami");		

			document.body.appendChild(mbc.domNode);
			
			mbc.startup();

		},
		init: function(){
			var deferred = new Deferred();

			this._createHost();
			dojo.dnd.autoScroll = function(e){} //in order to prevent autoscrolling of the window
			on(window,"resize",lang.hitch(this,this.resize));
			var html =  dojo.doc.documentElement;
			var tmClass = this._termMode == _Desktop.TermMode.PC?"pc":"mobile";
		
			domClass.add(html,tmClass);		
			
			var dsc  = this._createSceneContainer();
			var scene =	SingleScene({name:"appStore",desktop:this});
			config = {
				app: {
					"sysname":"pst.AppStore.AppStore",
					"name":"AppStore",
					"category":"System",
					"icon":"icon-32-apps-preferences-desktop-theme",
					"version":"1.0",
					"updated_at":"2013-10-11",
					"fav_count":"22"
				}
			}
			this.addScene(scene);
			scene.init(config);
			topic.publish("appStore/do","full");
	    	return deferred;

		}
	});
});
