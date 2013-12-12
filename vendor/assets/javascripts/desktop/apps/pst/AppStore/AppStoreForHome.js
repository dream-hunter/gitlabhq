define([
	"dojo/on",
	"dojo/json",
	"dojo/dom-construct",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/query",
	"dojo/hash",
	"dojo/io-query",
	"dojo/topic",
	"dojo/i18n!./nls/AppStore",
	"./AppStore"
	],function(on,JSON,domConstruct,declare,array,lang,connect,event,domStyle,domClass,query,hash,ioQuery,topic,nlsApp,AppStore){
	return declare(AppStore, {
		needHash: true,

		init: function(args){
      this.inherited(arguments);
		},

		_addChildCssLink: function(){
			this.__addCss("apps/pst/AppStore/resources/stylesheets/AppWidget.css");
      // this.__addCss("apps/pst/AppStore/resources/stylesheets/app.css");
		}
	});
});

