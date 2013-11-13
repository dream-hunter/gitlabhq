/**
 * @class Case
 * @extends JSElement
 * @constructor
 */
define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement"
], function(declare, JSElement) {

return declare(JSElement, {

	constructor: function() {
		this.elementType = "JSCase";
		this.expr = null;
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		if (this.expr)
			s += "case " + this.expr.getText(context);
		else
			s += "default";
		s = s + " : ";
		return s;

	},

	visit: function(visitor) {
		var dontVisitChildren;

		dontVisitChildren = visitor.visit(this);
		if (visitor.endVisit)
			visitor.endVisit(this);
	}

});
});
