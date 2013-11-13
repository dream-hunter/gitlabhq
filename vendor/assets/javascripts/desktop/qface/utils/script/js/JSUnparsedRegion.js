/**
 * @class JSUnparsedRegion
 * @extends JSElement
 * @constructor
 */
define( [
	"dojo/_base/declare",
	"qface/utils/script/js/JSElement",
], function(declare, JSExpression) {

return declare(JSElement, {

	constructor: function() {
		this.elementType = "JSUnparsedRegion";
		this.s = content;
	},

	getText: function(context) {
		return this.s;
	}

});
});
