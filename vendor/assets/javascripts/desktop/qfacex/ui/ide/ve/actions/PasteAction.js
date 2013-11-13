define( [
	"require",
	"dojo/_base/declare",
	"qfacex/ui/ide/ve/actions/ContextAction",
	"qfacex/ui/ide/ve/tools/PasteTool"
], function(require,declare, ContextAction, PasteTool){


return declare([ContextAction], {

	shortcut: {keyCode: 86, ctrlKey: true}, // Ctrl+v

	run: function(context){
		var workbench = this._workbench;
		context = this.fixupContext(context);
		if(context){
			if (context.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")) && context._displayMode=="source")
			{
				context.htmlEditor.pasteAction.run();
				return;
			}
			var data = workbench.clipboard;
			if(data){
				context.setActiveTool(new PasteTool(data));
			}
		}
	},

	isEnabled: function(context){
		var workbench = this._workbench;
		context = this.fixupContext(context);
		var e = workbench.getOpenEditor();
		if (e && context) {
			if( e.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor"))){
				var displayMode = e.getDisplayMode();
				return workbench.clipboard && displayMode != 'source';
			}else{
				return workbench.clipboard;
			}
		}else{
			return false;
		}
	},

	shouldShow: function(context){
		context = this.fixupContext(context);
		var editor = context ? context.editor : null;
		return (editor && editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")));
	}
});
});
