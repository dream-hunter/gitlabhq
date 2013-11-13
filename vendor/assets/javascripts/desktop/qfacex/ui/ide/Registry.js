define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
    "qfacex/ui/workbench/Registry",
	 "openstar/services/user",
	"qfacex/ui/ide/commands/CommandStack",
	"qfacex/ui/ide/ve/metadata",
	"qfacex/ui/ide/ui.plugin",
	"qfacex/ui/ide/html/html.plugin",
	"qfacex/ui/ide/js/js.plugin",
	"qfacex/ui/ide/ve/ve.plugin"
], function(
	declare,
	Deferred,
	QxRegistry,
	srvUser,
	CommandStack,
	metadata,
	ui_plugin,
	html_plugin,
	js_plugin,
	ve_plugin,
	themeEditor_plugin
) {

	// list of plugins to load
	var plugins = [
		ui_plugin,
		html_plugin,
		js_plugin,
		ve_plugin
	];

	var Registry  = declare(QxRegistry, {
		
		init : function() {
			var deferred = new Deferred();
			this.loadPlugins(plugins);
			this.metadata = metadata;
			this.metadata.init().then(function(){
				deferred.resolve();
			},function(e){
				deferred.reject(e);
			});
			return deferred;
		}
	});

	return Registry;
});
