define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/_CutCopyAction",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/RemoveCommand",
    	"qfacex/ui/ide/ve/widget"
], function(declare, _CutCopyAction, CompoundCommand, RemoveCommand, Widget){


return declare([_CutCopyAction], {

	_invokeSourceEditorAction: function(context) {
		context.htmlEditor.cutAction.run();
	},
	
	_executeAction: function(context, selection, data, removeCommand) {
		this._workbench.clipboard=data;
		context.select(null);
		context.getCommandStack().execute(removeCommand);
	}
});
});
