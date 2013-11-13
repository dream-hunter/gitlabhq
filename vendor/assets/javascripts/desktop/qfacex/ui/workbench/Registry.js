define([
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(declare,lang) {


	var Registry  = declare(null, {
	/*
		plugins: [],
		extensionPoints: [],
		subscriptions: [],
		currentSelection: [],
		commandStack: new CommandStack(),
	*/	
		
		constructor : function() {
			this.plugins = [];
			this.extensionPoints = [];
			this.subscriptions = [];
		},
		
		addPlugin: function(pluginName) {
			url = pluginName + ".plugin";
			dojo.xhrGet( {
				// The following URL must match that used to test
				// the server.
				url:url,
				handleAs:"json",
				sync:true,
				load: function(responseObject, ioArgs) {
					this._loadPlugin(responseObject,url);
				}
			});
		},

		loadPlugins: function(plugins) {
			plugins.forEach(lang.hitch(this,function(plugin) {
				var pluginID = plugin.id;
				this.plugins[pluginID] = plugin;
				for (var id in plugin) {
					var extension = plugin[id];
					if (typeof extension != "string") {
						if (extension instanceof Array) {
							extension.forEach(lang.hitch(this,function(ext) {
								this._addExtension(id, ext, pluginID);
							}));
						} else {
							this._addExtension(id, extension, pluginID);
						}
					}
				}
			}));
		},
		
		subscribe: function(topic,func) {
			this.subscriptions.push(dojo.subscribe(topic,this,func));
		},
		
		destroy: function() {
			dojo.forEach(this.subscriptions, dojo.unsubscribe);
		},
		
		_addExtension: function(id, extension, pluginID) {
			if (extension.id && extension.id.indexOf(pluginID)!=0) {
				extension.id = pluginID + "." + extension.id;
			}

			this.extensionPoints[id] = this.extensionPoints[id] || [];
			var extensions = this.extensionPoints[id];
			extensions.push(extension);
			this.extensionPoints[id] = extensions;
		},
		
		getExtensions: function(extensionID, testFunction) {
			
			var extensions = this.extensionPoints[extensionID];
			if (testFunction) {
				var matching=[];
				var isFunction = testFunction instanceof Function;
				if (extensions) {
					return extensions.filter(function(ext) {
						return (isFunction && testFunction(ext)) || ext.id == testFunction;
					});
				}
			}
			return extensions;
		},
		
		getExtension: function(extensionID, testFunction) {
			return this.getExtensions(extensionID, testFunction)[0];
		},
		
		init : function() {
		}
	});

	return Registry;
});
