define([
	"dojo/_base/declare",
	"qfacex/widgets/WidgetLite",
	"qfacex/ui/workbench/WorkbenchPart"
], function(declare, WidgetLite,WorkbenchPart) {

/**
 * This class is a base class for various pieces of the Properties palette
 * (i.e., pieces of SwitchingStylingViews.js).
 * At the time of writing this note, it is used by:
 *   davinci/ve/widgets/CommonProperties.js
 *   davinci/ve/widgets/EventSelection.js
 *   davinci/ve/widgets/WidgetProperties.js
 *   davinci/ve/widgets/WidgetToolBar.js
 */
return declare( [WidgetLite,WorkbenchPart], {
	/* selected editor */
	_editor : null,
	/* selected widget */
	_widget : null,
	/* selected sub widget */
	_subWidget : null,

	constructor: function(params, srcNodeRef){
    	
    	this.subscribe("/davinci/ui/editorSelected", this._editorSelected);
		this.subscribe("/davinci/ui/widgetSelected", this._widgetSelectionChanged);
	},
	
	_widgetSelectionChanged: function (changeEvent){
		if(	!this._editor ) {
			return;
		}
		var widget=changeEvent[0];
		if(widget && this._widget == widget && this._subwidget==widget.subwidget) {
			return false;
		}
		this._widget = widget;
		this._subwidget = widget && widget.subwidget;
		if(this.onWidgetSelectionChange) {
			this.onWidgetSelectionChange();
		}
	},

	_editorSelected: function(editorChange){
		this._editor = editorChange.editor;
		if(this.onEditorSelected) {
			this.onEditorSelected(this._editor);
		}
	 }
});
});
