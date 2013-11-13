define("qfacex/ui/ide/js/ui/JavaScriptEditor", [
	"dojo/_base/declare",
	"qfacex/ui/ide/js/ui/JavaScriptOutline",
	"qfacex/ui/ide/model/Factory",
	"qfacex/ui/ide/ui/ModelEditor"
], function(declare, JavaScriptOutline, Factory, ModelEditor) {

return declare(ModelEditor, {

	constructor: function(element) {
		this.jsFile = Factory.newJS();
		this.model = this.jsFile;
	},

	getOutline: function() {
		if (!this.outline) {
			this.outline = new JavaScriptOutline(this.model);
		}
		return this.outline;
	},

	getDefaultContent: function() {
		return "function functionName ()\n{\n}\n";
	}

});
});

