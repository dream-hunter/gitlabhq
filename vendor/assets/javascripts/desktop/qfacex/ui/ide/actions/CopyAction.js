define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/actions/Action"
], function(declare, Action){

return declare( Action, {
	
	run: function(selection){
		  thiw._workbench.clipboard=selection;
	},
	
	isEnabled: function(selection){
		return selection.length>0;
	}
});
});
