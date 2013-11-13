define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/_SelectAncestorAction"
], function(declare, _SelectAncestorAction){

return declare([_SelectAncestorAction], {

	run: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		if(this.selectionSameParentNotBody(selection)){
			context.select(selection[0].getParent());
		}
	},

	isEnabled: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		return this.selectionSameParentNotBody(selection);
	}

});
});
