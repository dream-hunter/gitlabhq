define([
	"dojo/_base/declare", // lang.trim
	"dojo/_base/lang", // lang.trim
	"dojo/_base/array", // lang.trim
	"dojo/dom-class",
	"dojo/Deferred",
	"dojo/DeferredList",
	"dojo/on",
	"dojo/query",
	"qfacex/widgets/layout/BorderContainer",
	"qface/system/desktop/scene/_MultiSceneContainer",
	"qface/lang/Enum",
	"qface/windows/_patches"
],function(declare,lang,array,domClass,Deferred,DeferredList,on,query,BorderContainer,_MultiSceneContainer,Enum){
	var _Desktop = declare(null,{
		sceneList: [],
		fileList: ["dijit", "dojox","theme", "window", "icons"],
		_config	: null,
		_loadedThemes : null,
		
		constructor : function(config) {
			this._config = config;
			this._loadedThemes = [];
			this._termMode = _Desktop.TermMode.PC;
		},
		
		_createHost : function(){
			var mainBorder = this.mainBorder = new BorderContainer({
				design: "headline",
				gutters: false,
				liveSplitters: false,
				style:"width:100%;height:100%;"
			});
			//domClass.add(mainBorder.domNode,"dijit soria tundra tsunami");		
			document.body.appendChild(mainBorder.domNode);
			mainBorder.startup();
		},
		
		_createSystemToolBar : function() {
		},
		
		_createSceneContainer : function() {
			var sceneContainer = this.sceneContainer = new _MultiSceneContainer({
				region:'center',
				controllerWidget: "dijit.layout.StackController",
				style:"width:100%"
			});
			this.mainBorder.addChild(sceneContainer);
			return sceneContainer;
		},
		
		init : function(config) {
			this._config = config;
			var deferred = new Deferred();
			var deferredHost = new Deferred();
			this._createHost();
			dojo.dnd.autoScroll = function(e){} //in order to prevent autoscrolling of the window
			on(window,"resize",lang.hitch(this,this.resize));
			
			var html =  dojo.doc.documentElement;
			var termClass = this._termMode == _Desktop.TermMode.PC?"pc":"mobile";
			domClass.add(html,termClass);
			
			deferredHost.then(lang.hitch(this,function(){
				var sceneContainer  = this._createSceneContainer();
				this._createSystemToolBar();
				
				var config = this._config;
				var defers = [];

				if (config.scenes) {
					var self = this;
					Object.keys(config.scenes).forEach(function(sceneName){
						var deferredScene = new Deferred();
						var sceneConfig = config.scenes[sceneName];
						defers.push(deferredScene);
						var sceneTheme = sceneConfig.theme;
						require([sceneConfig.type],function(Scene){
							var scene = new Scene({name:sceneName,theme:sceneTheme,desktop:self});
							self.addScene(scene);
							scene.init(sceneConfig);
							deferredScene.resolve();
						});
					});
				} else {
					throw new Error("invalid config!");
				}
				var sceneDeferredList = new DeferredList(defers);
				sceneDeferredList.then(function() {
					deferred.resolve();
				});
			}));
			deferredHost.resolve();
			return deferred;
		},
		
		
		start : function() {
			
		},
		
		addScene : function(scene) {
			this.sceneContainer.addChild(scene);
			this.sceneList.push(scene);
		},
		
		findScene: function(name){
			return array.filter(this.sceneList,function(item){return item.name === name;})[0];
		},
		
		resize : function () {
			if(this.mainBorder){this.mainBorder.resize();}
		},

		log : function(/*String*/str){
			//	summary:
			//		logs a string onto any console that is open
			//	
			//	str:
			//		the string to log onto the consoles
			str = dojo.toJson(str);
			query(".consoleoutput").forEach(function(elem){
				elem.innerHTML += "<div>"+str+"</div>";
			});
			console.log(str);
		},
		
		getTermMode : function() {
			return this._termMode;
		},
		
		changeTermMode : function(termMode) {
			if (termMode && termMode.isInstanceOf(_Desktop.TermMode) && termMode != this._termMode) {
				this._termMode = termMode;
				var oldtmClass = termMode == _Desktop.TermMode.PC ? "mobile":"pc";
				var newtmClass = termMode == _Desktop.TermMode.PC ? "pc":"mobile";
				var html =  dojo.doc.documentElement;
				domClass.replace(html,newtmClass,oldtmClass);
			}
		},
		
		addDojoCss : function(/*String*/path){
			//	summary:
			//		Adds an additional dojo CSS file (useful for the dojox modules)
			//
			//	path:
			//		the path to the css file (the path to dojo is placed in front)
			//	
			//	example:
			//	|	api.addDojoCss("/dojox/widget/somewidget/foo.css");
			var cssUrl =  require.toUrl(path);
			var element = document.createElement("link");
			element.rel = "stylesheet";
			element.type = "text/css";
			element.media = "screen";
			element.href = cssUrl;
			document.getElementsByTagName("head")[0].appendChild(element);
    },
    
		addDojoJs : function(/*String*/path){
			var jsUrl =  require.toUrl(path);
			var jsElement = document.createElement("script");
			jsElement.type =  "text/javascript";
			jsElement.src = jsUrl;
			document.getElementsByTagName("head")[0].appendChild(jsElement);
		},

		getTheme: function(scene) {
			return scene.get("theme");
		},
			
		changeTheme: function(scene,/*String*/theme)	{
			this.enableTheme(theme).then(function(){
				scene.set("theme",theme);
			});
		},
		
		enableTheme: function(/*String|Array*/theme)	{
			var themes;
			if(lang.isString(theme)) {
				themes = [theme];
			} else if (lang.isArray(theme)){
				themes = theme;
			}
			var deferred = new Deferred();
			
			if (!themes) {
				themes = array.filter(themes,function(item,index,array){
					return (this._loadedThemes.indexOf(theme)<0);
				},this);
			}
			if (!themes || themes.length===0) {
				deferred.resolve();
				return deferred;
			}
			
			var defers=[];

			array.forEach(themes,function(theme) {
				array.forEach(this.fileList, function(e){
					var linkId = "qface_theme_"+theme+"_"+e;
					if (document.getElementById(linkId)) {return;}
					var deferredCss = new Deferred();
					defers.push(deferredCss);

					var element = document.createElement("link");
					element.rel = "stylesheet";
					element.type = "text/css";
					element.media = "screen";
					element.href = dojo.moduleUrl("res.qfacex.themes."+theme, e+".css");
					element.id = linkId;
					document.getElementsByTagName("head")[0].appendChild(element);
					element.onload = function() {
						deferredCss.resolve();
					};
					element.onerror = function() {
						deferredCss.cancel();
					};
				});
				this._loadedThemes.push(theme);
			},this);
				
			var cssDeferredList = new DeferredList(defers);
			cssDeferredList.then(function() {
				deferred.resolve();
			},function(){
				deferred.cancel();
			});
			return deferred;
		},

		disableTheme: function(/*String*/theme)	{
			
		},
		
		applyTheme : function(theme) {
			if (this._theme == theme) {return;}
			if (this._theme) {
				domClass.replace(document.body,theme,this._theme);
			} else {
				domClass.add(document.body,theme);
			}
			this._theme = theme;
		},

		listThemes : function() {
			var themes = [
				{ label: "soria", value : "soria" },
				{ label: "tsunami", value: "tsunami" },
				{ label: "tundra", value: "tundra" }
			];
			return themes;
		}
	});
	_Desktop.TermMode = Enum.declare(["PC","MOBILE"]);
	return _Desktop;
});
