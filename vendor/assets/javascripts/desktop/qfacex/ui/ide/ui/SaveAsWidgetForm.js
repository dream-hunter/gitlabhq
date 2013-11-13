require({cache:{
'url:qfacex/ui/ide/ui/templates/SaveAsWidgetForm.html':"<div class='dvSaveAsWidgetForm'>\n\t<div class=\"dijitDialogPaneContentArea\">\n\t\t<p class=\"dvSawfDesc\">${descriptionString}</p>\n\t\t<p>\n\t\t\t<span class=\"dvSawfLabel\">${nameString}:</span>\n\t\t\t<input dojoType='dijit.form.ValidationTextBox' dojoAttachPoint=\"nameInputNode\" trim=\"true\"\n\t\t\t\t\tpromptMessage=\"${namePromptString}\"></input>\n\t\t</p>\n\t\t<p>\n\t\t\t<span class=\"dvSawfLabel\"><span class=\"dvRequired\">*</span>${idString}:</span>\n\t\t\t<input dojoType='dijit.form.ValidationTextBox' dojoAttachPoint=\"idInputNode\" trim=\"true\"\n\t\t\t\t\trequired=\"true\" intermediateChanges=\"true\" promptMessage=\"${idPromptString}\"></input>\n\t\t</p>\n\t\t<p>\n\t\t\t<span class=\"dvSawfLabel\">${versionString}:</span>\n\t\t\t<input dojoType='dijit.form.ValidationTextBox' dojoAttachPoint=\"versionInputNode\"\n\t\t\t\t\ttrim=\"true\"></input>\n\t\t</p>\n\t\t<h4 class=\"dvRequired\">*${requiredString}</h4>\n\t\n\t\t<div dojoType=\"dijit.TitlePane\" title=\"${metadataTitle}\" open=\"false\">\n\t\t\t<textarea dojoType=\"dijit.form.SimpleTextarea\" dojoAttachPoint=\"textareaNode\" name=\"metadata\"\n\t\t\t\t\trows=\"15\" cols=\"50\" intermediateChanges=\"true\">${initialTextareaContent}</textarea>\n\t\t</div>\n\t</div>\n  <div class=\"dijitDialogPaneActionBar\">\n    <button dojoType=\"dijit.form.Button\" dojoAttachPoint=\"buttonSave\" class=\"maqPrimaryButton\" type=\"submit\" disabled=\"true\">${saveString}</button>\n    <button dojoType=\"dijit.form.Button\" dojoAttachPoint=\"buttonCancel\" type=\"button\" class=\"maqSecondaryButton\">${cancelString}</button>\n  </div>\n</div>\n"}});
define( ["dojo/_base/declare",
        "dijit/_Templated",
        "dijit/_Widget",
        "dojo/i18n!qfacex/ui/ide/ui/nls/ui",
        "dojo/i18n!dijit/nls/common",
        "dojo/text!./templates/SaveAsWidgetForm.html"
        
        
], function(declare, _Templated, _Widget,  uiNLS, commonNLS, templateString){

	return dojo.declare([ _Widget, _Templated ], {
	    
	    templateString : templateString,
	    widgetsInTemplate : true,
	    
	    postMixInProperties : function() {
	        // perform NLS substitutions
	        var nls = commonNLS;
	        this.descriptionString = nls.sawfDesc;
	        this.nameString = nls.name;
	        this.idString = nls.id;
	        this.versionString = nls.version;
	        this.requiredString = nls.required;
	        this.saveString = nls.save;
	        this.cancelString = nls.cancel;
	        this.metadataTitle = nls.sawfMetadataTitle;
	        
	        this.namePromptString = nls.sawfNamePrompt;
	        this.idPromptString = nls.sawfIdPrompt;
	        
	        // set initial value for textarea
	        this.initialTextareaContent = dojo.toJson(this.metadata, true);
	    },
	    
	    postCreate : function() {
	        this.inherited(arguments);
	        
	        // create onChange connections to the entry fields
	        var connections = [ "nameInputNode", "idInputNode", "versionInputNode", "textareaNode" ];
	        dojo.forEach(connections, function(item) {
	            this.connect(this[item], "onChange", function() {
	                this._onChange(item, arguments[0]);
	            })
	        }, this);
	        
	        // create simple URI validation regex for the "ID" field
	        this.idInputNode.regExp = "[a-zA-Z]+://[^\\s]+";
	        
	        // connect the Cancel button to dismiss the parent dialog
	        this.connect(this.buttonCancel, "onClick", function() {
	            dijit.byId(this.parentId).hide();
	        });
	    },
	    
	    _onChange : function(name, newVal) {
	        switch (name) {
	            case "nameInputNode":
	                this.metadata.name = newVal;
	                break;
	            case "idInputNode":
	                this.metadata.id = newVal;
	                break;
	            case "versionInputNode":
	                this.metadata.version = newVal;
	                break;
	            case "textareaNode":
	                try {
	                    this.metadata = dojo.fromJson(newVal);
	                    this._invalidMetadata = false;
	                } catch (e) {
	                    this._invalidMetadata = true;
	                }
	                break;
	        }
	        
	        // Update the text in the textarea with the new values
	        if (name !== "textareaNode") {
	            this.textareaNode.set("value", dojo.toJson(this.metadata, true));
	        }
	        
	        // set "Save" button state, depending on validity of metadata
	        this.buttonSave.set("disabled", !this._isValid());
	    },
	    
	    _isValid : function() {
	        return this.idInputNode.isValid() && !this._invalidMetadata;
	    }

	});
	
});


