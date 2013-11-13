/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/04/28
 */
define([
	"dojo/_base/declare",
	"qface/utils/parser/Model"
], function(declare, Model) {

return declare(Model, {

	/**
	 * @class qface/utils/parser/Comment
	 * @extends qface/utils/parser/Model
	 * @constructor
	 */
 	constructor: function() {
		this.elementType = "Comment";
		this.nosemicolon = true;
	},

	addComment: function(type, start, stop, text) {
		if (this.comments == null) {
			this.comments = [];
		}
		this.comments[this.comments.length] = {
				commentType:type,
				start:start,
				stop:stop,
				s:text
		};
	},

	appendComment: function(text) {
		var comment = this.comments[this.comments.length-1];
		comment.s += text;
		comment.stop += text.length;
	},

	getText: function (context) {
		var s="";
		for(var i = 0; i<this.comments.length; i++) {
			if (this.comments[i].commentType == "line") {
				s += "//" + this.comments[i].s + "\n";
			} else if (this.comments[i].commentType == "block") {
				s += "/*" + this.comments[i].s + "*/\n";
			}	
		}
		return s;
	}

});
});
