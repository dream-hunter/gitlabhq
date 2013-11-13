define( [
        "dojo/_base/declare",
    	"qfacex/ui/ide/actions/Action",
    	"dojo/i18n!qfacex/ui/ide/ui/nls/ui"
], function(declare, Action, uiNls){

return declare( Action, {

	run: function() {
		// do nothing
	},
	
	getName: function(){
		return "";
		//var name = Runtime.getUserDisplayName();    
		//return uiNls.User+': '+'<i>'+name+'</i>';
	}
});
});
