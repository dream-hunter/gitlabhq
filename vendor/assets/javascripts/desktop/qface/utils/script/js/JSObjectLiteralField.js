/**
 * @class JSObjectLiteralField
 * @extends JSExpression
 * @constructor
 */
define( [
	"dojo/_base/declare",
	"qface/utils/script/js/JSExpression",
], function(declare, JSExpression) {

return declare(JSExpression, {

	constructor: function() {
		this.elementType = "JSObjectLiteralField";
		this.name = "";
		this.nameType = "";
		this.initializer = null;
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		if (this.nameType == '(string)')
			s = "'" + this.name + "'";
		else
			s = this.name;
		s = s + " : " + this.initializer.getText(context);
		return s;
	},

	getLabel: function() {
		var s;
		if (this.nameType == '(string)')
			s = "'" + this.name + "'";
		else
			s = this.name;
		s = s + " : " + this.initializer.getLabel();
		return s;
	},

	visit: function(visitor) {
		var dontVisitChildren;
		dontVisitChildren = visitor.visit(this);
		if (!dontVisitChildren) {
			this.initializer.visit(visitor);
		}
		if (visitor.endVisit) {
			visitor.endVisit(this);
		}
	}

});
});
