define([
	"dojo/_base/declare",
	"qface/utils/markup/html/HtmlModel",
	"qface/utils/markup/html/HTMLItem"
], function(declare,HtmlModel, HTMLItem) {

return declare(HTMLItem, {

	/**
	 * @class HTMLAttribute
	 * @constructor
	 * @extends HTMLItem
	 */
	constructor: function() {
		this.elementType = "HTMLAttribute";
		this.name = "";
		this.value = "";
	},

	getText: function(context) {
		if (this.noPersist && !context.includeNoPersist)
			return "";
		var s = this.name;
		var bool = {checked: 1, selected: 1, disabled: 1, readonly: 1, multiple: 1, ismap: 1, autofocus: 1, 
				autoplay: 1, controls: 1, formnovalidate: 1, loop: 1, muted: 1, required: 1
		};
		if (bool[this.name.toLowerCase()]) {
			if (this.value && this.value != "false") {
				s += '="' + this.name + '"';
			} else {
				s = "";
			}
		} else if (!this.noValue) {
			s = s + '="' + HtmlModel.escapeXml(String(this.value)) + '"';
		}
		return s;
	},


	setValue: function(value) {
		this.value = HtmlModel.unEscapeXml(value);
		this.onChange();
	}

});
});
