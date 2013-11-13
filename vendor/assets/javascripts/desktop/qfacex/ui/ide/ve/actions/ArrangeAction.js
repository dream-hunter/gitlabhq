define([
	"require",
	"dojo/_base/declare",
	"qfacex/ui/ide/ve/actions/_ReorderAction",
	"qfacex/ui/ide/commands/CompoundCommand",
	"qfacex/ui/ide/ve/commands/ReparentCommand"
], function(require,declare, _ReorderAction, CompoundCommand, ReparentCommand){


return declare( [_ReorderAction], {
	
	run: function(context){
		// This is a dropdown button. Actions are only available on dropdown menu
	},

	/**
	 * Enable this command if this command would actually make a change to the document.
	 * Otherwise, disable.
	 */
	isEnabled: function(context){
		return true;
	},

	shouldShow: function(context){
		context = this.fixupContext(context);
		var editor = context ? context.editor : null;
		return (editor && editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")));
	}
});
});
