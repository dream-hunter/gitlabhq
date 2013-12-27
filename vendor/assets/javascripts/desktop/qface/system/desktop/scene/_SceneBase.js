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
	"dojo/dom-class",
  "dojo/topic",
	"dojo/_base/lang",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_Container",
	"dijit/layout/_LayoutWidget",
	"dijit/layout/StackContainer",
	"qface/utils/logger",
 	"dojo/text!./templates/_sceneBase.html"
	],function(dojo,domClass,topic,lang,_Widget,_TemplatedMixin,_Container,_LayoutWidget,StackContainer,logger,template) {
	var _SceneBase = dojo.declare([_LayoutWidget,_TemplatedMixin],{
 		templateString:template,
		//	summary:
		//		Contains all the app functions of the scene
		//	appList: Array,
		//		Contains a list of each app's information (loaded on startup)
		appList: [],
		//	instances: Array
		//		Contains each instance of all apps
		instances: [],
		//	instanceCount: Int
		//		A counter for making new instances of apps
		instanceCount: 0,
		//  currentApp: String
		//      the current application that is running
		currentApp: "",
		// isScene : Boolean
		isScene : true,
		// scene name
		name:null,
		// current desktop
		desktop:null,

		_getThemeAttr : function() {
			return this._theme;
		},

		_setThemeAttr : function(theme) {
			if (theme) {
				theme = theme.toLowerCase();
			}
			if (this._theme != theme) {
				var oldTheme = this._theme;
				if (!oldTheme) {
					domClass.add(this.domNode,theme);
				} else {
					domClass.replace(this.domNode,theme,oldTheme);
				}
				this._theme = theme;
			}
		},

    init: function(){

    },

		launch: function(/*String*/sysname, /*String*/name,/*Object?*/args, /*Function?*/onComplete, /*Function?*/onError){
			//	summary:
			//		Fetches an app if it's not in the cache, then launches it. Returns the process ID of the application.
			//	name:
			//		the app's name
			//	args:
			//		the arguments to be passed to the app
			//	onComplete:
			//		a callback once the app has initiated
			//	onError:
			//    if there was a problem launching the app, this will be called
			topic.publish("/qface/system/desktop/scene/launchApp", [this,sysname,name]);
			logger.log("launching app "+name);
        var d = new dojo.Deferred();
        if(onComplete) d.addCallback(onComplete);
        if(onError) d.addErrback(onError);
        
        var path = "apps/"+sysname.replace(/[.]/g, "/");
				require([path],lang.hitch(this,function(Application){
				var pid = false;
				try {
					pid = this.instances.length;
					var realName = "";
					var icon = "";
					var compatible = "";
					var instance = this.instances[pid] = new Application({
						args: args,
						scene: this
					});
					try {
						instance.init(args||{});

						// customize app css
						if(args && args["loadCssPath"]) this.desktop.addDojoCss(dojo.moduleUrl(path,args["loadCssPath"]));
					
					}
					catch(e){
						topic.publish("/qface/system/desktop/scene/launchAppEnd", [this,sysname,name,false]);
						console.error(e);
						d.errback(e);
						throw e;
						return;
					}
					instance.status = "active";
				}
				catch(e){
		      		topic.publish("/qface/system/desktop/scene/launchAppEnd", [this,sysname,name,false]);
					console.error(e.stack || e);
		        	d.errback(e);
		        	return;
		      		throw e;
				}
				d.callback(instance);
		        topic.publish("/qface/system/desktop/scene/launchAppEnd", [this,sysname,name,true]);
			}));
		},

		launchSystemApp: function(/*string*/appName,/*obj*/args){
			var path = "tools/" + appName + "/App";
	      	require([path],dojo.hitch(this,function(Application){
	      		var app = new Application({
	      			args: args,
	      			scene: this
	      		});
	      		app.init(args||{});
				if(args && args["loadCss"]) this.desktop.addDojoCss(dojo.moduleUrl(path,"../resources/app.css"));
			}));
		},

		//PROCESS MANAGEMENT FUNCTIONS
		getInstances: function(){
			//	summary:
			//		Returns an array of the current valid instances
			returnObject = [];
			for(var x = 0; x<this.instances.length; x++){
				if (this.instances[x] != 'null'){
					try { if(typeof this.instances[x].status == "string")
						returnObject.push(this.instances[x]);
					} catch(e){ }
				}
			}
			return returnObject;
		},
		
		getInstancesStatus: function(){
			//	summary:
			//		Returns an array of the current valid instances status
			var returnObject = [];
			for(var x = 0; x<this.instances.length; x++){
					if (this.instances[x] != null){
						var i = this.instances[x];
						returnObject.push({
							instance: x,
							status: i.status,
							sysname: i.sysname,
							name: i.name,
							version: i.version
						});
					}
			}
			return returnObject;
		},
		getInstance: function(/*Integer*/instance){
			//	summary:
			//		Returns an instance
			//	instance:
			//		the instance ID to fetch
			return this.instances[instance];
		},
		kill: function(/*Integer*/instance){
			//	summary:
			//		Kills an instance
			//	instance:
			//		the instance ID to kill
			try {
				logger.log("procSystem: killing instance "+instance);
				this.instances[instance].kill();	//Pre-Kill the instance
				return true;
			}
			catch(err){
				logger.log("procSystem: killing instance "+instance+" failed. setting status to zombie.");
				console.error(err);
				this.instances[instance].status = "zombie";
				return false;
			}
		},
		
		resize: function(){
			dojo.forEach(this.getChildren(), function(item){
				item.resize();
			});
		},
		
		run : function(){
			this.startup();
		},
		
		hide: function(){
		},
		
		show: function(){
		},
		
		lauchApp  : function() {
		},
		
		killApp   : function() {
		},
		addWindow : function(win,args){
		},
		removeWindow : function(win,item){
		},
		updateWindowTitle : function(item,title){
		},
		getBox : function(){
		},
		restrictWindow : function(win){
		}
		
	});

	return _SceneBase;
	
});

