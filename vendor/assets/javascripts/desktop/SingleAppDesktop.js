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
], function(dojo,require,lang,declare,domStyle,domConstruct,domClass,Deferred,has,on,topic,JSON,jsonRef,_Desktop,BorderContainer,
	_MuliSceneNaviApplet,_MultiSceneContainer,SingleScene,QPanel,AppletFullScreen,AppletClock,AppletUnFullDesk,AppletTheme,AppletSearch,AppletLinkArea,AppletAccount,Applet){

	var SceneNaviBar = _MuliSceneNaviApplet;

	var SystemLogoApplet =  declare([Applet], {
			postCreate: function(){
				var div = domConstruct.create("div",{class:"appLogo"},this.containerNode);
				domConstruct.create("span",{class:"separator"},div);
				var a = domConstruct.create("a",{href:"/",class:"home has_bottom_tooltip","data-original-title":"Dashboard"},div);
				domConstruct.create("h1",{innerHTML:"UTILHUB"},a);
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
	
	var utilhubHomeDesktop = declare([_Desktop],{

		init: function(){
			var deferred = new Deferred();
			this._createHost();
			dojo.dnd.autoScroll = function(e){} //in order to prevent autoscrolling of the window
			on(window,"resize",lang.hitch(this,this.resize));
			var html =  dojo.doc.documentElement;
			var tmClass = this._termMode == _Desktop.TermMode.PC?"pc":"mobile";
		
			domClass.add(html,tmClass);		
			
			var dsc  = this._createSceneContainer();
			this._createSystemToolBar();

			var scene =	SingleScene({name:"appStore",desktop:this});
			config = {
				app: {
					"sysname":"pst.AppStore.AppStore",
					"name":"AppStore",
					"category":"System",
					"icon":"icon-32-apps-preferences-desktop-theme",
					"version":"1.0",
					"updated_at":"2013-10-11",
					"fav_count":"22",
					"args":{loadCssPath:"../resources/stylesheets/appForHome.css"}
				}
			}
			this.addScene(scene);
			scene.init(config);
			topic.publish("appStore/showForHome","full");
	    return deferred;
		},

		_createHost : function(){
			var mbc = this.mbc = new BorderContainer({
				design: "headline",
				gutters: false,
				liveSplitters: false,
				style:"width:100%;height:100%;margin-top:-13px;"
			});

			document.body.appendChild(mbc.domNode);
			
			mbc.startup();

		},

		_createSystemToolBar : function() {
			var stb  = this.stb = new SystemToolBar({
				region: "top",
				layoutPriority:1
			});

			var systemlogo = this.systemlogo = new SystemLogoApplet({settings:{},pos:0.05});
			stb.addChild(systemlogo);

			// var search = this.search = new AppletSearch({settings:{},pos:0.40});
			// stb.addChild(search);

			// var fullScreen = this.fullScreen = new AppletFullScreen({settings:{},pos:0.75});
			// stb.addChild(fullScreen);

			var linkArea = this.linkArea = new AppletLinkArea({settings:{},pos:0.85,configName:"signIn"});
			stb.addChild(linkArea);

			this.mbc.addChild(stb);	

		}
	});


	return utilhubHomeDesktop;
});
