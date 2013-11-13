define( [
	"dojo/_base/declare", 
	"qfacex/ui/ide/ve/RebuildPage"
], function(declare, RebuildPage){

return declare(RebuildPage, {
	
	/* libs should look like:
	 * [{id:'dojo', version '1.8' base:'http://blahblahblah/dojo/'}]
	 * this class will return the modified source
	 * 
	 */
	constructor: function(libs){
		this.libs = libs;
	},

	getLibraryBase: function(id, version){
		for(var name in this.libs){
			var item = this.libs[name];
			if (item.id==id && item.version==version) {
				return item.root;
			}
		}
		return library.getLibRoot(id,version) || "";
	}
	
});
});

