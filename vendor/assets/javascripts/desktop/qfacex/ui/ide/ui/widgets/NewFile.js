define( [
	"dojo/_base/declare",
	"dojo/_base/lang",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/form/DropDownButton",
    "qface/lang/Path",
    "qface/services/ofs/FileSystem",
	"qfacex/widgets/WidgetLite",
    "qfacex/ui/workbench/WorkbenchPart",
    "dojo/i18n!qfacex/ui/ide/ui/nls/ui",
    "dojo/i18n!dijit/nls/common",
    "dojo/text!./templates/NewFile.html"

],function(declare,lang, Menu, MenuItem,DropDownButton,Path,FileSystem,WidgetLite, WorkbenchPart,  uiNLS, commonNLS, templateString){
	return declare([WidgetLite,WorkbenchPart], {
		widgetsInTemplate: true,
		templateString: templateString,
		treeCollapsed:true,
	
		fileDialogFileName : null,
		fileTree : null,
		__okButton : null,
		dialogSpecificClass : null,
		_fileDialog : null,
		
		postMixInProperties : function() {
			var langObj = this.langObj = uiNLS;
			var dijitLangObj = commonNLS;
			dojo.mixin(this, langObj);
			dojo.mixin(this, dijitLangObj);
			
			this.getIconClass = lang.hitch(this._workbench,this._workbench.getResourceIcon);
			this.getRowClass = lang.hitch(this._workbench,this._workbench.getResourceClass);
			this.inherited(arguments);
		},
		
		postCreate : function(){
			this.inherited(arguments);

			this.arrowNode = this.fileDialogDetailsArrow;
			
			this._tree_collapse_expand();
			var t = this;

			if(this.dialogSpecificClass){
				require([this.dialogSpecificClass],function(c){
					t.dialogSpecificWidget = new c(
							{dialogSpecificButtonsSpan:t.dialogSpecificButtonsSpan, dialogSpecificClassOptions:this.dialogSpecificClassOptions}, 
							t.dialogSpecificOptionsDiv);
				}.bind(this));	
			}

			this._whereMenu = new Menu({style: "display: none;"});
			this._whereDropDownButton = new DropDownButton({
				className: "whereDropDown",
				dropDown: this._whereMenu,
				iconClass: "fileDialogWhereIcon"
			});

			this.fileDialogWhereDropDownCell.appendChild(this._whereDropDownButton.domNode);
			if(!this.value){
				this._setValueAttr(this._getForcedRootAttr());
			}
			
			this.connect(this.arrowNode, 'onclick', dojo.hitch(this,function(e){
				this._tree_collapse_expand(!this.treeCollapsed);
			}));
			dojo.connect(this.fileDialogFileName, "onkeyup", this, '_checkValid');
			this.fileTree.watch("selectedItem", dojo.hitch(this, this._updateFields));

			/* set initial value */
			
			this.fileTree.watch("selectedItem", dojo.hitch(this, this._checkValid));
                                                             
			this._updateFields();

			this.__okButton.onClick = dojo.hitch(this, this._okButton);

			// optionalMessage
			if (this.optionalMessage) {
				this.additionalMessage.innerHTML = this.optionalMessage;
				this.additionalMessage.style.display = "block";
			}
		},
		
		startup: function(){
			if(this.dialogSpecificWidget && this.dialogSpecificWidget.startup){
				this.dialogSpecificWidget.startup();
			}
		},
	
		/**
		 * Update this.collapsed to the given value and add/remove classes in DOM tree
		 * @param {boolean} treeCollapsed  New value for treeCollapsed
		 */
		_tree_collapse_expand: function(treeCollapsed){
			if(typeof treeCollapsed != 'undefined'){
				this.treeCollapsed = treeCollapsed;
			}
			var table = dojo.query('.fileFolderTable',this.domNode)[0];
			var folderContainer = dojo.query('.folderContainer',this.domNode)[0];
			var showSpan = dojo.query('.folder_details_show_arrow',this.domNode)[0];
			var hideSpan = dojo.query('.folder_details_hide_arrow',this.domNode)[0];
			if(table){
				if(this.treeCollapsed){
					dojo.addClass(table, 'treeCollapsed');
					dojo.removeClass(table, 'treeExpanded');
					dojo.addClass(folderContainer, 'dijitHidden');
					dojo.removeClass(showSpan, 'dijitHidden');
					dojo.addClass(hideSpan, 'dijitHidden');
				}else{
					dojo.addClass(table, 'treeExpanded');
					dojo.removeClass(table, 'treeCollapsed');
					dojo.removeClass(folderContainer, 'dijitHidden');
					dojo.addClass(showSpan, 'dijitHidden');
					dojo.removeClass(hideSpan, 'dijitHidden');
				}
			}
			this.fileDialogDetailsArrow.title = this.treeCollapsed ? this.langObj.newFileShowFiles : this.langObj.newFileHideFiles;
		},	
		
		_setValueAttr: function(value){
			/* full resource expected */
			if (value==this._value) {
				return;
			}
			this._value = value;
			var path = [],i=value;
			do {
				path.unshift(i);
				i = i.getParent();
			} while(i);
			return this.fileTree.set("path", path);
		},
		
		_setNewFileNameAttr: function(name){
			this.fileDialogFileName.set('value', name);
		},
		
		_getForcedRootAttr: function(){
			if (!this._forcedRoot) {
				this._forcedRoot = FileSystem.getRootFolder();
			}

			return this._forcedRoot;
		},
		
		_setForcedRootAttr : function(value){
			this._forcedRoot = value;
		},
		
		_updateFields : function(){
			
			var resources = this.fileTree.get('selectedItems');
			var resource = (resources!=null && resources.length > 0)? resources[0] : null;
			var folderResource;
			var rootPathString = this._getForcedRootAttr().getPath();
			if(resource==null){
				folderResource = this._getForcedRootAttr();
			}else if(resource.elementType=="Folder"){
				folderResource = resource;
			}else{
				this.fileDialogFileName.set( 'value', resource.getName());
				folderResource = resource.parent;
			}
			if(this._whereDropDownButton && this._whereMenu){
				var folderPathString = folderResource.getPath(); 
				var folderNameString = folderResource.getName();
				var whereValue = (folderPathString == rootPathString)? this.langObj.root : folderNameString;
		        this._whereDropDownButton.attr( 'label', whereValue);
		        this._whereMenu.attr( 'value', folderPathString);
				this._whereMenu.destroyDescendants();
				var menuItem;
				var done = false;
				var infiniteLoopCheck = 0;	// Just being paranoid about some weird case where done is never true
				do{
					if(folderPathString == rootPathString){
						done = true;
						folderNameString = this.langObj.root;
					}
					menuItem = new MenuItem({label: folderNameString, value: folderPathString, onClick:dojo.hitch(this, function(label, value, e){
						this._whereMenu.attr('value', value);
						this._whereDropDownButton.attr( 'label', label);
						var folderPath = new Path(value);
						var folder =  folderPath;
						this.fileTree.set("selectedItems", [folder]);
					}, folderNameString, folderPathString)});
					this._whereMenu.addChild(menuItem);
					if(!done){
						folderResource = folderResource.parent;
						folderPathString = folderResource.getPath();
						folderNameString = folderResource.getName();
					}
					infiniteLoopCheck++;
				} while(!done && infiniteLoopCheck < 100);
			}
		},
		
		_checkValid: function() {
			// make sure the project name is OK.
			var name = this.fileDialogFileName.get('value'),
				valid = name && name.length > 0,
				folderName = this._whereMenu.attr('value'),
				parent = new Path(folderName);
				resource;
			if (parent) {
				valid = valid && !parent.readOnly();
			}
			
			resource = parent.getChildSync(name);
			if (resource) {
				valid = valid && !resource.readOnly();
			}
			
			this.__okButton.set('disabled', !valid);
			return valid;
		},             
		
		_okButton : function(e){
			var fullPath = (new Path(this._whereMenu.attr('value'))).append(this.fileDialogFileName.get( 'value'));
			
			this.value = fullPath.toString();

			var check = this.checkFileName(this._workbench,this.value);
			if (check) {
				return true
			} else {
				return false;
			}
		},
			
		_newFolder : function(){
			var resources = this.fileTree.get('selectedItems');
			var resource = (resources!=null && resources.length > 0)? resources[0] : null;
			
			var uiResource = require("qfacex/ui/ide/ui/Resource");
			uiResource.newFolder(this._workbench,resource, dojo.hitch(this,function(newFolder){
				this.fileTree.set("selectedItems", [newFolder]);
			}));
			
		},
		
		_getValueAttr : function(){
			return this.value;
		},
		
		cancelButton: function(){
			this.onClose();
		},
		
		_createResource : function(){
			var folderName = this._whereMenu.attr('value');
			var fileName = this.fileDialogFileName.get( 'value');
			var resource =  FileSystem.findSync(folderName + "/" + fileName);
			if(resource) return resource;
			var folder =  FileSystem.findSync(folderName);
			return folder.createFileSync(fileName);
		},
		
		onClose : function(){}
	
	});
});
