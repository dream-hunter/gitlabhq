define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement",
], function(declare, JSExpression) {

return declare(JSElement, {

	/**
	 * @class VariableFragment
	 * @extends JSElement
	 * @constructor
	 */
	constructor: function() {
		this.elementType = "JSVariableFragment";
		this.name = "";
		this.init = null;
	},

	getText: function(context) {
		var s = "";
		if (this.comment) {
			s += this.printNewLine(context) + this.comment.getText(context);
		}
		if (this.label) {
			s += this.printNewLine(context) + this.label.getText(context);
		}
		s += this.name;
		if (this.init != null) {
			s = s + " = " + this.init.getText(context);
		}
		return s;
	},

	visit: function(visitor) {
		var dontVisitChildren;

		dontVisitChildren = visitor.visit(this);
		if (!dontVisitChildren) {
			if (this.init)
				this.init.visit(visitor);
		}
		if (visitor.endVisit) {
			visitor.endVisit(this);
		}
	}

});
});
