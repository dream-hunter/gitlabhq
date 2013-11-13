require({cache:{
'url:qfacex/ui/ide/ui/templates/ChooseDevice.html':"<div>\n  <select dojoType=\"dijit.form.Select\" dojoAttachPoint=\"select\" style=\"width: 100%\">\n  </select>\n</div>\n"
}
});
define([
	"dojo/_base/declare",
	"qfacex/ui/ide/actions/Action",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"qfacex/ui/ide/commands/CompoundCommand",
	"qfacex/ui/ide/ve/commands/RemoveCommand",
	"dojo/store/Memory",
	"dojo/text!../../ui/templates/ChooseDevice.html",
	"dojo/i18n!qfacex/ui/ide/ve/nls/ve",
	"dojo/i18n!../../actions/nls/actions",
	"dojo/i18n!dijit/nls/common",
	"dijit/form/Select"
], function(declare, Action, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, CompoundCommand, RemoveCommand, Memory, templateString, veNls, actionNLS, commonNls){


	var ChooseDeviceActionContent = declare( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	  	templateString: templateString,
		widgetsInTemplate: true,

		select: null,

		device: null,
		deviceList: null,

		postCreate: function() {
		    var store = new Memory({data:this.deviceList, idProperty: "name"});
		    this.select.labelAttr = "name";
		    this.select.setStore(store);
			this.select.set("value", this.device);
		},

		getValue: function() {
			return this.select.get("value");
		}
	});	

	return declare([Action], {

		
		run: function(selection){
			if (!this.isEnabled(null)){ return; }
			var e = this._workbench.getOpenEditor();
			if (e && e.isDirty){
				//Give editor a chance to give us a more specific message
				var message = e.getOnUnloadWarningMessage();
				if (!message) {
					//No editor-specific message, so use our canned one
					message = dojo.string.substitute(veNls.filesHasUnsavedChanges, [e.fileName]);
				}
				this._workbench.showDialog(veNls.chooseDeviceSilhouette, message, {width: 300}, dojo.hitch(this,this._okToSwitch), 'Save',null);
			} else {
				this._okToSwitch();
			}                                                     
		},
		
		_okToSwitch: function(){
			var e = this._workbench.getOpenEditor();
			if (e.isDirty) {
				e.save();
			}
			this.showDevices(); 
		},

		isEnabled: function(selection){
			var e = this._workbench.getOpenEditor();
			var PageEditorClass = require("qfacex/ui/ide/ve/PageEditor");
			return (e && e.isInstanceOf(PageEditorClass));// this is a hack to only support undo for theme editor for 0.5
		},

		showDevices: function(){

			var e = this._workbench.getOpenEditor();
			var c = e.getContext();
			var device = c.visualEditor.deviceName;
			var deviceList = [{name: "none"}, {name: "iphone"}, {name: "ipad"}, {name: "android_340x480"}, {name: "android_480x800"}, {name: "androidtablet"}, {name: "blackberry"}];

			var ui = new ChooseDeviceActionContent({device: device, deviceList: deviceList});

			function _callback() {
				var e = this._workbench.getOpenEditor();
				var context = e.getContext();
				context.visualEditor.setDevice(ui.getValue());
				e._visualChanged();
			};

			this._workbench.showDialog(veNls.chooseDeviceSilhouette, ui, {width: 300}, dojo.hitch(this, _callback), actionNLS.select);
		}
	});

});
