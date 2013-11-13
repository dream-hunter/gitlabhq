define("qfacex/ui/ide/ui/TextEditor", [
	"dojo/_base/declare", 
	"qfacex/ui/ide/ui/Editor"
], function(declare, Editor) {

return declare(Editor, {
	
	constructor: function (element, fileName,existWhenVisible,workbench) {
		this._workbench = workbench;
		this.subscriptions=[];
		this._handles=[];
	},
	
	isActiveEditor: function() {
		return this._workbench.currentEditor == this;
	},

	supports: function (something) {
		return false;
	},
	
	handleChange: function (text) {
		if (this.editorContainer) {
			this.editorContainer.setDirty(true);
		}
		this.isDirty = true;
		this.lastModifiedTime = Date.now();
	},
	
	_onKey: function(e) {
		this._workbench.currentContext = this.editorID;
		return this._workbench.handleKey(e);
	},

	subscribe: function(topic,func) {
		this.subscriptions.push(this._workbench.subscribe(topic,dojo.hitch(this,func)));
	},
	
	destroy: function () {
		this.inherited(arguments);
		this.subscriptions.forEach(dojo.unsubscribe);
		this._handles.forEach(dojo.disconnect);
	},
	
	getDefaultContent: function () {
		return null;
	},
	
	
	getErrors: function () {
		return [];
	},
	
	save: function (isWorkingCopy) {
		var text = this.getText();
		if (this.resourceFile) {
			this.resourceFile.clearMarkers();
			var errors=this.getErrors();
			for (var i=0;i<errors.length;i++)
			{
				var markerType;
				switch (errors[i].id) {
				case "(error)": markerType="error"; break;
				case "(warning)": markerType="warning"; break;
				}
				if (markerType) {
					this.resourceFile.addMarker(markerType,errors[i].line+1,errors[i].reason);
				}
			}
			this.resourceFile.setContent(text,isWorkingCopy);
			if (this.editorContainer) {
				this.editorContainer.setDirty(isWorkingCopy);
			}
			this.isDirty = false;
			this.lastModifiedTime = 0;
		}
	},
	
	
	supports: function(something) {
		return false;
	},
	
	_connect: function(widget,widgetFunction, thisFunction) {
		this._handles.push(dojo.connect(widget,widgetFunction,this,thisFunction));
	}
});
});
