define( [
	"dojo/_base/declare",
	"qfacex/widgets/WidgetLite",
	"qfacex/ui/workbench/WorkbenchPart",
	"dojo/i18n!qfacex/ui/ide/ui/nls/ui",
	"dojo/text!./templates/SelectProjectDialog.html",
	"./widgets/ProjectSelection"
], function(declare, WidgetLite, WorkbenchPart, uiNLS, templateString) {

return declare([ WidgetLite, WorkbenchPart], {
	templateString: templateString,
	uiNLS: uiNLS,

	constructor : function(args){
		if (this._workbench) {
			this._workspace = this._workbench.getUserWorkspace();
		}
	},

	postCreate: function() {
		this.currentProject = this._workbench.getProject();

		this.currentProjectName.innerHTML = this.currentProject;
	},

	_onChange: function(e) {
		if (this.projectSelection.get("value") == this.currentProject) {
			this._okButton.set("disabled", true);
		} else {
			this._okButton.set("disabled", false);
		}
	},

	okButton: function() {
		var project = this.projectSelection.get("value");
		if (project) {
			Workbench.loadProject(project);
		}
	},

	cancelButton: function() {
		this.onClose();
	}
});
});

