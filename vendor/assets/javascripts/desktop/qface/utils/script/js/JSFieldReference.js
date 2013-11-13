define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSExpression"
], function(declare, JSExpression) {

return declare(JSExpression, {

	/**
	 * @class FieldReference
	 * @extends Expression
	 * @constructor
	 */
	constructor: function() {
		this.elementType = "JSFieldReference";
		this.name = "";
		this.receiver = null;
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		return s + this.receiver.getText(context) + "." + this.name;
	},

	visit: function(visitor) {
		var dontVisitChildren;

		dontVisitChildren = visitor.visit(this);
		if (!dontVisitChildren)
			this.receiver.visit(visitor);

		if (visitor.endVisit)
			visitor.endVisit(this);
	}

});
});
