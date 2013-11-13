define([
	"dojo/_base/declare",
	"qface/utils/markup/css/CSSElement"
], function(declare, CSSElement) {

return declare(CSSElement, {

	constructor: function() {
		this.elementType = "CSSAtRule";
	},

	getCSSFile: function() {
		return this.parent;
	},
	
	getText: function(context) {
		s = "@";
		s = s + this.name + " " + this.value + "\n";
		return s;
	}
});
});
