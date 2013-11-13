define( ["dojo/_base/declare", 
        "qfacex/ui/ide/ui/ProjectDataStore",
        "dijit/form/ComboBox",
        "qfacex/ui/workbench/WorkbenchPart"

 ],function(declare, ProjectDataStore, ComboBox, WorkbenchPart,Resource){
	return declare([dijit._Widget,WorkbenchPart], {
		postCreate: function(){
			this._store = new ProjectDataStore({});
			this.combo = new ComboBox({store: this._store, required: false, style: "width:100%"});
			this.domNode = this.combo.domNode;
			this._populateProjects();
		},
		
		_populateProjects: function(){
			var workspace = this._workbench.getUserWorkspace(),
				store = this._store,
				combo = this.combo;
			var workbench = this._workbench;
			workspace.listProjects(function(projects){
				store.setValues(projects);
				var activeProject = workbench.getProject();
				combo.attr('value', activeProject);
			});

		}
		
	});


});


