define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/_CutCopyAction",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/RemoveCommand"
], function(declare, _CutCopyAction, CompoundCommand, RemoveCommand){


return declare( [_CutCopyAction], {

	_invokeSourceEditorAction: function(context) {
		context.htmlEditor.copyAction.run();
	},
	
	_executeAction: function(context, selection, data, removeCommand) {
		var oldData = this._workbench.clipboard;
		this._workbench.clipboard=data;
		if(!oldData){
			context.onSelectionChange(selection); // force to enable Paste action
		}
	}
});
});
