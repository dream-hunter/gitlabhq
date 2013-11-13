require({cache:{
'url:qfacex/ui/ide/ve/actions/templates/AddState.html':"<div>\n\t<div class=\"dijitDialogPaneContentArea\">\n\t\t${veNls.stateLabel}: <input dojoAttachPoint=\"input\" dojoType=\"dijit.form.TextBox\" dojoAttachEvent=\"onKeyUp:_onKeyPress\" type=\"text\"></input>\n\t</div>\n\t\t\t\t\n\t<div class=\"dijitDialogPaneActionBar\">\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint=\"okButton\" dojoAttachEvent='onClick:onOk' disabled label='${veNls.createLabel}' class=\"maqPrimaryButton\" type=\"submit\"></button>\n\t\t<button dojoType='dijit.form.Button' dojoAttachEvent='onClick:onCancel' label='${commonNls.buttonCancel}' class=\"maqSecondaryButton\"></button>\n\t</div>\n</div>\n"}});
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"qfacex/ui/ide/ve/States",
	"qfacex/ui/ide/actions/Action",
	"dojo/i18n!qfacex/ui/ide/ve/nls/ve",
	"dojo/i18n!dijit/nls/common",
	"dojo/text!./templates/AddState.html",
	"dijit/form/TextBox"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, States, Action, veNls, commonNls, templateString){

var AddStateWidget = declare( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	templateString: templateString,
	widgetsInTemplate: true,

	veNls: veNls,
	commonNls: commonNls,

	_isValid: function() { 
		var state = this.input.get("value");
		// TODO: Replace alerts with inline error messages
		if (!state) {
			return false;
		} else if (States.hasState(this.node, state)) {
			alert(dojo.string.substitute(veNls.stateNameExists, { name: state }));
			return false;
		}
		return true;
	},

	_onKeyPress: function(e) {
		if (e.keyCode!=dojo.keys.ENTER) {
			if (this._isValid()) {
				this.okButton.set("disabled", false);
			} else {
				this.okButton.set("disabled", true);
			}
		}
	},

	onOk: function() {
		var newState = this.input.get("value");
		if(newState){
			States.add(this.node, newState);
		}
	},

	onCancel: function() {
		this.onClose();
	}
});

return declare( [Action], {

	run: function(){
		var context;
		var workbench = this._workbench;
		if(workbench.currentEditor && workbench.currentEditor.currentEditor && workbench.currentEditor.currentEditor.context){
			context = workbench.currentEditor.currentEditor.context;
		}else{
			return;
		}
		var statesFocus = States.getFocus(context.rootNode);
		if(!statesFocus || !statesFocus.stateContainerNode){
			return;
		}

		var w = new davinci.ve.actions.AddStateWidget({node: statesFocus.stateContainerNode });

		workbench.showModal(w, veNls.createNewState, null, null, true);
	}
});
});
