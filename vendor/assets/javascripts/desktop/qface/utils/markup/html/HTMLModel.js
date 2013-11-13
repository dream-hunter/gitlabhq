define([
	"dojo/_base/declare",
	"qface/utils/parser/Model"
], function(declare, Model) {

	var HTMLModel =  declare( Model, {
	});

	HTMLModel._noFormatElements = {
	    span:true,
	    b:true,
	    it:true
	};

	HTMLModel.escapeXml = function(value) {
	    if(!value){
	        return value;
	    }
	    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	};

	HTMLModel.unEscapeXml = function(value) {
	    if(!value || typeof value !== "string") {
	        return value;
	    }
	    return value.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
	};

	return HTMLModel;

});
