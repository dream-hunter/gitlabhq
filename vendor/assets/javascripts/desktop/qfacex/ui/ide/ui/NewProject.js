require({cache:{
'url:qfacex/ui/ide/ui/templates/NewProject.html':"<div>\n\t<div class=\"dijitDialogPaneContentArea\">\n\t\t<table>\n\t\t<tr>\n\t\t<td class=\"NewProjectDialogLabel\">${newProjectName}</td><td><input class='templateInput' data-dojo-type=\"dijit.form.ValidationTextBox\" type='text' dojoAttachPoint=\"_projectName\"></input></td><td><div dojoAttachPoint='_error4'></div></td>\n\t\t</tr>\n\t\t\n\t\t<td class=\"NewProjectDialogLabel\">${newProjectEclipseSupport}</td><td><input class='templateInput' type='checkbox' dojoAttachPoint=\"_eclipseSupport\"></input></td><td><div dojoAttachPoint='_error5'></div></td>\n\t\t</table>\n\t</div>\n\n\t<div class=\"dijitDialogPaneActionBar\">\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint=\"_okButton\" dojoAttachEvent='onClick:okButton' label='${create}' class=\"maqPrimaryButton\" type=\"submit\" disabled></button>\n\t\t<button dojoType='dijit.form.Button' dojoAttachEvent='onClick:cancelButton' label='${buttonCancel}' class=\"maqSecondaryButton\"></button>\n\t</div>\n\t\t\n</div>"}});
define(["dojo/_base/declare",
        "dijit/_Templated",
        "dijit/_Widget",
        "qfacex/ui/workbench/WorkbenchPart",
        "qfacex/ui/ide/workbench/Preferences",
        "dojo/i18n!qfacex/ui/ide/ui/nls/ui",
        "dojo/i18n!dijit/nls/common",
        "dojo/text!./templates/NewProject.html",
        "dijit/form/Button",
        "dijit/form/RadioButton",
        "dijit/form/ValidationTextBox"
        
],function(declare, _Templated, _Widget, WorkbenchPart, Preferences, uiNLS, commonNLS, templateString){
	return dojo.declare( [_Widget,_Templated,WorkbenchPart], {
		widgetsInTemplate: true,
		templateString: templateString,
		_okButton: null,
		_projectName: null,
		_eclipseSupport: null,
		
		postMixInProperties: function() {
			var langObj = uiNLS;
			var dijitLangObj = commonNLS;
			dojo.mixin(this, langObj);
			dojo.mixin(this, dijitLangObj);
			this._workbench.getUserWorkspace().listProjects(dojo.hitch(this,this.setProjects));
			this.inherited(arguments);
		},

		setProjects: function(projects){
			this._projects = {};

			projects.forEach(dojo.hitch(this, function(project) {
					if (project) {
						this._projects[project.name] = true;
					}
			}));
		},

		postCreate: function(){
			this.inherited(arguments);
			dojo.connect(this._projectName, "onKeyUp", this, '_checkValid');

			this._projectName.validator = dojo.hitch(this, function(value, constraints) {
					var isValid = true;
					
					if (!this._projects || !value) {
						isValid = false;
					} else if (this._projects[value]) {
						isValid = false;
						this._projectName.invalidMessage = uiNLS.newProjectNameExists;
					} else {
						this._projectName.invalidMessage = null;
					}
					
					return isValid;
			});
		},
		
		_checkValid: function(){
			// make sure the project name is OK.
			if(!this._projects) return false; // project data hasn't loaded

			var valid = this._projectName.isValid();

			this._okButton.set( 'disabled', !valid);
		},
		
		okButton: function(){
			var newProjectName = dojo.attr(this._projectName, "value");
			var isEclipse = dojo.attr(this._eclipseSupport,'checked');

			var workbench = this._workbench;
			this._workbench.getUserWorkspace().createProject(newProjectName, true, isEclipse).then(function(){
				if(isEclipse){
					Preferences.savePreferences(
							workbench,
							'davinci.ui.ProjectPrefs',
							newProjectName,
							{
								webContentFolder:"WebContent",
								themeFolder: "WebContent/themes",
								widgetFolder: "WebContent/lib/custom"
							}
					);
				}

				if (workbench.singleProjectMode()) {
					workbench.loadProject(newProjectName);
				}
			})
		},
		
		_getEclipseProjectAttr: function(){
			 return dojo.attr(this._eclipseSupport, "checked");
		},
		
		_getValueAttr: function(){
			return this.value;
		},

		cancelButton: function(){
			this.cancel = true;
			this.onClose();
		},

		onClose: function(){}
	});
});

