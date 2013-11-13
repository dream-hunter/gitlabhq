define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/actions/Action",
    	"qfacex/ui/ide/ve/metadata"
], function(declare, Action, Metadata){


return declare( [Action], {
	

	isEnabled: function(context){
		if(!context){
			return false;
		}
		var selection = context.getSelection();
		if(selection.length != 1){
			return false;
		}
		var widget = selection[0];
		if (Metadata.queryDescriptor(widget.type, "isLayered")) {
			return true;
		}else{
			return false;
		}
	}
});
});
