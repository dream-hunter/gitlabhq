/**
 * @class Expression
 * @constructor
 * @extends JSElement
 */
define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement"
], function(declare, JSElement) {

return declare(JSElement, {

	constructor: function() {
		this.elementType = "JSExpression";
	},

	getText: function() {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		return s;
	}, 
	add: function(e) {
	}

});
});
