define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSExpression"
], function(declare, JSExpression) {

return declare(JSExpression, {

	/**
	 * @class EmptyExpression
	 * @extends Expression
	 * @constructor
	 */
	constructor: function() {
		this.elementType = "JSEmptyExpression";
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		return s + "";
	}

});
});
