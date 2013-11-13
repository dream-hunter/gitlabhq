define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction"
], function(declare, ContextAction){


return declare([ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		if(context && context.editor && context.editor.switchDisplayModeDesign){
			context.editor.switchDisplayModeDesign();
		}
	},
	
	updateStyling: function(){
		var editor = this._workbench.getOpenEditor();
		if(editor && editor.getDisplayMode){
			var displayMode = editor.getDisplayMode();
			var designButtonNode = dojo.query('.maqDesignButton')[0];
			if(designButtonNode){
				if (displayMode=="design") {
					dojo.addClass(designButtonNode, 'maqLabelButtonSelected');
				}else{
					dojo.removeClass(designButtonNode, 'maqLabelButtonSelected');
				}
			}
		}
	}
});
});
