define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/js/ui/JSOutlineModel",
	"qfacex/ui/ide/ui/widgets/DavinciModelTreeModel"
], function(declare, JSOutlineModel, DavinciModelTreeModel) {

return declare( null, {

	constructor: function(model) {
		this._jsModel = model;
	},
	
	getModel: function() {
		this._model = new JSOutlineModel(this._jsModel);
		return this._model;
	}

});
});
