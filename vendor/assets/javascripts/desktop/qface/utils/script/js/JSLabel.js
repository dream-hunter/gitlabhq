/**
 * @class JSLabel
 * @extends JSElement
 * @constructor
 */
define([
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement",
], function(declare, JSExpression) {

return declare(JSElement, {

	constructor: function() {
		this.elementType = "JSLabel";
		this.nosemicolon = true;
		this.s = name;
	},

	getText: function(context) {
		return this.s + " : ";
	}

});
});

