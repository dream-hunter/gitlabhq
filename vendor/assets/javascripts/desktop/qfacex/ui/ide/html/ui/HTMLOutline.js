define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/html/ui/HTMLOutlineModel"
], function(declare, HTMLOutlineModel){
	
return declare( null, {

	constructor : function(model) {
		this._htmlModel = model;
	},
	
	getModel : function() {
		this._model = new HTMLOutlineModel(this._htmlModel);
		return this._model;
	}

});
});
