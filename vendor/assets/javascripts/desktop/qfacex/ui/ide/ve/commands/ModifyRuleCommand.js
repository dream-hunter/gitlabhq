define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/widget",
    	"qfacex/ui/ide/ve/States"
], function(declare, Widget, States){


return declare( null, {

	name: "modify rule",

	constructor: function(cssRule, values, context){
		this.cssRule = cssRule;
		this.values = values;
		this.context = context;
		this._workbench = this.context._workbench;
	},

	execute: function(context){
		if (!this.context){ // redo does not send a context, that is ok we should use the context from the first execute
			this.context = context;
		}
		if(!this.cssRule || !this.values || !this.context){
			return;
		}

		this._oldValues = this.cssRule.getProperties();		
		this.context.modifyRule( this.cssRule, this.values);
		var file = this.cssRule.getCSSFile();
		file.setDirty(true);
		this.context.editor.setDirty(true);
		// Recompute styling properties in case we aren't in Normal state
		States.resetState(this.context.rootNode);
		if (this.context._selection) {
			// force the style palette to update
			this.context._forceSelectionChange = true;
		}
	},

	undo: function(){
		if(!this.cssRule || !this._oldValues || !this.context){
			return;
		}

		this.context.ruleSetAllProperties(this.cssRule, this._oldValues);
		var file = this.cssRule.getCSSFile();
		file.setDirty(true);
		this.context.editor.setDirty(true);
		// Recompute styling properties in case we aren't in Normal state
		States.resetState(this.context.rootNode);
		if (this.context._selection) {
			// force the style palette to update
			this.context._forceSelectionChange = true;
		}
	}
});
});
