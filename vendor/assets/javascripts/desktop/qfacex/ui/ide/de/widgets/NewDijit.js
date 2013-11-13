require({cache:{
'url:qfacex/ui/ide/de/widgets/templates/NewDijit.html':"<div>\n\t<div class=\"dijitDialogPaneContentArea\">\n\t\t<table>\n\t\t<tr>\n\t\t<td class=\"NewProjectDialogLabel\">Widget Group:</td><td><input class='templateInput' type='text' dojoAttachPoint=\"_widgetGroup\" vaule='MyWidgets'></input></td><td><div dojoAttachPoint='_error3'></div></td>\n\t\t\n\t\t</tr>\n\t\t\n\t\t<tr>\n\t\t<td class=\"NewProjectDialogLabel\">Widget Name:</td><td><input class='templateInput' type='text' dojoAttachPoint=\"_dijitName\"></input></td><td><div dojoAttachPoint='_error4'></div></td>\n\t\t</tr>\n\t\t<tr style='display:none;'>\n\t\t<td class=\"NewProjectDialogLabel\">Replace Selection with new Widget</td><td><input class='templateInput' type='checkbox' dojoAttachPoint=\"_replaceSelection\"></input></td><td><div dojoAttachPoint='_error5'></div></td>\n\t\t</tr>\n\t\t</table>\n\t</div>\n\n\t<div class=\"dijitDialogPaneActionBar\">\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint=\"_okButton\" dojoAttachEvent='onClick:okButton' label='OK' type=\"submit\" class=\"maqPrimaryButton\" disabled></button> \n\t\t<button dojoType='dijit.form.Button' dojoAttachEvent='onClick:cancelButton' label='Cancel' class=\"maqSecondaryButton\"></button>\n\t</div>\t\t\n</div>"}});
define( ["dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_Templated",
        "dojo/text!./templates/NewDijit.html",
        "dijit/form/RadioButton",
        "dijit/form/TextBox",
        "dijit/form/Button"
        
       
],function(declare,  _Widget, _Templated, templateString){
	return declare( [_Widget,_Templated], {
		widgetsInTemplate: true,
		templateString: templateString,
		_okButton: null,
		_dijitName : null,
		_widgetGroup: null,
		_replaceSelection : null,
		
		postMixInProperties : function() {
			this.inherited(arguments);
		},
		
		postCreate : function(){
			this.inherited(arguments);
			dojo.connect(this._dijitName, "onkeyup", this, '_checkValid');
			
			
		},
		
		
		_checkValid : function(){
			// make sure the Dijit name is OK.
			var name = dojo.attr(this._dijitName, "value");
			var valid = (name!=null);
			this._okButton.set( 'disabled', !valid);
		},
		
		okButton : function(){
			this.value = {'name': dojo.attr(this._dijitName, "value"), 
					     'group':dojo.attr(this._widgetGroup, "value"),
					     'replaceSelection':dojo.attr(this._replaceSelection, "value")};
		},	
		
		_getValueAttr : function(){
			return this.value;
		},
		cancelButton: function(){
			this.cancel = true;
			this.onClose();
		},
	
		onClose : function(){}
	
	});
});
