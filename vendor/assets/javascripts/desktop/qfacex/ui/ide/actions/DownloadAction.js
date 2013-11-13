define( [
        "dojo/_base/declare",
    	"qfacex/ui/ide/actions/Action",
    	"qfacex/ui/ide/ui/DownloadSelected",
    	"qfacex/ui/ide/ui/Resource",
    	"dojo/i18n!qfacex/ui/ide/ui/nls/ui",
    	"dojo/i18n!./nls/actions",
    	"dijit/form/ValidationTextBox"
], function(declare, Action, DownloadSelected, uiResource, langObj){

return declare( Action, {

	run: function() {
		this._workbench.showModal(new DownloadSelected({workbench:this._workbench}), langObj.downloadFile, {width: "400px"});
	},
	
	isEnabled: function(selection){
		var files = uiResource.getSelectedResources(this._workbench);
		return files && files.length>0;
	}
});
});
