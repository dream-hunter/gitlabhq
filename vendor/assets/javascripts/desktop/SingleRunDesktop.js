/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: lihongwang
 * @Date: 2013/11/02
 */
define([
	"dojo",
	"require",
	"dojo/_base/lang", 
	"dojo/_base/declare", 
	"dojo/dom-style",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-class",
	"dojo/Deferred",
	"dojo/has",
	"dojo/on",
	"dojo/topic",
	"dojo/json",
	"dojox/json/ref",
	"qface/system/desktop/_Desktop",
	"qfacex/widgets/layout/BorderContainer",
	"qface/system/desktop/scene/impl/icons/SingleRunScene"
], function(dojo,require,lang,declare,domStyle,domConstruct,domClass,Deferred,has,on,topic,JSON,jsonRef,_Desktop,BorderContainer,Scene){

	var RunDesktop = declare([_Desktop],{

		init: function(config){
			this._config = config;
			var deferred = new Deferred();
			this._createHost();
			dojo.dnd.autoScroll = function(e){} //in order to prevent autoscrolling of the window
			on(window,"resize",lang.hitch(this,this.resize));
			var html =  dojo.doc.documentElement;
			var tmClass = this._termMode == _Desktop.TermMode.PC?"pc":"mobile";
		
			domClass.add(html,tmClass);		
			
			// create by _Desktop
			var dsc  = this._createSceneContainer();

			var scene =	Scene({desktop:this}); 
			this.addScene(scene);
			scene.init(this._config.scenes.icons);
	    return deferred;
		},

		_createHost : function(){
			var mainBc = this.mbc = new BorderContainer({
				design: "headline",
				gutters: false,
				liveSplitters: false,
				style:"width:100%;height:100%;"
			},this._config.parentNodeId);

			mainBc.startup();
		}
	});

	return RunDesktop;
});
