define( [
	"require",
	"dojo/_base/declare",
	"qfacex/ui/ide/actions/Action"
], function(require,declare, Action){

return declare( Action, {	
	run: function(selection){
		var e = this._workbench.getOpenEditor();
		if (e && e.getContext)
		//if (e.declaredClass == 'davinci.themeEditor.ThemeEditor') // this is a hack to only support undo for theme editor for 0.5
			e.getContext().getCommandStack().undo();
	//		davinci.Runtime.commandStack.undo();
	},
	
	isEnabled: function(selection){
		var e = this._workbench.getOpenEditor();
		var context = e && e.getContext && e.getContext();
		if (e && context) {
			var canUndo = context.getCommandStack().canUndo();
			if(e.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor"))){
				var displayMode = e.getDisplayMode();
				return canUndo && displayMode != 'source';
			}else{
				return canUndo;
			}
		} else {
			return false;
		}
	//	return (davinci.Runtime.commandStack.canUndo());
	}
});
});
