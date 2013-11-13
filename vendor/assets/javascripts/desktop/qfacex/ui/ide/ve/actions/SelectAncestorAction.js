define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/_SelectAncestorAction",
    	"dojo/i18n!qfacex/ui/ide/ve/nls/ve"
], function(declare, _SelectAncestorAction, langObj){

return declare( [_SelectAncestorAction], {

	run: function(context){
		workbench = this._workbench;
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		if(this.selectionSameParentNotBody(selection)){
			var ancestors = [];
			var ancestor = selection[0].getParent();
			while(ancestor.domNode.tagName != 'BODY'){
				ancestors.push(ancestor);
				ancestor = ancestor.getParent();
			}
			var formHtml = 
				'<div class="SelectAncestorLabel">'+langObj.selectAncestorLabel+'</div>'+
				'<select dojoType="dijit.form.Select" id="SelectAncestor" name="SelectAncestor" style="width:12em;">'+
				'<option value="-1"></option>';
			for(var i=0; i<ancestors.length; i++){
				var label = require("qfacex/ui/ide/ve/widget").getLabel(ancestors[i]);
				formHtml += '<option value="'+i+'">'+label+'</option>';
			}
			formHtml += '</select><br/>';

			var dialog = workbench.showMessage(langObj.selectAncestorTitle, formHtml);

			var selWidget = dijit.byId('SelectAncestor');
			selWidget._selectAncestor = this._selectAncestor;
			dojo.connect(selWidget, "onChange", function(ancestor){
				context.select(ancestors[ancestor]);
			});	
		}
	},

	isEnabled: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection());
		return this.selectionSameParentNotBody(selection);
	}

});
});
