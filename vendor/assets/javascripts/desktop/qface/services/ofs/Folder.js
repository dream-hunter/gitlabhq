define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/topic",
	"dojo/Deferred",
	"qface/services/ofs/_Resource",
	"qface/services/ofs/File"
], function(declare,lang,array,topic, Deferred,Resource, File) {

	var Folder = declare(Resource, {

		 /**  
		  * @class Folder
		  * @constructor 
		  * @extends _Resource
		  */
		constructor: function(name, parent) {
			this.elementType = "Folder";
			this.name = name;
			this._parent = parent;
			this._children = [];
		},

		reload: function(){
			// mark this folder as dirty and reload it next time
			this._isLoaded = false;
		},
		
		createFileSync : function(name,localOnly){
			return this._createResourceSync(name,false);
		},
		
		createFolderSync : function(name,localOnly) {
			return this._createResourceSync(name,true);
		},
		
		_createResourceSync: function(name, isFolder, localOnly) {
			var file;
			if (name != null) {
				file = isFolder ? new Folder(name, this) : new File(name, this);
			} else {
				file = this;
				isFolder = this.elementType == "Folder";
			}
			
			var response = "OK";
			if (!localOnly) {
				var path = this.getPath();
				var root = this.getRootFolder();
				root._create(path,isFolder,true).then(
					function(){
					},
					function(){
						response = "ERROR";
					}
				);		
			}
			
			
			if (response == "OK" && name != null) {
				this._children.push(file);
				delete file._readOnly;
				topic.publish("/qface/services/ofs/resource/created", this);
				return file;
			}else if(response=="EXISTS"){
				/* resource already exists on server, so just be gracefull about it. */
				this._children.push(file);
				delete file._readOnly;
				topic.publish("/qface/services/ofs/resource/created", this);
				return file;
			}else if (response != "OK"){
				throw "Folder.createResource failed: name=" + name + "response=" + response;
			} else {
				delete file._readOnly;
				return this;
			}
		},

		/**
		 * @returns  Deffered
		 */
		getChildren: function() {
			var promise
			if (this._isLoaded) {
			    promise =  new Deferred();
				promise.resolve(this._children);
			} else {
				if (this._loading) {
					promise = this._loading;
				} else {
			    	promise =  new Deferred();
					var path = this.getPath();
					var root = this.getRootFolder();
					this._loading = promise;
					root._list(path).then(
						lang.hitch(this,function(responseObject){
							this._appendFiles(responseObject);
							delete this._loading;
							promise.resolve(this._children);
						}),
						function(err){
							promise.reject(err);
						}
					);
				}
			}
			return promise;
		},

		/**
		 * @returns  Array
		 */
		getChildrenSync: function() {
			if (!this._isLoaded) {
				var path = this.getPath();
				var root = this.getRootFolder();
				root._list(
					path,
					true
				).then(
					function(responseObject){
						this._appendFiles(responseObject);
					}.bind(this),
					function(err){
					});
			}
			return this._children;
		},

		/**
		 * @param name  
		 * @returns  Resource
		 */
		getChild: function(name) {
			var promise
			if (this._isLoaded) {
			    promise =  new Deferred();
				promise.resolve(this._getChild(name));
			} else {
		    	promise =  new Deferred();
				this.getChildren().then(
					lang.hitch(this,function(children){
						promise.resolve(this._getChild(name));
					}),
					function(err){
						promise.reject(err);
					}
				);
			}
			return promise;
		},
				
		/**
		 * @param name  
		 * @returns  Resource
		 */
		getChildSync: function(name) {
			if(!this._isLoaded) {
				this.getChildrenSync();
			}
			return this._getChild(name);
		},
		

		/**
		 * @param responseObject  
		 * @returns
		 */
		_appendFiles: function(responseObject){
			this._children = [];
			array.forEach(responseObject,function(item){
				item.isDir = item.type == "text\/directory";
				item.isNew = false;
				item.isDirty = false;
				item.readOnly = false;
				
				var child = this._getChild(item.name);
				var hasChild = child != null;

				if (item.isDir) {
					if(!hasChild) {
						child = new Folder(item.name,this);
					}
				} else {
					if(!hasChild) {
						child = new File(item.name,this);
					}
				}
				child.link = item.link;
				child.isNew = item.isNew;
				child._readOnly = item.readOnly;
				child.setDirty(item.isDirty);
				if(!hasChild) {
					this._children.push(child);
				}
			}, this);
			this._isLoaded = true;
		},

		/**
		 * @param markerTypes  
		 * @param allChildren  
		 * @returns  Array
		 */
		getMarkers: function(markerTypes,allChildren) {
			var result = [];
			this.visit({visit: function (resource) {
				if (resource.elementType=="File") {
					markers = resource.getMarkers(markerTypes);
					result.concat(markers);
				} else if (!allChildren) {
					return true;
				}
			}}, true);
			return result;
		},

		/**
		 * @param name  
		 * @returns  Resource
		 */
		_getChild: function(name){
			name = name.toLowerCase();

			var result;
			this._children.some(function(child){
				var childName = child.getName();
				childName = childName.toLowerCase();

				var match = childName == name;
				if (match) {
					result = child;
				}

				return match;
			});

			return result;
		},
		
		/**
		 * @param name  Path of resource to find. 
		 * @returns  Resource
		 */
		findSync: function(name){
			ignoreCase = true;
			var seg1 = 0,segments;
			if (typeof name == 'string') {
				segments = name.split('/');
				if (segments[0] == '.'){
					seg1 = 1;
				}
			} else if (name.getSegments) {
				segments = name.getSegments();
				name = name.toString();
			}
			
			var serverFind;
			var resource = this;
			function doFind(){
				for (var i=seg1;i<segments.length;i++){
					var found=null;
					//#23
					if (segments[i] == '..') {
						//parent
						found = resource = resource._parent;
					}else if(segments[i] != '.'){ // check for self
						found = resource = resource.getChildSync(segments[i]);
					} // else it was self so we just increment to the next segment
					// #23
					if (!found) {
					  return;
					}
				}
				return found;			
			}
			
			return doFind();
		}
		

	});

	return Folder;

});
  
