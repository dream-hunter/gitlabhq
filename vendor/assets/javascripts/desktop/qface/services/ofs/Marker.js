/**  
* @class qface/data/fs/Marker
  * @constructor 
*/
define([
	"dojo/_base/declare",
	"qface/services/ofs/_Resource",
], function(declare, Resource) {

return declare( Resource, {

	constructor: function(resource, type, line, text) {
		this.resource = resource;
		this.type = type;
		this.line = line;
		this.text = text;
	}

});
});
   
