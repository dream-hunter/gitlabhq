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
	"qfacex/widgets/complex/applet/Applet"
], function(dojo,require,lang,declare,domStyle,domConstruct,domGeom,dojoFx,dndSource,has,on,topic,JSON,jsonRef,_Desktop,
	_MuliSceneNaviApplet,_MultiSceneContainer,IconsScene,MultiTabScene,MultiAppScene,SingleAppScene,SingleScene,QPanel,
	AppletNetmonitor,AppletFullScreen,AppletClock,AppletUnFullDesk,AppletTheme,Applet){
	// module:
	//		openstar
	// summary:
	//		The openstar package main module

	var SceneNaviBar = _MuliSceneNaviApplet;

 	var	sysApplets = [
		{"settings": {}, "pos": 0.00, "declaredClass": SceneNaviBar},
		{"settings": {}, "pos": 0.78, "declaredClass": AppletFullScreen},
		{"settings": {}, "pos": 0.85, "declaredClass": AppletNetmonitor},
		{"settings": {}, "pos": 0.88, "declaredClass": AppletClock}
	];

	var SystemLogoApplet =  declare([Applet], {
			postCreate: function(){
				domStyle.set(this.containerNode,"padding","3px");
				this.containerNode.innerHTML ="<span style=\"font-size:12pt\">Your Web Page</span>";
			}

	});

	var SystemToolBar = declare([QPanel],{
		//	summary:
		//		A customizable toolbar that you can reposition and add/remove/reposition applets on
		templateString: "<div class=\"systemPanel\" dojoAttachEvent=\"onmousedown:_onClick, oncontextmenu:_onRightClick\" style=\"width:100%;height:28px\"><div class=\"systemPanel systemPanelContainer\" style=\"width:100%;height:100%\" data-dojo-attach-point=\"containerNode\"></div></div>",
	
		opacity: 0.95,
				
		_onClick : function() {
		},
		
		_onRightClick : function() {
		}
		
	});	
	
	var _DemoDesktop = declare([_Desktop],{
	
		aplUnFull : null,
		
		fullSceneed : function (win) {
			var aplUnFull = this.aplUnFull = new AppletUnFullDesk({settings:{},pos:0.78,appWindow:win});
			this.stb.addChild(aplUnFull);
			this.stb.resize();
		},

		unFullSceneed : function (win) {
			if (this.aplUnFull) {
				this.aplUnFull.destroy();
				this.aplUnFull = undefined;
			}
		},

		_createSystemToolBar : function() {
			var stb  = this.stb = new SystemToolBar({
				region: "top",
				layoutPriority:1
			});
			
			var sceneNaviBar = this.sceneNaviBar = new SceneNaviBar({settings:{},pos:0.40,sceneContainer:this.dsc});
			stb.addChild(sceneNaviBar);

			var systemlogo = this.systemlogo = new SystemLogoApplet({settings:{},pos:0});
			stb.addChild(systemlogo);

			// var netmonitor = this.netmonitor = new AppletNetmonitor({settings:{},pos:0.8});
			// stb.addChild(netmonitor);

			var fullScreen = this.fullScreen = new AppletFullScreen({settings:{"domNodeId":this._config.parentNodeId},pos:0.82});
			stb.addChild(fullScreen);
			
			
			var clock = this.clock = new AppletClock({settings:{},pos:0.88});
			stb.addChild(clock);
					
			var theme = this.theme = new AppletTheme({settings:{},pos:0.65});
			stb.addChild(theme);

			this.mbc.addChild(stb);
			
			
			on(theme,"ChangeTheme",lang.hitch(this,function(theme){
					var scene = this.dsc.selectedChildWidget;
					this.changeTheme(scene,theme);
					this.applyTheme(theme);
					this.resize();
				})
			);	
			

			topic.subscribe("/qface/ui/window/Window/full",lang.hitch(this,function(win,isFull){
					if (isFull) {
						this.fullSceneed(win);
					} else {
						this.unFullSceneed(win);
					}	
				})
			);

			topic.subscribe("/qface/scene/show",lang.hitch(this,function(scene){
					var theme = scene.get("theme");
				 	this.theme.updateTheme(theme);
					this.applyTheme(theme);
					
				})
			);
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


	return _DemoDesktop;
});
