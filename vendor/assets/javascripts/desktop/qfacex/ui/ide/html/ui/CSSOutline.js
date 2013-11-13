define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/html/ui/CSSOutlineModel"
], function(declare, CSSOutlineModel){
	
return declare( null, {

	constructor : function(model) {
		this._cssModel = model;
	},

	getModel : function() {
		this._model = new CSSOutlineModel(this._cssModel);
		return this._model;
	}

});
});
