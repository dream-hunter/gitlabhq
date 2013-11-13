define([
	"dojo/_base/declare",
	"qface/utils/markup/html/HTMLItem"
], function(declare, HTMLItem) {

return declare(HTMLItem, {

	/**
	 * @class HTMLComment
	 * @constructor
	 * @extends HTMLItem
	 */
	constructor: function(value) {
		this.elementType = "HTMLComment";
		this.value = value || "";
	},

	getText: function(context) {
		var dash = this.isProcessingInstruction ? "":"--";
		return '<!'+dash+this.value+dash+'>';
	}

});
});
