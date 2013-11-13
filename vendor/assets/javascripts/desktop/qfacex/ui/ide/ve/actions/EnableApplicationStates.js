require({cache:{
'url:qfacex/ui/ide/ve/actions/templates/EnableApplicationStates.html':"<div>\n\t<div class=\"dijitDialogPaneContentArea\">\n\t\t<div class='EnableAsStateContainerWidgetDiv'>\n\t\t\t${veNls.EnableApplicationStatesCurrentWidget}:\n\t\t\t<span class='EnableAsStateContainerWidgetLabel' dojoAttachPoint='widgetLabel'></span>\n\t\t</div>\n\t\t<div class='EnableAsStateContainerStatesDiv' dojoAttachPoint='statesListDiv'>\n\t\t\t//Filled in by JavaScript logic\n\t\t</div>\n\t\t<div class='EnableAsStateContainerDescriptionDiv' dojoAttachPoint='description'>\n\t\t\t//Filled in by JavaScript logic\n\t\t</div>\n\t\t<div class='EnableAsStateContainerCheckBoxDiv'>\n\t\t\t<input dojoAttachPoint=\"checkBoxWidget\" dojoType=\"dijit.form.CheckBox\" dojoAttachEvent=\"onKeyUp:_onKeyPress\" type=\"text\"></input>\n\t\t\t${veNls.EnableAsStateContainerWidgetLabel}\n\t\t</div>\n\t</div>\n\t\t\t\t\n\t<div class=\"dijitDialogPaneActionBar\">\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint='okButton' label='${commonNls.buttonOk}' class=\"maqPrimaryButton\"></button>\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint='cancelButton' label='${commonNls.buttonCancel}' class=\"maqSecondaryButton\"></button>\n\t</div>\n</div>\n"}});
define( [
	"dojo/_base/declare",
	"dojo/_base/connect",
	"dojo/dom-class",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"qfacex/ui/workbench/WorkbenchPart",
	"qfacex/ui/ide/ve/metadata",
	"qfacex/ui/ide/ve/widget",
	"qfacex/ui/ide/ve/States",
	"qfacex/ui/ide/actions/Action",
	"dojo/i18n!qfacex/ui/ide/ve/nls/ve",
	"dojo/i18n!dijit/nls/common",
	"dojo/text!./templates/EnableApplicationStates.html",
	"dijit/form/TextBox"
], function(declare, connect, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, WorkbenchPart,
		metadata, widgetUtils, States, Action, veNls, commonNls, templateString){

var enableApplicationStatesCommand = function(workbench){
	if(workbench.currentEditor && workbench.currentEditor.currentEditor && workbench.currentEditor.currentEditor.context){
		context = workbench.currentEditor.currentEditor.context;
		var selection = context.getSelection();
		if(selection.length == 1){
			var widget = selection[0];
			return (metadata.getAllowedChild(widget.type) == 'ANY');
		}
	}
	return false;
};

var EnableApplicationStatesWidget = declare( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,WorkbenchPart], {
	templateString: templateString,
	widgetsInTemplate: true,

	veNls: veNls,
	commonNls: commonNls,
	oldValue: null,
	widget:null,

	postCreate: function(){
		var workbench = this._workbench;
		if(workbench.currentEditor && workbench.currentEditor.currentEditor && workbench.currentEditor.currentEditor.context){
			editor = this.editor = workbench.currentEditor;
			context = this.context = workbench.currentEditor.currentEditor.context;
		}else{
			return;
		}
		var selection = context.getSelection();
		if(selection.length > 0){
			var widget = this.widget = selection[0];
			var widgetLabel = widgetUtils.getLabel(widget);
			this.widgetLabel.innerHTML = widgetLabel;
			this.oldValue = States.isStateContainer(widget.domNode);
			this.checkBoxWidget.set('checked', this.oldValue);
			if(this.oldValue){
				var description = veNls.DisableAsStateContainerDescription;
				var states = States.getStates(widget.domNode);
				if(states.length > 1){
					states.splice(0, 1); // Remove "Normal"
					this.statesListDiv.innerHTML = veNls.EnableApplicationStatesCurrentStates + ': ' + states.join(', ');
					description += ' ' + veNls.DisableAsStateContainerDataLoss;
				}else{
					this.statesListDiv.innerHTML = veNls.EnableApplicationStatesCurrentStates + ': ' + veNls.EnableApplicationStatesNone;
				}
				this.description.innerHTML = veNls.DisableAsStateContainerDescription;
			}else{
				this.description.innerHTML = veNls.EnableAsStateContainerDescription;
				this.statesListDiv.innerHTML = '';
			}
/*
			if(this.oldValue){
				domClass.add(this.enableDescription, 'dijitHidden');
				domClass.remove(this.disableDescription, 'dijitHidden');
				domClass.remove(this.statesListDiv, 'dijitHidden');
			}else{
				domClass.add(this.disableDescription, 'dijitHidden');
				domClass.remove(this.enableDescription, 'dijitHidden');
				domClass.add(this.statesListDiv, 'dijitHidden');
			}
*/
		}
		this.okButton.connect(this.okButton, "onClick", dojo.hitch(this, function(e){
			this.onOk(e);
		}));
		this.cancelButton.connect(this.cancelButton, "onClick", dojo.hitch(this, function(e){
			this.onCancel(e);
		}));
	},
	
	_onKeyPress: function(e) {
		if (e.keyCode==dojo.keys.ENTER) {
			this.onOk();
		}
	},

	onOk: function() {
		var newValue = this.checkBoxWidget.get('checked');
		if(newValue != this.oldValue){
			var node = this.widget.domNode;
			if(newValue){
				node._maqAppStates = {};
				var o = States.serialize(node);
				this.widget._srcElement.addAttribute(States.APPSTATES_ATTRIBUTE, o.maqAppStates);
			}else{
				delete node._maqAppStates;
				this.widget._srcElement.removeAttribute(States.APPSTATES_ATTRIBUTE);
				States.removeUnusedStates(this.context);
			}
			this.editor._visualChanged();
			connect.publish("/maqetta/appstates/state/containerChange", []);
		}
		this.onClose();
	},

	onCancel: function() {
		this.onClose();
	}
});

return declare( [Action], {

	run: function(){
		if(!enableApplicationStatesCommand(this._workbench)){
			return;
		}
		var context;
		var workbench = this._workbench;
		if(workbench.currentEditor && workbench.currentEditor.currentEditor && workbench.currentEditor.currentEditor.context){
			context = workbench.currentEditor.currentEditor.context;
		}else{
			return;
		}

		var w = new EnableApplicationStatesWidget({workbench:this._workbench);
		w._workbench = workbench;

		workbench.showModal(w, veNls.EnableApplicationStates, {width:'370px'});
	},

	isEnabled: function(){
		return enableApplicationStatesCommand(this._workbench);
	}
});
});
