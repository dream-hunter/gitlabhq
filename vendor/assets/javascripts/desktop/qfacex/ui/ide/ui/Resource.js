//FIXME: A bunch of hard-coded strings in here that need to be globalized
define([
	'dojo/_base/declare',
	'qface/lang/Path',
	'qfacex/ui/ide/workbench/Preferences',
	'qfacex/ui/ide/ve/RebuildPage',
	'qfacex/ui/ide/ui/Rename',
	'qfacex/ui/ide/ui/widgets/NewHTMLFileOptions',
	'qfacex/ui/ide/ui/widgets/OpenFile',
	'qfacex/ui/ide/ui/widgets/NewFolder',
	'qfacex/ui/ide/ui/widgets/NewFile',
	'qfacex/ui/ide/ui/widgets/AddFiles',
	'qfacex/ui/ide/ui/NewProject',
	'dojox/form/uploader/FileList', 
	'dojox/form/Uploader',
	'qfacex/ui/ide/ui/Dialog',
	'dojo/i18n!./nls/ui',
	'dojo/i18n!dijit/nls/common',
	'dijit/form/Button',
	'dojox/form/uploader/plugins/HTML5',      
       
],function(declare, Path,  Preferences, RebuildPage, Rename, NewHTMLFileOption, OpenFile, NewFolder, NewFile, AddFiles, NewProject, FileList, Uploader, Dialog, uiNLS, commonNLS){

var createNewDialog = function(workbench,fileNameLabel, createLabel, type, dialogSpecificClass, dialogSpecificClassOptions, fileName, existingResource, optionalMessage) {
	var resource=existingResource || getSelectedResource(workbench);
	var folder;
	if (resource) {
		if(resource.elementType=="Folder"){
			folder = resource;
		}else{
			folder = resource.parent;
		}
	}else{
		var base = workbench.getProject();
		var prefs = Preferences.getPreferences('davinci.ui.ProjectPrefs',base);
		var workspace = workbench.getUserWorkspace();
		
		if(prefs.webContentFolder!=null && prefs.webContentFolder!=""){
			var fullPath = new Path(workbench.getProject()).append(prefs.webContentFolder);
			folder = workspace.findSync(fullPath.toString());
			
		}else{
			folder= workspace.findSync(workbench.getProject());
		}
	}
	
	var proposedFileName = fileName || uiResource.getNewFileName(workbench,'file',folder,"." + type);
	var dialogOptions = {newFileName:proposedFileName,
						fileFieldLabel:fileNameLabel, 
						folderFieldLabel:"Where:", // FIXME: i18n
						finishButtonLabel:createLabel,
						value: folder,
						forcedRoot:folder,
						checkFileName: checkFileName,
						dialogSpecificClass:dialogSpecificClass,
						dialogSpecificClassOptions:dialogSpecificClassOptions,
						optionalMessage: optionalMessage,
						workbench : workbench
						};
	return new NewFile(dialogOptions);
};


var checkFileName = function(workbench,fullPath) {
	var workspace = workbench.getUserWorkspace();
	var resource = workspace.findSync(fullPath);
	if(resource){
		alert("File already exists!");
	}

	return !resource;
};

var getSelectedResource = function(workbench){
	return (uiResource.getSelectedResources(workbench) || [])[0];
};

var uiResource = {
		newHTMLDialogSpecificClass: "qfacex/ui/ide/ui/widgets/NewHTMLFileOptions",
		
		newHTMLMobile: function(workbench){
			this.newHTML(workbench,{ 
				title:uiNLS.createMobileApplication,
				dialogSpecificClassOptions:{ showDevices:true, showThemeSetsButton:true }
			});
		},
		newHTMLDesktop: function(workbench){
			this.newHTML(workbench,{ 
				title:uiNLS.createDesktopApplication,
				dialogSpecificClassOptions:{ showDevices:false, showThemeSetsButton:true },
				device:'desktop'
			});
		},
		newHTMLSketchHiFi: function(workbench){
			this.newHTML(workbench,{
				title:uiNLS.createSketchHiFi,
				dialogSpecificClassOptions:{ showDevices:false, showThemeSetsButton:true },
				layout:'absolute', 
				theme:'claro'
			});
		},
		newHTMLSketchLoFi: function(workbench){
			this.newHTML(workbench,{ 
				title:uiNLS.createSketchLoFi,
				dialogSpecificClassOptions:{ showDevices:false, showThemeSetsButton:false },
				layout:'absolute', 
				theme:'Sketch' 
			});
		},

		newHTML: function(workbench,params){
			var workspace = workbench.getUserWorkspace();
			var dialogSpecificClass = this.newHTMLDialogSpecificClass;
			var dialogSpecificClassOptions = params ? params.dialogSpecificClassOptions : null;
			var newDialog = createNewDialog(workbench,uiNLS.fileName, uiNLS.create, "html", dialogSpecificClass, dialogSpecificClassOptions);

			var executor = function(){
				var optionsWidget, options;
				if(newDialog.dialogSpecificWidget){
					optionsWidget = newDialog.dialogSpecificWidget;
					options = optionsWidget.getOptions();
				}
				var resourcePath = newDialog.get('value');
				var resource = workspace.createResource(resourcePath);
				resource.isNew = true;
				resource.dirtyResource = true;
				var text = workspace.createText("HTML", {resource:resource});
				if(text){
					resource.setText(text);
				}
				var device = 'none';
				if(params  && params.dialogSpecificClassOptions && params.dialogSpecificClassOptions.showDevices){
					device = options ? options.device : 'none';
				}
				var flowLayout = (params && params.layout) ? params.layout : true;
				flowLayout = flowLayout+'';	// value need to be strings 'true' or 'false'
				var theme = (params && params.theme) ? params.theme : null;
				var themeSet = null;
				if(params  && params.dialogSpecificClassOptions && params.dialogSpecificClassOptions.showThemeSetsButton){
					theme = options ? options.theme : null;
					themeSet = newDialog.dialogSpecificWidget ? newDialog.dialogSpecificWidget._selectedThemeSet : null;
				}
				var newHtmlParams = {
					device:device,
					flowlayout:flowLayout,
					theme: theme,
					themeSet:themeSet
				};
				uiResource.openResource(workbench,resource, newHtmlParams);
				workbench.workbenchStateCustomPropSet('nhfo',options);
			};
			workbench.showModal(newDialog, params.title, '', executor, true);
		},
	
		newCSS: function(workbench){
			var workspace = workbench.getUserWorkspace();
			var newDialog = createNewDialog(workbench,uiNLS.fileName, uiNLS.create, "css");
			var executor = function(){
				var resourcePath = newDialog.get('value');
				var resource = workspace.createResource(resourcePath);
				resource.isNew = true;
				var text = workspace.createText("CSS", {resource:resource});
				if(text)
					resource.setText(text);
				uiResource.openResource(workbench,resource);
			};
			workbench.showModal(newDialog, uiNLS.createNewCSSFile, '', executor, true);
		},
	
		/* method to select a given resource in the explorer tree */
		
		selectResource : function(resource){
			
			var resourceTree = dijit.byId("resourceTree");
			//var path = new Path(resource.getPath()).removeFirstSegments(1);
			
			var path = [];
			for(var i=resource; i.parent; i = i.parent) {
				path.unshift(i);
			} 
			
			resourceTree.set('path', path);
		},
		
		newFolder: function(workbench,parentFolder, callback){
			var workspace = workbench.getUserWorkspace();
			var resource=parentFolder || getSelectedResource(workbench);
			var folder;
			if(resource){
				if(resource.elementType=="Folder"){
					folder = resource;
				}else{
					folder = resource.parent;
				}
			}else{
				var base = workbench.getProject();
				var prefs = Preferences.getPreferences('davinci.ui.ProjectPrefs',base);
				
				if(prefs.webContentFolder!=null && prefs.webContentFolder!=""){
					var fullPath = new Path(workbench.getProject()).append(prefs.webContentFolder);
					folder = workspace.findSync(fullPath.toString());
				}
				if(!folder) {
					folder = workspace.findSync(workbench.getProject());
				}
			}
			
			var proposedFileName = uiResource.getNewFileName(workbench,'folder',folder);
			var dialogOptions = {newFileName:proposedFileName,
								fileFieldLabel:uiNLS.folderName, 
								folderFieldLabel:uiNLS.parentFolder,
								root:folder,
								finishButtonLabel:uiNLS.createFolder,
								checkFileName: checkFileName,
								workbench : workbench
			};
			
			var newFolderDialog =  new NewFolder(dialogOptions);
			var finished = false;
			var newFolder;
			var executor = function(){
				var resourcePath = newFolderDialog.get('value');
				newFolder= workspace.createResource(resourcePath,true);

				if(callback) {
					callback(newFolder);
				}
				if(newFolder!=null)
					uiResource.selectResource(workbench,newFolder);
			};
			
			workbench.showModal(newFolderDialog, uiNLS.createNewFolder, '', executor, true);
		},
	
		/* close an editor editting given resource */
		closeEditor: function(workbench,resource,flush){
			var oldEditor = workbench.getOpenEditor(resource);
			if(oldEditor!=null){
				if(flush) oldEditor.save();
				oldEditor.editorContainer.forceClose(oldEditor);
			}
			/* return true if we closed an open editor */
			return oldEditor != null;
		},
		save: function(workbench) {
			var editor = workbench.getOpenEditor();
			if (editor) {
				// check if read only
				if (editor.resourceFile && editor.resourceFile.readOnly()) {
					this.saveAs(resource.getExtension(), uiNLS.savingReadonlyFile);
				} else {
					editor.save();
				}
			}
		},

		saveAs: function(workbench,extension, optionalMessage){
			var workspace = workbench.getUserWorkspace();
			var oldEditor = workbench.getOpenEditor();
			var oldFileName = oldEditor.fileName;
			
			var newFileName = new Path(oldFileName).lastSegment();
			var oldResource = workspace.findSync(oldFileName);
			
			var newDialog = createNewDialog(workbench,uiNLS.fileName, uiNLS.save, extension, null, null, newFileName, oldResource, optionalMessage);
			var executor = function(){
				var resourcePath = newDialog.get('value');
				var oldResource = workspace.findSync(oldFileName);
				var oldContent;
				var themeSet;
				var theme;
				
				if (oldEditor.editorID == "davinci.html.CSSEditor") {
					// this does some css formatting
					oldContent = oldEditor.getText();
				} else {
					oldContent = (oldEditor.model && oldEditor.model.getText) ? oldEditor.model.getText() : oldEditor.getText();
				}
				if (oldEditor.editorID == "davinci.ve.HTMLPageEditor") {
					themeSet = Theme.getThemeSet(oldEditor.visualEditor.context);
					theme = oldEditor.visualEditor.context.theme;
				}
				
				
				var existing=workspace.findSync(resourcePath);
				
				oldEditor.editorContainer.forceClose(oldEditor);
				if(existing){
					existing.removeWorkingCopy();
					existing.deleteResource();
				}
				// Do various cleanups around currently open file
				//oldResource.removeWorkingCopy(); // 2453 Factory will clean this up..
				oldEditor.isDirty = false;
				// Create a new editor for the new filename
				var file = workspace.createResource(resourcePath);
				new RebuildPage().rebuildSource(oldContent, file, theme, themeSet).then(function(newText) {
					file.setContent(newText);
					workbench.openEditor({fileName: file, content: newText});					
				});
			};
			workbench.showModal(newDialog, uiNLS.saveFileAs, '', executor);
		},
	
		newJS: function(workbench){
			var workspace = workbench.getUserWorkspace();
			var newDialog = createNewDialog(workbench,uiNLS.fileName, uiNLS.create, "js");
			var executor = function(){
				var resourcePath = newDialog.get('value');
				var resource = workspace.createResource(resourcePath);
				resource.isNew = true;
				var text = workspace.createText("CSS", {resource:resource});
				if(text) {
					resource.setText(text);
				}
				uiResource.openResource(workbench,resource);
			};
			workbench.showModal(newDialog, uiNLS.createNewJSFile, '', executor);
		},

		openFile: function(workbench){
			var workspace = workbench.getUserWorkspace();
			var folder, resource = getSelectedResource(workbench)
			if(resource){
				if(resource.elementType=="Folder"){
					folder = resource;
				}else{
					folder = resource.parent;
				}
					
			}else{
				folder = workspace.findSync(workbench.getProject());
			}
			
			var dialogOptions = {finishButtonLabel: uiNLS.open,workbench:workbench};
			var openDialog = new OpenFile(dialogOptions);
			
			var executor = function(){
				uiResource.openResource(workbench,openDialog.get('value'));
			};
			workbench.showModal(openDialog, uiNLS.openFile, {width: 350, height: 250}, executor, true);
		},
	
	
		addFiles: function(workbench){
			var addFiles = new AddFiles({selectedResource: getSelectedResource(workbench),workbench:workbench});

			workbench.showModal(addFiles, uiNLS.addFiles, {width: 350}, null);
		},

		getNewFileName:function (workbench,fileOrFolder, fileDialogParentFolder, extension){
			var workspace = workbench.getUserWorkspace();
			
			var existing, proposedName;
			var count=0;
			if(!extension){
				extension="";
			}
			do{
				count++;
				if(fileOrFolder==='folder'){
					proposedName='folder'+count;
				}else{
					proposedName='file'+count+extension;
				}
				var fullname=fileDialogParentFolder.getPath()+'/'+proposedName;
				existing=workspace.findSync(fullname);
			}while(existing);
			return proposedName;
		},

		canModify: function(item){
			return !item.readOnly();
		},
	
		newProject: function(workbench){
			var projectDialog = new NewProject({workbench:workbench});
			workbench.showModal(projectDialog, uiNLS.newProject, '', null, true);
		},
	
		renameAction: function(workbench){
		
			var selection = uiResource.getSelectedResources(workbench);
		    if( selection.length!=1) {
		    	return;
		    }
		    var resource = selection[0];
		    resource.parent.getChildren(function(parentChildren){
			    var invalid = parentChildren.map(function(child) {
			    	return child.name;
			    });
	
		    	var renameDialog = new Rename({value:resource.name, invalid:invalid});
		  		workbench.showModal(renameDialog, uiNLS.renameDialogTitle, '', function(){
		  			var cancel = renameDialog.attr("cancel");
		  			var newName = renameDialog.attr("value");
		  			if(!cancel){
		  				var opened = uiResource.closeEditor(workbench,resource,true);
		  				resource.rename(newName).then(function() {
				  			if (opened) {
				  				uiResource.openResource(workbench,resource);		  					
				  			}
		  				});
					}
		  			return true;
		  		}, true);	
		    }, true);
		},
	
	
		deleteAction: function(workbench){
			var selection = uiResource.getSelectedResources(workbench),
			    paths = selection.map(function(resource){ return resource.getPath(); }).join("\n\t");

			if(!confirm(dojo.string.substitute(uiNLS.areYouSureDelete, [paths]))){
		    	return;
		    }
	
		    selection.forEach(function(resource){
		    	uiResource.closeEditor(workbench,resource);
		    	resource.deleteResource();
			});
		},

		getSelectedResources: function(workbench){
		  var selection=workbench.getSelection();
		  if (selection[0]&&selection[0].resource) {
			  return dojo.map(selection,function(item){return item.resource;});
		  }
		},

		alphabeticalSortFilter:{
		     filterList: function(list){
			    return list.sort(function (file1,file2) {
			    	return file1.name > file2.name ? 1 : file1.name<file2.name ? -1 : 0;
			    });
		    }
		
		},
	   foldersFilter: {
	     filterItem: function (item) {
		    if (item.elementType=='File') {
		    	return true;
		    }
	    }
	   },

		openPath: function(workbench,path,text){
			var options = {fileName:path};
			if (text) {
				options.text = text;
			}
			workbench.openEditor(options);
		},
	
		openResource: function(workbench,resource, newHtmlParams){
	
			if(resource.elementType == "File"){
				resource.getContent().then(function(content) {
					workbench.openEditor({
						fileName: resource,
						content: content
					}, newHtmlParams);
				});
			}
		}

	};

return uiResource;
});
