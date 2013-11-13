
define([
	"dojo/_base/declare",
	"qfacex/widgets/WidgetLite",
	"qfacex/ui/workbench/WorkbenchPart",
	"dijit/Menu",
	"dijit/MenuItem",
	"qface/lang/Path",
    "qface/services/ofs/FileSystem",
	"dijit/form/DropDownButton",
	"dojo/i18n!qfacex/ui/ide/ui/nls/ui",
	"dojo/i18n!dijit/nls/common",
	"dojo/text!./templates/NewFolder.html",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/RadioButton"

],function(declare,WidgetLite, WorkbenchPart, Menu, MenuItem, Path,FileSystem, DropDownButton, uiNLS, commonNLS, templateString){

	return declare( [WidgetLite,WorkbenchPart], {
	
		widgetsInTemplate: true,
		templateString: templateString,
		folderName : null,
		fileDialogParentFolder: null,
	
		okButton : null,
		uiNLS: uiNLS,
		
		postMixInProperties : function() {
			this.inherited(arguments);
		},
		postCreate : function(){
			this.inherited(arguments);
			dojo.connect(this.folderName, "onkeyup", this, '_checkValid');
			/* set a default value */
			if(!this._value){
				this._setRootAttr(this._getRootAttr());
			}

			this.okButton.onClick = dojo.hitch(this, this._okButton);
		},
		
		
		_setValueAttr : function(value){
			/* full resource expected */
			if(value==this._value) return;
			this._value = value;
			var parentFolder = "";
			if(value && value.elementType=="Folder"){
				this.fileDialogParentFolder.innerHTML = value.getName();
			}else if(value){
				this.fileDialogParentFolder.innerHTML = value.parent.getPath();
			}
			
			
		},
		
		_setNewFileNameAttr : function(name){
			this.folderName.set( 'value', name);
		},
	
		_getRootAttr : function(){
			if (!this._root) {
				this._root = FileSystem.getRootFolder();
			}

			return this._root;
			
		},
		
		_setRootAttr : function(value){
			
			this._root=value;
			this.fileDialogParentFolder.innerHTML = value.getPath();
			
		},
		_checkValid : function(){
			
			// make sure the project name is OK.
			var name = this.folderName.get( "value");
			var valid = name!=null && name.length > 0;
			this._okButton.set( 'disabled', !valid);
		},
		_okButton : function(){
			this.value = this.fileDialogParentFolder.innerHTML + "/" + this.folderName.get( 'value');		

			var check = this.checkFileName(this._workbench,this.value);
			if (check) {
				return true
			} else {
				return false;
			}
		},
		
		_getValueAttr : function(){
			this.value = this.fileDialogParentFolder.innerHTML + "/" + this.folderName.get( 'value');
			return this.value;
		},
		
		_cancelButton: function(){
			this.onClose();
		},
		
		_createResource : function(){
			var resource = this._workbench.getUserWorkspace().findSync(this.fileDialogParentFolder.innerHTML + "/" + this.folderName.get( 'value'));
			if(resource) return resource;
			var folder = this._workbench.getUserWorkspace().findSync(this.fileDialogParentFolder.innerHTML);
			return folder.createResource(this.folderName.get( 'value'));
		},
		onClose : function(){}
	
	
	});
});
