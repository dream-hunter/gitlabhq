define([
	"require",
	"dojo/_base/declare",
	"qfacex/ui/ide/ve/actions/ContextAction"
], function(require,declare, ContextAction){

return declare([ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		if(context){
			if (context.isInstanceOf(require("qfacex/ui/ide/ve/Context"))){
				return;
			}
			var selection = context.getSelection();
			if(selection.length !== 1){
				return;
			}
			context.select(selection[0], false, true);
		}
	},

	/**
	 * Enable this command if this command would actually make a change to the document.
	 * Otherwise, disable.
	 */
	isEnabled: function(context){
		context = this.fixupContext(context);
		return (context && context.getSelection().length > 0);
	},

	shouldShow: function(context){
		context = this.fixupContext(context);
		var editor = context ? context.editor : null;
		return (editor && editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")));
	}
});
});
