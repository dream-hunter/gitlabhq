define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction",
    	"dojo/i18n!qfacex/ui/ide/ve/nls/ve"
], function(declare, ContextAction, veNls){


return declare( [ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		if(context && context.editor && context.editor.switchDisplayModeSourceLatest){
			editor = context.editor;
			editor.switchDisplayModeSourceLatest();
		}
	},
	
	updateStyling: function(){
		var editor = this._workbench.getOpenEditor();
		if(editor && editor.getDisplayMode){
			var displayMode = editor.getDisplayMode();
			var sourceDisplayMode = editor.getSourceDisplayMode();
			var sourceComboButtonNode = dojo.query('.maqSourceComboButton')[0];
			if(sourceComboButtonNode){
				var sourceComboButton = dijit.byNode(sourceComboButtonNode);
				if(sourceComboButton){
					sourceComboButton.set('label', veNls['SourceComboButton-'+sourceDisplayMode]);
				}
				if (displayMode=="design") {
					dojo.removeClass(sourceComboButtonNode, 'maqLabelButtonSelected');
				}else{
					dojo.addClass(sourceComboButtonNode, 'maqLabelButtonSelected');
				}
			}
		}
	}

});
});
