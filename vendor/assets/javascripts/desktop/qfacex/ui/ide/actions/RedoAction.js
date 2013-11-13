define( [
	"require",
	"dojo/_base/declare",
	"qfacex/ui/ide/actions/Action"
], function(require,declare, Action){

return declare( Action, {

	run: function(selection){
		var e = this._workbench.getOpenEditor();
		if (e && e.getContext) {
			e.getContext().getCommandStack().redo();
		}
	},
	
	isEnabled: function(selection){
		var e = this._workbench.getOpenEditor();
		var context = e && e.getContext && e.getContext();
		if (e && context) {
			var canRedo = context.getCommandStack().canRedo();
			var PageEditorClass = require("qfacex/ui/ide/ve/PageEditor");
			if(e && e.isInstanceOf && PageEditorClass && e.isInstanceOf(PageEditorClass)){
				var displayMode = e.getDisplayMode();
				return canRedo && displayMode != 'source';
			}else{
				return canRedo;
			}
		} else {
			return false;
		}
	}
});
});
