define( [
		"require",
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/RemoveCommand",
    	"qfacex/ui/ide/ve/widget"
], function(require,declare,ContextAction, CompoundCommand, RemoveCommand, Widget){


return declare([ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		var workbench = this._workbench;
		if(context){
		    if (context.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")) && context._displayMode=="source")
		    {
		    	this._invokeSourceEditorAction(context);
		    	return;
		    }
			var selection = this._normalizeSelection(context);
			if(selection.length > 0){
				var command = new CompoundCommand();
				var data = [];
				var reorderedSelection = context.reorderPreserveSiblingOrder(selection);
				dojo.forEach(reorderedSelection, function(w){
					var d = w.getData( {identify: false});
					if(d){
						data.push(d);
					}
					var helper = w.getHelper();
					var c;
					if(helper && helper.getRemoveCommand) {
						c = helper.getRemoveCommand(w);
						
						// Look for associated widgets in compound command (for things like
						// grids, trees, etc.) and add that as a special field to the widget
						// data.
						if (c.name === "compound") {
							// Let's loop (backwards) through the sub commands and 
							// get the data for the widgets being deleted (skipping the
							// very last one which by convention should be the widget
							// itself).
							var associatedCopiedWidgetData = [];
							var commands = c._commands;
							for (var i = commands.length - 1; i > 0; i--) {
								var subCommand = commands[i];
								if (subCommand.name === "remove") {
									var subCommandWidget = Widget.byId(subCommand._id);
									var subCommandWidgetData = subCommandWidget.getData( {identify: false});
									associatedCopiedWidgetData.push(subCommandWidgetData);
								}
							}
							d.associatedCopiedWidgetData = associatedCopiedWidgetData;
						}
						
					} else {
						c = new RemoveCommand(w);
					}
					command.add(c /*new RemoveCommand(w)*/);
				});

				// Execute the copy or paste action (delegated to subclass)
				this._executeAction(context, selection, data, command);
			}
		}
	},

	isEnabled: function(context){
		var workbench = this._workbench;
		context = this.fixupContext(context);
		var e = workbench.getOpenEditor();
		if (e && context) {
			var anySelection = (context.getSelection().length > 0);
			if(e.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor"))){
				var displayMode = e.getDisplayMode();
				return anySelection && displayMode != 'source';
			}else{
				return anySelection;
			}
		}else{
			return false;
		}
	},

	shouldShow: function(context){
		context = this.fixupContext(context);
		var editor = context ? context.editor : null;
		return (editor && editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")));
	},
	
	_invokeSourceEditorAction: function(context) {
		// Subclass should overrride
	},
	
	_executeAction: function(context, selection, data, removeCommand) {
		// Subclass should overrride
	}
});
});
