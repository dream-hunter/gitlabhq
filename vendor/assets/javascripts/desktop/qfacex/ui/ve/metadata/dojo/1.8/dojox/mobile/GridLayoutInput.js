require({cache:{
'url:maq-metadata-dojo/dojox/mobile/templates/gridLayoutInput.html':"<div>\n  <table>\n    <tr>\n    \t<td>{numberOfRows}</td>\n    \t<td><input data-dojo-type=\"dijit/form/NumberSpinner\" value=\"1\"/></td>\n    </tr>\n    <tr>\n    \t<td>{numberOfCols}</td>\n    \t<td><input data-dojo-type=\"dijit/form/NumberSpinner\" value=\"1\"/></td>\n    </tr>\n  </table>\n</div>\n"}});
define("maq-metadata-dojo/dojox/mobile/GridLayoutInput", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"qfacex/ui/ide/ui/Dialog",
	"qfacex/ui/ide/ve/commands/ModifyCommand",
	"qfacex/ui/ide/ve/input/SmartInput",
	"qfacex/ui/ide/ve/widget",
	"dojo/text!./templates/gridLayoutInput.html",
	"dojo/i18n!dijit/nls/common",
	"dojo/i18n!../../dojox/nls/dojox",
	"dijit/form/NumberSpinner"
], function(
	declare,
	lang,
	query,
	Dialog,
	ModifyCommand,
	SmartInput,
	Widget,
	templateString,
	dijitLangObj,
	dojoxNLS
) {

return declare(SmartInput, {
	show: function(widgetId) {
		this._widget = Widget.byId(widgetId);

		var hideCancel = false;

		if (this._widget.inLineEdit_displayOnCreate){
			// hide cancel on widget creation #120
			delete this._widget.inLineEdit_displayOnCreate;
			hideCancel = true;
		}

		this._inline = Dialog.showDialog(dojoxNLS.gridLayoutInputTitle, this._getTemplate(), null, dojo.hitch(this, "_onOk"), null, hideCancel);

		var spinners = query(".dijitSpinner", this._inline.containerNode);

		var cols = this._widget.getData().properties.cols;
		dijit.byNode(spinners[0]).set("value", Math.ceil(this._widget.getData().children.length/cols));
		dijit.byNode(spinners[1]).set("value", cols);
	},

	_onOk: function(e) {
		this.updateWidget();
	},

	updateWidget: function() {
		var context = this._widget.getContext();

		var spinners = query(".dijitSpinner", this._inline.containerNode);

		var rows = dijit.byNode(spinners[0]).get("value");
		var cols = dijit.byNode(spinners[1]).get("value");

		var props = {cols: cols};
		var children = [];

		for (var i = 0; i < Math.ceil(rows*cols); i++) {
			children.push({type: "dojox.mobile.Pane", properties: {}});
		}

		var command = new ModifyCommand(this._widget, props, children, this._widget._edit_context);

		this._widget._edit_context.getCommandStack().execute(command);

		// redraw the box around the widget
		context.select(this._widget, null, false); 
	},

	_getTemplate: function() {
		if (!this._substitutedMainTemplate) {
			this._substitutedMainTemplate = 
				dojo.replace(templateString, {
					numberOfRows: dojoxNLS.numberOfRows,
					numberOfCols: dojoxNLS.numberOfCols
				});
		}
			
		return this._substitutedMainTemplate;
	}
});

});
