define([
	"dojo/_base/declare",
	"qface/utils/markup/html/HTMLItem"
], function(declare, HTMLItem) {

return declare( HTMLItem, {

	/**
	 * @class HTMLComment
	 * @constructor
	 * @extends HTMLItem
	 */
	constructor: function(value) {
		this.elementType = "PHPBlock";
		this.value = value || "";
	},

	getText: function(context) {
		return context.excludeIgnoredContent ? "" : this.value;
	}

});
});
