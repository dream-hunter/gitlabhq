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
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/query",
	"dojo/data/ItemFileWriteStore",
	"qface/system/desktop/scene/_SceneBase",
	"qfacex/widgets/window/area/Area"
],function(lang,declare,arrayUtil,domConstruct,query,ItemFileWriteStore,_SceneBase,Area) {

	var Scene = declare([_SceneBase],{
		//	_windowList: dojo.data.ItemFileWriteStore
		//		A dojo.data.ItemFileWriteStore containing a list of windows
		_windowList: null,
		_winLists: null,
		app:null,
		//	_drawn: Boolean
		//		true after the UI has been drawn
		_drawn: false,

		constructor : function() {
			this._windowList = new ItemFileWriteStore({
				data: {identifer: "id", items: []}
			});
			this._winLists = [];
		},

		init: function(config){
			this._config = config;
			var area = this._area = new Area({});
			this.addChild(area);
			var app = config.app;
			this.launch(app.sysname,app.name,app.args||{});
		},

		launch: function(/*String*/sysname, /*String*/name,/*Object?*/args, /*Function?*/onComplete, /*Function?*/onError){
      var path = "apps/"+sysname.replace(/[.]/g, "/");
			require([path],lang.hitch(this,function(Application){
				var pid = false;
				pid = this.instances.length;
				var realName = "";
				var icon = "";
				var compatible = "";
				var instance = this.app = this.instances[pid] = new Application({
					args: args,
					scene: this
				});
				instance.init(args||{});
				// app full window
				// instance.win.expand();
				if(args && args["loadCssPath"]) this.desktop.addDojoCss(dojo.moduleUrl(path,args["loadCssPath"]));
			}));
		},

		addWindow : function(win,args){
			this._winLists.push(win);
			this._area.addChild(win);
			return this._windowList.newItem(args);
		},

		removeWindow : function(win,item){
			this._area.removeChild(win);
			this._windowList.deleteItem(item);
		},

		updateWindowTitle : function(item,title){
			this._windowList.setValue(item, "label", title);
		},

		getBox : function(){
			return this._area.getBox();
		},

		restrictWindow : function(win){
			win.maximized = false;
			win.showMinimize = false;
			win.showFull = false;
			win.showClose = false;
		}
	});
	return Scene;
});

