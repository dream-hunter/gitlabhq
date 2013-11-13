define( [
	"dojo/_base/declare"
], function(declare){

return declare( null, {
	item:null,

	run: function(selection){
	},
	
	isEnabled: function(selection){
		return true;
	},
	
	getName: function(){
		return this.item.label;
	}

});
});
