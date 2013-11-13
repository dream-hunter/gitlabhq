define([
	"dojo/_base/declare",
	"qfacex/widgets/WidgetLite",
	"qfacex/ui/ide/ui/widgets/OpenFile",
	"qfacex/ui/workbench/WorkbenchPart",
	"dijit/form/Button",
	"qface/lang/Path",
	"dojo/i18n!qfacex/ui/ide/ui/nls/ui",
	"dojo/i18n!dijit/nls/common",
	"dojo/text!./templates/FileFieldDialog.html",
	"dijit/form/TextBox",
],function(declare, WidgetLite, OpenFile,WorkbenchPart, Button, Path,  uiNLS, commonNLS, templateString){
	
var idPrefix = "qfacex_ui_ide_ui_widgets_filefielddialog_generated";
var	__id=0;
var getId = function (){
	return idPrefix + (__id++);
};

return declare([WidgetLite,WorkbenchPart], {

	templateString: templateString,
	widgetsInTemplate: true,

	_fileSelectionDialog: null,

	_showFileSelectionDialog: function() {	
		//Set-up button
		var okClicked = function() {
			var tree = openDialog.fileTree
			if (tree.selectedItem) {
				var selectedItemPathStr = tree.selectedItem.getPath();
				/* only relativize the path if the user used the file chooser */
				var path=new Path(selectedItemPathStr);
				var value=path.relativeTo(new Path(this._baseLocation), true).toString(); // ignore the filename to get the correct path to the image
				this.textField.set("value", value);
				this._onChange();
			}
		};

		var openDialog = new OpenFile({finishButtonLabel: uiNLS.select});
		this.getWorkbench().showModal(openDialog, uiNLS.selectFile, {width: 275, height: 220}, dojo.hitch(this, okClicked), true);
	},
	
	_setBaseLocationAttr: function(baseLocation){
		// this is the directory to make everything relative to. also the first directory to show
		this._baseLocation = baseLocation;
	},
	
	_setValueAttr: function(value){
		 if(this.value!= value ){
			this.value = value;
			this.textField.set("value", value);
		 }
	},
	
	_setDisabledAttr: function(value){
		 this.textField.set("disabled", value);
		 this.button.set("disabled", value);
		 this.inherited(arguments);
	},
	
	_setIntermediateChangesAttr: function(value){
		 this.textField.set("intermediateChanges", value);
		 this.inherited(arguments);
	},
	
	_onChange: function(){	
		var value = this.textField.get("value");
		
		if(this.value!=value){			
			this.value = value;
			this.textField.set('value', this.value);
			this.onChange(value);
		}
	},
	
	onChange: function(event){},
	
	_getValueAttr: function(){
		return this.textField.get("value");	
	}
});
});
