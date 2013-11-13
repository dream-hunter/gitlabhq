define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "qfacex/ui/workbench/WorkbenchPart",
        "qfacex/ui/ide/ui/Rename",
        "dojo/dom-attr",
        "dojo/text!./templates/projectToolbar.html",
        "dojo/i18n!../nls/ui",
        "dijit/form/Button",
        "dijit/form/TextBox",
        "dijit/form/RadioButton",
        "dijit/layout/ContentPane",
        "./ProjectSelection"
],function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, WorkbenchPart, Rename, domAttr, templateString, uiNLS){
	
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,WorkbenchPart], {

		templateString: templateString,
		workspace : null,
		
		constructor : function(args){
			if (this._workbench) {
				this._workspace = this._workbench.getUserWorkspace();
			}
		},

		postCreate: function(){
			this.connect(this._projectSelection, "onChange", this._projectSelectionChanged);
			this._projectSelection.set("value",this._workbench.getProject());
			this._currentProject = this._projectSelection.get("value");
			domAttr.set(this._projectDelete, "title", uiNLS.deleteProjectButtonTitle);
			domAttr.set(this._projectRename, "title", uiNLS.renameProjectButtonTitle);
		},
		
		onChange: function(){
		},

		_projectSelectionChanged: function(){
			var newProject = this._projectSelection.get("value");
			if(newProject==this._currentProject) {
				return;
			}
			//this._workbench.loadProject(newProject);
			this.value =newProject;
			this.onChange();
		},
		
		_delete: function(){
			var allProjects = this._projectSelection.get("projects");
			if(allProjects.length < 2){
				alert(uiNLS.deleteOnlyProjectError);
				return;
			}
			var changeToProject = null;
			var project = this._projectSelection.get("value");
			for(var i=0;!changeToProject && i<allProjects.length;i++){
				if(allProjects[i]!=project) {
					changeToProject = allProjects[i];
				}
			}
			
			//Make the user confirm
			if(!confirm(dojo.string.substitute(uiNLS.areYouSureDelete, [project]))){
		    	return;
		    }
			
			var resource = this._workspace.findSync(project);
			var workbench = this._workbench;
			resource.deleteResource().then(function(){
				workbench.loadProject(changeToProject);				
			});
		},
		
		_rename: function(){
			var workbench = this._workbench;
			var workspace = this._workspace();
			var oldProject = workbench.getProject();
			var renameDialog = new Rename({value:oldProject, invalid: this._projectSelection.get("projects")});
			
			workbench.showModal(renameDialog, uiNLS.renameProjectDialogTitle, {height:110, width: 200},function(){
				
				var cancel = renameDialog.get("cancel");
				if(!cancel){
					var newName = renameDialog.get("value");
					if(newName == oldProject) {
						return;
					}

					var resource = workspace.findSync(oldProject);
					resource.rename(newName).then(function(){
						workbench.loadProject(newName);						
					});
				}

				return true;
			});
		}
	});
});
