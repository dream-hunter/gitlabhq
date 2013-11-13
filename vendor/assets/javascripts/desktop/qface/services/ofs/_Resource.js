define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/topic",
	"dojo/Deferred",
	"qface/data/Model",
	"qface/lang/Path"
], function(declare,lang,array, topic, Deferred, Model, Path) {

	var  id = 0;

	return declare( Model, {

		/**  
		 * @class qface/services/ofs/Resource
		 * @constructor 
		 * @extends qface/data/Model
		 */
		constructor: function() {
			this.elementType = "Resource";
			this.name = "";
			this._parent = null;
			this._id = "QfacexFileResource"+(++id);
		},

		getName: function() {
			return this.name;
		},

		getPath: function() {
			if (this._parent) {
				return this._parent.getPath() + "/" + this.name;
			}
			return this.name;
		},

		readOnly: function() {
			if (this.hasOwnProperty("_readOnly")) {
				return this._readOnly || (this._parent != null && this._parent.readOnly());
			}
			if( this._parent) {
				return this._parent.readOnly();
			}
			return false;
		},

		getURL: function() {
			var path = this.getPath(),
			    root = this.getRootFolder();
			
			/* need a special flavor or URI Rewrite to encode files with # */
			return  root.toUrl(path);
		},

		getParent : function(){
			return this._parent;
		},

		getRootFolder : function() {
			var root = this;
			while (root._parent) {
				root = root._parent;
			}	
			return root;
		},
		
		visit: function(visitor) {
			var promise;
			var dontVisitChildren = visitor.visit(this);
			if (!dontVisitChildren && this.elementType == "Folder") {
				if (!this._isLoaded) {
					promise = this.getChildren().then(
						lang.hitch(this, function() { 
							array.forEach(this._children, function(child) {
								child.visit(visitor); 
							});
						}));
				} else {
					array.forEach(this._children, function(child) {
						child.visit(visitor);
					});
					promise.resolve();
				}
			} else {
				promise.resolve();
			}	
			return promise;
		},

		visitSync: function(visitor) {
			var dontVisitChildren = visitor.visit(this);
			if (!dontVisitChildren && this.elementType == "Folder") {

				array.forEach(this.getChildrenSync(), function(child) {
					child.visit(visitor, dontLoad);
				});
			}
		},

		rename: function(newName) {
			
			var path = this.getPath();
			var newPath = new Path(path).removeLastSegments().append(newName);
			var root = this.getRootFolder();
			return root._move(path,newPath).then(
				lang.hitch(this,function() {
					this.name = newName;
					topic.publish("/qface/services/ofs/resource/renamed", this);
				})
			);	
		},
		

		renameSync: function(newName) {
			var path = this.getPath();
			var newPath = new Path(path).removeLastSegments().append(newName);
			var root = this.getRootFolder();
			var ex;
			root._move(path,newPath,true).then(
				lang.hitch(this,function() {
					this.name = newName;
					topic.publish("/qface/services/ofs/resource/renamed", this);
				}),
				function(e){
					ex = e;
				}
			);	
			if (ex) {
				throw ex;
			}
		},
		
		delete: function(localOnly) {
			var promise,
				modifyModel = function(){
					var name = this.getName();
					this._parent.children.some(function(child, i, children) {
						if(child.getName() == name) {
							children.splice(i, 1);
							return true;
						}				
					});
		
					topic.publish("/qface/services/ofs/resource/deleted",  this);
				}.bind(this);

			if (localOnly) {
				promise = new Deferred();
				modifyModel();
				promise.resolve();
			} else {
				var path = this.getPath();
				var root = this.getRootFolder();
				promise = root._remove(
					path
				).then(
					modifyModel
				);
				
			}
			return promise;
		},

		deleteSync: function(localOnly) {
			var modifyModel = function(){
					var name = this.getName();
					this._parent.children.some(function(child, i, children) {
						if(child.getName() == name) {
							children.splice(i, 1);
							return true;
						}				
					});
		
					topic.publish("/qface/services/ofs/resource/deleted",  this);
				}.bind(this);

			if (localOnly) {
				modifyModel();
			} else {
				var path = this.getPath();
				var root = this.getRootFolder();
				var ex;
				promise = root._remove(
					path,
					true
				).then(
					modifyModel,
					function(e){
						ex = e;
					}
				);
				if (ex) {
					throw ex;
				}
			}
		},

		getId: function() {
			return this._id;
		}	
		
	});
});
