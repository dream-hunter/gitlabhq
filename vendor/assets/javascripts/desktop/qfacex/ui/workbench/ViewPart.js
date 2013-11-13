define([
    "dojo/_base/declare",
	"qfacex/ui/workbench/_ToolbaredContainer",
	"qfacex/ui/workbench/WorkbenchPart"
], function(declare, ToolbaredContainer,WorkbenchPart) {

return declare([ToolbaredContainer,WorkbenchPart], {
		
	constructor: function(params, srcNodeRef){
    	this.viewExt=params.view;
	},
	
	startup: function()
	{
		this.inherited(arguments);
		this.domNode.view=this;
		if (this.viewExt.startup) {
			this.viewExt.startup();
		}
	},
	
	_getViewActions: function() {
		var viewID=this.toolbarID || this.viewExt.id;
		var viewActions=[];
		var extensions = this._workbench.registry.getExtensions('davinci.viewActions', function(ext){
			if (viewID==ext.viewContribution.targetID) {
				viewActions.push(ext.viewContribution);
				return true;
			}
		});
		return viewActions;
	}
});
});
