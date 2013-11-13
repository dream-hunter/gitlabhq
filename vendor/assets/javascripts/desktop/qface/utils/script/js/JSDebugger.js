define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement"
], function(declare, JSElement) {

return declare(JSElement, {

	/**
	 * @class Debugger
	 * @extends JSElement
	 * @constructor
	 */
	constructor: function(statement) {
		this.elementType = "JSDebugger";
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		return s + "debugger";
	}

});
});
