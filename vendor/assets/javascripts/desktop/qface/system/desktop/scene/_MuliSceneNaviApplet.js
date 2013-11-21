/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-geometry",
	"dojo/_base/fx", // fx.Animation
	"dojo/_base/html",
	"dojo/on",
	"dojo/dnd/Source",
	"dojo/Deferred",
	"dojo/has",
	"dojo/topic",
	"dijit/form/Form",
	"dijit/form/Select",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"qfacex/widgets/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
	"qfacex/widgets/complex/applet/Applet",
	"qfacex/widgets/window/Window",
	"qface/system/tools/AddScene/App",
	"dojo/i18n!qface/system/desktop/scene/nls/Scene"
], function(declare,lang,array,domClass,domStyle,domConstruct,domGeom,dojoFx,domHtml,on,dndSource,Deferred,has,topic,Form,Select,Dialog,
	Button,TextBox,BorderContainer,TabContainer,ContentPane,_TemplatedMixin,_WidgetsInTemplateMixin,QApplet,Window,AddScene,nlsScene){
	// module:
	//		openstar
	// summary:
	//		The openstar package main module

	var MultiSceneNaviBar = declare([QApplet],{
		sceneContainer : null,
		_sceneIconsMap : null,
		_currentSceneName : "",

		constructor : function(params) {
			this._sceneIconsMap = new Array();
		},
		
		postCreate: function(){
			domClass.add(this.containerNode, "navBar");
			var ulNode = this.ulNode = domConstruct.create("ul");
			domClass.add(ulNode,"scene-list");
			this.containerNode.appendChild(ulNode);
			this._createAddNode();
			this.inherited(arguments);
		},
		
		_createAddNode: function(){
			var self = this;
			// var addtr = domConstruct.create("tr",{"class":"scene-action"});
			var addLiNode = domConstruct.create("li",{"class":"sceneAction"},this.ulNode);
			var a = domConstruct.create("a",{
				label:"add",
				title:"add",
				"class":"addScene",
				onclick: function(){
					var currentScene = self.currentScene();
					var add = new AddScene({scene:currentScene,sceneContainer:self.sceneContainer});
					add.init();
					topic.publish("qface/system/tools/addScene",{sceneNaviBar:self,desktop:currentScene.desktop});
				}
			},addLiNode);
		},
		
		addScene : function(name,scene) {
			var liNode = domConstruct.create("li");
			this.ulNode.appendChild(liNode);
			
			var aNode = domConstruct.create("a");
			domHtml.setSelectable(aNode, false);
			
			domClass.add(aNode,"ui-droppable");
			
			liNode.appendChild(aNode);
			
			on(aNode,"click",lang.hitch(this,function() {
				this.selectScene(name);
			}));
			
			var dskInfo = {
				name : name,
				scene : scene,
				icon : aNode
			};
			this._sceneIconsMap.push(dskInfo);
			this._sceneIconsMap[name] = dskInfo;
		},
		
		removeScene : function() {
		},
		
		selectScene : function(/*String|Number*/name) {
			if (!lang.isString(name)) {
				name = this._sceneIconsMap[name].name;
			}
			if (this._currentSceneName) {
				var preIcon = this._sceneIconsMap[this._currentSceneName].icon;
				domClass.remove(preIcon,"currTab");
			}
			this.sceneContainer.selectChild(this._sceneIconsMap[name].scene,true);
			this._currentSceneName = name;
			// this.desktop.currentScene = this._sceneIconsMap[name].scene;
			var icon = this._sceneIconsMap[name].icon;
			domClass.add(icon,"currTab");
		},
		
		nextScene : function() {
		},
		
		searchScene : function ()	{
			var currentValue = domStyle.get('search-form','display');
			if (currentValue == "none"){
			  domStyle.set('search-form', 'display', 'block');
			} else {
			  domStyle.set('search-form', 'display', 'none');
			}
		},
		
		currentScene : function() {
			return this._sceneIconsMap[this._currentSceneName].scene;
		}
	});

	return MultiSceneNaviBar;
});
