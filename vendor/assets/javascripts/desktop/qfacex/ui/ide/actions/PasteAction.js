define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/actions/Action"
], function(declare, Action){

return declare( Action, {
	
	run: function(selection){	  
	},

	isEnabled: function(selection){
		return this._workbench.clipboard;
	}
});
});
