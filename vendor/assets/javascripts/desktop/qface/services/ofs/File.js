 define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/topic",
	"qface/services/ofs/_Resource",
	"qface/services/ofs/Marker"
], function(declare,lang,topic,Resource, Marker) {

return declare( Resource, {

  /**  
   * @class qface/services/ofs/File
   * @constructor 
   * @extends qface/services/ofs/Resource
   */
	constructor: function(name,parent) {
		this.elementType = "File";
		this.name = name;
		this._parent = parent;
		this.markers = [];
		this.extension = name.substr(name.lastIndexOf('.') + 1);
	},

	getExtension: function() {
		return this.extension;
	},

	clearMarkers: function() {
		this.markers = [];
	},

	addMarker: function(type,line,text) {
		this.markers.push(new Marker(this, type, line, text));
	},

	getMarkers: function(markerTypes) {
		var result=[];
		if (this.markers)
			for (var i=0; i<this.markers.length; i++)
			{
				var marker = this.markers[i];
				if (!markerTypes) {
					result.push(marker);
				} else if (typeof markerTypes == 'string') { 
					if (marker.type == markerTypes) {
						result.push(marker);
					}
				} else {
					dojo.forEach(markerTypes,function (type) {
						if (type == marker.type) {
							result.push(marker);
						}
					});
				}
			}
		return result;
	},

	setContent: function(content, isWorkingCopy){
		var workingCopy = isWorkingCopy ? "true" : "false";
		var dirty = isWorkingCopy  ? true : false;
		if (this.isNew && !isWorkingCopy) {
			this.isNew = false;
		}
		var workingCopyExtension = isWorkingCopy ? ".workingcopy" : "";

		var path = this.getPath()+workingCopyExtension;
		var root = this.getRootFolder();
		return root._writeFile(
			path,
			content
		).then(
			lang.hitch(this,function(res){
				this.dirtyResource = dirty;
				topic.publish("/qface/services/ofs/resource/modified",this);
			})
		);
	},

	setContentSync: function(content, isWorkingCopy){
		var workingCopy = isWorkingCopy ? "true" : "false";
		var dirty = isWorkingCopy  ? true : false;
		if (this.isNew && !isWorkingCopy) {
			this.isNew = false;
		}
		var workingCopyExtension = isWorkingCopy ? ".workingcopy" : "";

		var ex;
		var path = this.getPath()+workingCopyExtension;
		var root = this.getRootFolder();
		return root._writeFile(
			path,
			content,
			true
		).then(
			lang.hitch(this,function(res){
				this.dirtyResource = dirty;
				topic.publish("/qface/services/ofs/resource/modified",this);
			}),
			function(e){
				ex = e;
			}
		);
		if (ex) {
			throw ex;
		}
	},
	getText: function() {
		return this.getContentSync();
	},

	getContentSync: function(){
		var path = this.getPath();
		var root = this.getRootFolder();
		var ex;
		root._readFile(
			path,
			true
		).then(
			function(data){
			content = data;
			},
			function(e){
				ex = e;
			}
		);
		
		if (ex) {
			throw ex;
		}
		return content;
	},

	getContent: function() {

		var path = this.getPath();
		var root = this.getRootFolder();
		return root._readFile(path);
	},

	removeWorkingCopy: function() {
		
		if (this.isNew) {
			this.delete(true);
		}
	}
   
});
});

