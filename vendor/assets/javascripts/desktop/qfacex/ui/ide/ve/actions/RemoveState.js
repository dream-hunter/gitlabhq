define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/ve/States",
	"qfacex/ui/ide/actions/Action"
], function(declare, States, Action){


return declare( [Action], {

	run: function(){
		var context;
		var workbench = this._workbench;
		if(workbench.currentEditor && workbench.currentEditor.currentEditor && workbench.currentEditor.currentEditor.context){
			context = workbench.currentEditor.currentEditor.context;
		}else{
			return;
		}
		var statesFocus = States.getFocus(context.rootNode);
		if(!statesFocus || !statesFocus.state || statesFocus.state === States.NORMAL){
			return;
		}
		var node = statesFocus.stateContainerNode;
		var state = state = States.getState(node);
		States.remove(node, state);
	}
});
});
