define("maq-metadata-html/html/table/SelectTableAction", [
    	"dojo/_base/declare",
    	"./_TableAction",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/AddCommand",
    	"qfacex/ui/ide/ve/commands/ModifyCommand",
    	"qfacex/ui/ide/ve/widget",
    	"./TableMatrix"
], function(declare, _TableAction, CompoundCommand, AddCommand, ModifyCommand, Widget, TableMatrix){

return declare(_TableAction, {

	name: "selectColumn",
	iconClass: "editActionIcon editSelectTableIcon",
 	
	run: function(context){
		context = this.fixupContext(context);
		if(!context){
			return;
		}
		var sel = this._getCell(context);
		if(!sel){
			return;
		}
		
		var matrix = new TableMatrix(sel);
		var table = matrix.table;
		if (table) {
			context.select(table._dvWidget);
		} else {
			//User must have messed around with elements
			console.error("SelectTableAction: could not find <table> element associated with the selection");
		}
	}
});
});
