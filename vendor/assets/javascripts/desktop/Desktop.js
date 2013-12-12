/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: lihongwang
 * @Date: 2013/10/28
 */
define([
	"dojo",
	"require",
	"dojo/_base/lang", 
	"dojo/_base/declare", 
	"dojo/dom-style",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-geometry",
	"dojo/_base/fx", // fx.Animation
	"dojo/dnd/Source",
	"dojo/has",
	"dojo/on",
	"dojo/topic",
	"dojo/json",
	"dojox/json/ref",
	"qface/system/desktop/_Desktop",
	"qfacex/widgets/layout/BorderContainer",
	"qface/system/desktop/scene/_MuliSceneNaviApplet",
	"qface/system/desktop/scene/_MultiSceneContainer",
	"qface/system/desktop/scene/impl/icons/Scene",
	"qface/system/desktop/scene/impl/explorer/MultiTabScene",
	"qface/system/desktop/scene/impl/explorer/MultiAppScene",
	"qface/system/desktop/scene/impl/explorer/SingleAppScene",
	"qface/system/desktop/scene/impl/singleap/Scene",
	"qfacex/widgets/complex/applet/Panel",
	"qfacex/widgets/complex/applet/Netmonitor",
	"qfacex/widgets/complex/applet/FullScreen",
	"qfacex/widgets/complex/applet/Clock",
	"qfacex/widgets/complex/applet/UnFullDesk",
	"qfacex/widgets/complex/applet/Theme",
	"qfacex/widgets/complex/applet/Search",
	"qfacex/widgets/complex/applet/LinkArea",
	"qfacex/widgets/complex/applet/Account",
	"qfacex/widgets/complex/applet/Applet"
], function(dojo,require,lang,declare,domStyle,domConstruct,domGeom,dojoFx,dndSource,has,on,topic,JSON,jsonRef,_Desktop,BorderContainer,
	_MuliSceneNaviApplet,_MultiSceneContainer,IconsScene,MultiTabScene,MultiAppScene,SingleAppScene,SingleScene,QPanel,
	AppletNetmonitor,AppletFullScreen,AppletClock,AppletUnFullDesk,AppletTheme,AppletSearch,AppletLinkArea,AppletAccount,Applet){

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
	
	var utilhubUserDesktop = declare([_Desktop],{
	
		aplUnFull : null,
		
		fullSceneed : function (win) {
			var aplUnFull = this.aplUnFull = new AppletUnFullDesk({settings:{},pos:0.70,appWindow:win});
			this.stb.addChild(aplUnFull);
			this.stb.resize();
		},

		unFullSceneed : function (win) {
			if (this.aplUnFull) {
				this.aplUnFull.destroy();
				this.aplUnFull = undefined;
			}
		},

		_createHost : function(){
			var mbc = this.mbc = new BorderContainer({
				design: "headline",
				gutters: false,
				liveSplitters: false,
				style:"width:100%;height:100%;margin-top:-20px;"
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
			
			var sceneNaviBar = this.sceneNaviBar = new SceneNaviBar({settings:{},pos:0.40,sceneContainer:this.dsc});
			stb.addChild(sceneNaviBar);

			var fullScreen = this.fullScreen = new AppletFullScreen({settings:{},pos:0.65});
			stb.addChild(fullScreen);

			var linkArea = this.linkArea = new AppletLinkArea({settings:{},pos:0.75});
			stb.addChild(linkArea);
			
			
			var account = this.account = new AppletAccount({settings:{},pos:0.95,config:this._config});
			stb.addChild(account);
					
			var theme = this.theme = new AppletTheme({settings:{},pos:0.65});
			// stb.addChild(theme);

			this.mbc.addChild(stb);

			on(theme,"ChangeTheme",lang.hitch(this,function(theme){
				var scene = this.dsc.selectedChildWidget;
				this.changeTheme(scene,theme);
				this.applyTheme(theme);
				this.resize();
			}));	

			topic.subscribe("/qfacex/widgets/window/Window/full",lang.hitch(this,function(win,isFull){
				if (isFull) {
					this.fullSceneed(win);
				} else {
					this.unFullSceneed(win);
				}	
			}));
		},
		
		addScene : function(scene) {
			this.inherited(arguments);
			this.sceneNaviBar.addScene(scene.name,scene);
		},
		
		start : function() {
			this.inherited(arguments);
			this.sceneNaviBar.selectScene(0);
		}
	});

	return utilhubUserDesktop;
});
