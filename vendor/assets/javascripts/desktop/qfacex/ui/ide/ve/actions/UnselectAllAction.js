define([
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction"
], function(declare, ContextAction){

return declare([ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		if(selection.length > 0){
			context.deselect();
		}
	},

	isEnabled: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		return (selection && selection.length > 0);
	}

});
});
