require({cache:{
'url:qfacex/ui/ide/ve/widgets/templates/WidgetToolBar.html':"<div class=\"propertiesTitleBar\" style=\"display: none\">\n\t<div class='propertiesWidgetDescription'>\n\t\t<span class='propertiesWidgetDescriptionFor'>${veNLS.toolBarFor}</span>\n\t\t<span data-dojo-attach-point=\"descNode\">${veNLS.noSelection}</span>\n\t</div>\n\n\t<div class=\"propertiesTitleBarPropertiesContainer\">\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" class=\"propertiesTitleBarProperties property_table_stretchable\">\n\t\t\t<colgroup><col style=\"width:10px;\"><col class=\"gap02\"><col class=\"gap03\"><col style=\"width:10px;\"><col style=\"width:6px;\"></colgroup>\n\t\t\t<tbody>\n\t\t\t\t<tr class=\"cssPropertySection\">\n\t\t\t\t\t<td></td>\n\t\t\t\t\t<td class=\"propertyDisplayName\">${veNLS.toolBarClass}&nbsp;</td>\n\t\t\t\t\t<td class=\"propertyInputField\">\n\t\t\t\t\t  <input data-dojo-type=\"dijit/form/ComboBox\" data-dojo-attach-point=\"classComboBox\" label=\"\" data-dojo-attach-event=\"onChange:_onChangeClassAttribute,onFocus:_onFieldFocus,onBlur:_onFieldBlur\" style=\"width: 100%\" searchAttr=\"name\"/>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td nowrap=\"true\" class=\"propertyExtra\"></td>\n\t\t\t\t\t<td></td>\n\t\t\t\t</tr>\n\t\n\t\t\t\t<tr class=\"cssPropertySection\">\n\t\t\t\t\t<td></td>\n\t\t\t\t\t<td class=\"propertyDisplayName\">${veNLS.toolBarId}&nbsp;</td>\n\t\t\t\t\t<td class=\"propertyInputField\">\n\t\t\t\t\t  <input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"idTextBox\" label=\"\" data-dojo-attach-event=\"onChange:_onChangeIDAttribute,onKeyPress:_onKeyPress,onFocus:_onFieldFocus,onBlur:_onFieldBlur\" style=\"width: 100%\"/>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td nowrap=\"true\" class=\"propertyExtra\"></td>\n\t\t\t\t\t<td></td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n\t</div>\n</div>\n"}});
define( [
		"require",
		"dojo/_base/declare",
        "dijit/_Templated",
        "dijit/_Widget",
        "qfacex/ui/workbench/ViewLite",
        "qfacex/ui/ide/ve/commands/ModifyCommand",
        "dijit/form/ComboBox",
        "dijit/form/ValidationTextBox",
        "dijit/form/TextBox",
        "dojo/store/Memory",
        "dojo/i18n!qfacex/ui/ide/ve/nls/ve",
        "dojo/i18n!dijit/nls/common",
        "qfacex/ui/ide/ve/widget",
        "dojo/text!./templates/WidgetToolBar.html",
],function(require,declare, _Templated, _Widget, ViewLite, ModifyCommand, ComboBox, ValidationTextBox, TextBox, Memory, veNLS, commonNLS, widgetUtils, templateString){
	return declare([ViewLite], {
	
		templateString: templateString,
		widgetsInTemplate: true,

		// attach points
		descNode: null,
		idTextBox: null,
		classComboBox: null,

		widgetDescStart:"",
		widgetDescUnselectEnd:"",

		_oldIDName: null,
		_oldClassName: null,

		veNLS: veNLS,
	
		postCreate: function() {
			// id validation
			this.idTextBox.validator = dojo.hitch(this, function(value, constraints) {
				this.invalidMessage = null;

				if (!value || !this._widget || this.changing) {
					return true;
				}

				var w = widgetUtils.byId(value);
				if (w && w !== this._widget) {
					this.invalidMessage = veNLS.idAlreadyUsed;
					return false
				}

				return true;
			})

			this.subscribe("/davinci/ui/widget/replaced",  this._widgetReplaced);
		},
		
		initialize: function(){
			this._editor = this.getWorkbench().currentEditor;

			if(this._editor && this._editor.visualEditor && this._editor.visualEditor.context){
				var selection = this._editor.visualEditor.context.getSelection();
				if(selection.length==0){
					this._widget = null;
				}else{
					this._widget = selection[0];
				}
			}else{
				this._widget = null;
			}
				
			this.onWidgetSelectionChange();
		},
		
		onEditorSelected : function(){
			this.initialize();
			
			// only show during HTML editing
			if (this._editor && this._editor.editorID == "davinci.ve.HTMLPageEditor") {		
				this.domNode.style.display = "block";
			} else {
				this.domNode.style.display = "none";
			}
		},
		
		_widgetReplaced : function(newWidget, oldWidget){
			/* Check to see that this is for the same widget
			 * Some widget like Tree update the DataStore but not the widget it's self from smart input
			 * 
			 */
			
			if (this._widget === oldWidget){
				this._widget = newWidget;
				this.onWidgetSelectionChange();
			}
		},
		
		onWidgetSelectionChange : function(){
			var displayName = "";
			
			if(this._widget){
				displayName = widgetUtils.getLabel(this._widget); 
				this.context = this._widget.getContext();
				this.classComboBox.set("disabled", false);
				this.idTextBox.attr("disabled", false); 
			}else{
				this.descNode.innerHTML = veNLS.noSelection;
				dojo.removeClass(this.domNode, "propertiesSelection");
				this.context = null;
				this.classComboBox.set("value", '');
				this.classComboBox.set("disabled", true);
				this.idTextBox.attr("value", ''); 
				this.idTextBox.attr("disabled", true); 
				return;
			}

			this.changing = true;

			// clear out
			this._oldIDName = null;
			this._oldClassName = null;
			
			dojo.addClass(this.domNode, "propertiesSelection");
			this.descNode.innerHTML = displayName;

			if (this._editor && this._editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor"))){
				// Provide a type-in box for the 'class' and ID attribute
				var srcElement = this._widget._srcElement;
				if(srcElement){
					// collect all classes
					var classes = [];

					var docEl = this._widget.getContext().getModel().getDocumentElement();
					if (docEl) {
						var visitor = {
							visit: function(node) {
								// skip the body/html nodes
								if (node.elementType == "HTMLElement" && node.tag != "body" && node.tag != "html") {
									var c = node.getAttribute("class");
									if (c) {
										var classes = dojo.trim(c).split(" ");
										dojo.forEach(classes, dojo.hitch(this, function(className) {
												// remove dupes
												if (dojo.indexOf(this.classes, className) == -1) {
													this.classes.push(className);
												}
										}));
									}
								}
							},
							classes: []
						}

						docEl.visit(visitor);

						dojo.forEach(visitor.classes, function(className) {
								classes.push({name: className});
						});
					}

					// use a simply memory store
					var memstore = new Memory({
							data: classes
					});
					this.classComboBox.set("store", memstore);

					var classAttr = srcElement.getAttribute("class");
					var className = (classAttr && dojo.trim(classAttr)) || "";
					this.classComboBox.set("value", className);
					this._oldClassName = className;

					// id
					var idAttr = this._widget.getId();
					var idName = (idAttr && dojo.trim(idAttr)) || "";
					this._oldIDName = idName;
					this.idTextBox.attr("value", idName); 
				}
			}

			this.changing = false;
		},

		_onChangeIDAttribute : function(){
			if(!this._widget || this.changing){
				return;
			}
			var inputElement = this.idTextBox;
			// make sure id is valid
			if(!inputElement || !inputElement.isValid()){
				return;
			}
			if(this.context)
				this.context.blockChange(false);
			
			var value = inputElement.attr("value");
			if(value !== this._oldIDName ){
				this._oldIDName = value;
				var valuesObject = {};
				valuesObject['id'] = value;
				var command = new ModifyCommand(this._widget, valuesObject, null);
				this.publish("/davinci/ui/widgetPropertiesChanges",{source:this._editor.editor_id, command:command});
			}	
		},
		
		_onChangeClassAttribute : function(){
			if(!this._widget || this.changing){
				return;
			}
			var inputElement = this.classComboBox;
			if(!inputElement){
				return;
			}
			if(this.context)
				this.context.blockChange(false);
			
			var className = inputElement.attr("value");
			if(className !== this._oldClassName ){
				this._oldClassName = className;
				var valuesObject = {};
				valuesObject['class'] = className;
				var command = new ModifyCommand(this._widget, valuesObject, null);
				this.publish("/davinci/ui/widgetPropertiesChanges",{source:this._editor.editor_id, command:command});
			}	
		},

		_onFieldFocus: function() {
			if (this.context) {
				this.context.blockChange(true);
			}
		},

		_onFieldBlur: function() {
			if (this.context) {
				this.context.blockChange(false);
			}
		},

		_onKeyPress: function(e) {
			// dijit textbox doesn't fire onChange for enter
			if (e.keyCode == dojo.keys.ENTER) {
				this._onChangeIDAttribute();
			}
		}
	});
});
