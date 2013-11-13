define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction"
], function(declare, ContextAction){


return declare( [ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		if(context && context.editor && context.editor.switchDisplayModeSplitHorizontal){
			context.editor.switchDisplayModeSplitHorizontal();
		}
	}
});
});
