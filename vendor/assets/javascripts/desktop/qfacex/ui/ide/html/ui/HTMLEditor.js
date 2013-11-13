define([
	"dojo/_base/declare",
	"qfacex/ui/ide/ui/ModelEditor",
	/*"qfacex/ui/ide/html/HTMLFile",*/
	"qfacex/ui/ide/model/Factory",
	"qfacex/ui/ide/html/ui/HTMLOutline"
], function(declare, ModelEditor, /*HTMLFile,*/ Factory, HTMLOutline){
 
return declare(ModelEditor, {

	constructor : function(element, fileName) {
		var args = {url:fileName};
		this.htmlFile = Factory.getModel(args); // new HTMLFile();
		this.model = this.htmlFile;

		this._handle = dojo.connect(this.htmlFile.getDocumentElement(), "onkeydown", this, "onKeyDown");
	},

	destroy : function() {
		this.htmlFile.close();
		dojo.disconnect(this._handle);
		this.inherited(arguments);
	},

	getOutline : function() {
		if (!this.outline) {
			this.outline = new HTMLOutline(this.model);
		}
		return this.outline;
	},

	getDefaultContent : function () {
		return "<html>\n <head></head>\n <body></body>\n</html>";
	},

	// dummy to listen to
	onKeyDown: function(e) {
	}
});
});
