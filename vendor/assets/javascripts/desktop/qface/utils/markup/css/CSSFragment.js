define([
	"dojo/_base/declare",
	"qface/utils/markup/css/CSSFile"
], function(declare, CSSFile) {

	return declare(CSSFile, {

		/**  
   		 * @class CSSFragment
		   * @constructor 
		   * @extends CSSFile
		 */
		constructor: function(args) {
			this.elementType = "CSSFile";
			dojo.mixin(this, args);
			if (!this.options) {
				this.options = {
					xmode : 'style',
					css : true,
					expandShorthand : false
				};
			}
			var txt = null;

			if (this.url && this.loader) {
				txt = this.loader(this.url);
			} else if (this.url) {
				var file = this.getResource();
				if (file)
					txt = file.getText();
			}
			if (txt) {
				this.setText(txt);
			}
		}

	});
});
