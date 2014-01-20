/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 *
 * @Author: lihongwang
 * @Date: 2013/11/02
 */
define([
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
	"qface/system/desktop/scene/_MuliSceneNaviApplet",
	"qface/system/desktop/scene/_MultiSceneContainer",
	"qface/system/desktop/scene/impl/singleap/Scene",
	"qfacex/widgets/complex/applet/Panel",
	"qfacex/widgets/complex/applet/FullScreen",
	"qfacex/widgets/complex/applet/Clock",
	"qfacex/widgets/complex/applet/UnFullDesk",
	"qfacex/widgets/complex/applet/Theme",
	"qfacex/widgets/complex/applet/Search",
	"qfacex/widgets/complex/applet/LinkArea",
	"qfacex/widgets/complex/applet/Account",
	"qfacex/widgets/complex/applet/Applet"
], function(lang,declare,domStyle,domConstruct,domClass,Deferred,has,on,topic,JSON,jsonRef,_Desktop,BorderContainer,
	_MuliSceneNaviApplet,_MultiSceneContainer,SingleScene,QPanel,AppletFullScreen,AppletClock,AppletUnFullDesk,AppletTheme,AppletSearch,AppletLinkArea,AppletAccount,Applet){

	var SceneNaviBar = _MuliSceneNaviApplet;

	var SystemLogoApplet =  declare([Applet], {
		constructor: function(args){
			this.logoname = args.logoname || "UTILHUB";
		},
		postCreate: function(){
			var div = domConstruct.create("div",{class:"appLogo"},this.containerNode);
			domConstruct.create("span",{class:"separator"},div);
			var a = domConstruct.create("a",{href:"/",class:"home has_bottom_tooltip","data-original-title":"Dashboard"},div);
			domConstruct.create("h1",{innerHTML:this.logoname},a);
			domConstruct.create("span",{class:"separator"},div);
		}
	});

	var SystemToolBar = declare([QPanel],{
		//	summary:
		//		A customizable toolbar that you can reposition and add/remove/reposition applets on
		templateString: "<div class=\"systemPanel\" dojoAttachEvent=\"onmousedown:_onClick, oncontextmenu:_onRightClick\"><div class=\"systemPanelContainer\" style=\"width:100%;height:100%\" data-dojo-attach-point=\"containerNode\"></div></div>",

		opacity: 0.95,
		_onClick : function() {
		},
		_onRightClick : function() {
		}
	});

	var HomeDesktop = declare([_Desktop],{
		init: function(config){
			this._config = config;
			var deferred = new Deferred();
			this._createHost();
			dojo.dnd.autoScroll = function(e){}//in order to prevent autoscrolling of the window
			on(window,"resize",lang.hitch(this,this.resize));
			var html =  dojo.doc.documentElement;
			var tmClass = this._termMode == _Desktop.TermMode.PC?"pc":"mobile";
			domClass.add(html,tmClass);
			this._createSceneContainer();
			this._createSystemToolBar();

			var scene =	SingleScene({name:"appStore",desktop:this});
			this.addScene(scene);
			scene.init(this._config);
			return deferred;
		},

		_createHost : function(){
			// need change
			this.inherited(arguments);
			domStyle.set(this.mainBorder.domNode,"margin-top","-20px");
		},

		_createSystemToolBar : function() {
			var toolBar  = this.toolBar = new SystemToolBar({
				region: "top",
				layoutPriority:1
			});
			var systemLogo = this.systemLogo = new SystemLogoApplet({settings:{},pos:0.05,logoname:this._config.logoname});
			toolBar.addChild(systemLogo);

			// var search = this.search = new AppletSearch({settings:{},pos:0.40});
			// toolBar.addChild(search);

			// var fullScreen = this.fullScreen = new AppletFullScreen({settings:{},pos:0.75});
			// toolBar.addChild(fullScreen);

			var linkArea = this.linkArea = new AppletLinkArea({settings:{},pos:0.85,configName:"signIn"});

			toolBar.addChild(linkArea);
			this.mainBorder.addChild(toolBar);
		},

		_createSceneContainer: function(){
			var sceneContainer = this.sceneContainer = new _MultiSceneContainer({
				region:'center',
				controllerWidget: "dijit.layout.StackController",
				style:"width:1100px;margin:0 auto;"
			});
			this.mainBorder.addChild(sceneContainer);
			return sceneContainer;
		}
	});


	return HomeDesktop;
});
