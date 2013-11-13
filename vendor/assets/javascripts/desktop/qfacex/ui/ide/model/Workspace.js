define( ["require",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/Deferred",
        "qface/lang/Path",
        "qface/services/ofs/FileSystem"

],function(require, declare,lang, xhr, Deferred, Path,FileSystem){
	var Workspace = declare(null,{

		_currentProject : "project1",
		root: null,

		__CASE_SENSITIVE: false,

		constructor :function(args) {
			if (args && args.project) {
				this._currentProject = args.project;
			}
		},
		
		
		getCurrentProject : function() {
			return this._currentProject;
		},
		
		setCurrentProject : function(project) {
			if (this._currentProject != project) {
				this._currentProject = project;
				this.root = null;
			}	
		},
		
		resourceChanged: function(type,changedResource){
			
			if(changedResource == this.getRoot()){
				changedResource.reload();
				this.getRoot().getChildrenSync();
				return this.getRoot();
			}else if (type == 'created' || type == 'deleted' || type == 'renamed' || type == 'updated' || type=='reload'){
				var parent, resourcePath;
				
				if(changedResource.parent){
					/* already created model object */
					parent = changedResource.parent;
					resourcePath = changedResource.getPath();
				}else{
					/* find the resource parent */
					var p1 = new Path(changedResource).removeLastSegments();
					parent = this.findSync(p1.toString()) || this.getRoot();
					resourcePath = changedResource;
				}
				/* if deleting a folder, delete it's children first.  this is for the dijit tree 
				 * (which seems to cache the object) issue #1780 */
				if(type=='deleted' && changedResource.elementType=='Folder'){
					this.onChildrenChange(changedResource,[]);
				}
				
				if(parent.elementType=="Folder" && type=='reload'){
					/* 'reload' forces a full parent reload.  most model actions handle the server
					 * command and the modeling commands, so forcing a client & server resource sync isn't usually neccisary.
				     */
					parent.reload();
				}

				if (type == "renamed") {
					this.onChange(changedResource);
				}
				
				/* force the resource parent to update its children */
				parent.getChildrenSync();
			}
			
			if(type=='deleted'){
				/* make sure the resource tree has 'deselected' the deleted resource */
				var resourceTree = dijit.byId('resourceTree');
				resourceTree.attr('selectedItem', null);
			}
		},

		/*
		 * generates text content of a given type with options
		 * 
		 * @param type html, js, css etc..
		 * @param options Object {'theme':'claro'}
		 * 
		 */
		createText: function(type, options){
	//		switch(type){
	//		default:
				return "";
	//		}
		},
		
		createResource: function(fullPath,  isFolder, parent){
			var namesplit = fullPath.split("/");
			parent = parent || this.getWorkspace();
			var length = !isFolder? namesplit.length-1 : namesplit.length;
				for(var i=0;i<length;i++){
					if(namesplit[i]=="." || namesplit[i]=="") {
						continue;
					}
					
					var folder = parent.getChildSync(namesplit[i]);
					if(folder!=null){
						parent = folder;
					}else{
						parent = parent.createFolderSync(namesplit[i]);
					}
				}
				if(!isFolder){
					parent = parent.createFileSync(namesplit[namesplit.length-1]);
				}
			return parent;
		},
		
		listProjects: function(onComplete, onError){
			
			var ws =  this.getWorkspace();
			
			return ws.getChildren().then(onComplete, onError);
		},
		
		createProject: function(projectName, initContent, eclipseSupport){
			return xhr.get({
				url: "/backend/cmd/createProject", //modified by LWF
				handleAs: "text",
				content: {name: projectName, initContent: initContent, eclipseSupport: eclipseSupport}
			});
		},
		
		/* Resource tree model methods */
		newItem: function(/* Object? */ args, /*Item?*/ parent){
		},
		
		pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
		},
		
		
		onChange: function(/*dojo.data.Item*/ item){
		},
		
		onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
	//		console.log("parent:" + parent + " children :" + newChildrenList);
		},
		
		getLabel: function(/*dojo.data.Item*/ item){
			
			var label=item.getName();
			if (item.link){
				label=label+'  ['+item.link+']';
			}
			return label;
		},

		getIdentity: function(/* item */ item){
			return item.getId();
		},
		
		destroy: function(){
			this.subscriptions.forEach(dojo.unsubscribe);
		},
			
		mayHaveChildren: function(/*dojo.data.Item*/ item){
		    return item.elementType=="Folder";
		},

		getRoot: function(onComplete, onError){
			if (!this.root){
				var workspace = this.getWorkspace(); 
				var project = this.getCurrentProject(); 
				return  workspace.getChild(project).then(
					lang.hitch(this,function(child) {
						this.root = child;
						if(onComplete){
							onComplete(this.root);
						};
						
					})
				)	

			} else {
				if(onComplete){
					onComplete(this.root);
				};
			}
			
		},
		
		getWorkspace: function(){
			if(!this.workspace){
				this.workspace = FileSystem.findSync("/MySpace/_AppData/QfaceIDE/ws");
			}
			return this.workspace;
		},

		getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete, /*function*/ onError){
			return parentItem.getChildren().then(onComplete, onError);
		},

		copy: function(sourceFile, destFile, recurse){
			var path = sourceFile.getPath? sourceFile.getPath() : sourceFile;
			var destPath = destFile.getPath? destFile.getPath() : destFile;
			var response = Runtime.serverJSONRequest({
				url:"/backed/cmd/copy",  //modified by LWF
				handleAs:"text", 
				sync:true,
				content:{source:path, dest: destPath, recurse: String(recurse)}
			});
			/* force a reload since we dont really know if this is a file or directory being copied */
			this.resourceChanged("reload", destFile);
		},

		//TODO: use options hash arg in place of root, libs
		download: function(files, archiveName, root, userLibs, options){
			
			/* using a servlet to create the file on the fly from the request, 
			   this will eliminate delay from download click to actual start
			*/
			var libString = "";
			var rootString = "";
			
			if(userLibs) {
				libString = "&libs="+encodeURIComponent(dojo.toJson(userLibs));
			}
			
			if(root) {
				rootString = "&root="+ encodeURIComponent(root);
			}

			if (options) {
				for (var name in options) {
					rootString += "&" + encodeURIComponent(name) + "=" + encodeURIComponent(options[name]);
				}
			}
			
			window.location.href= "/backend/cmd/download?fileName=" + archiveName + rootString + "&resources="+encodeURIComponent(dojo.toJson(files))+libString; //modified by LWF
		},
		
		
		/**
		 * @param name  Path of resource to find.  May include wildcard.
		 * @param ignoreCase
		 * @param inFolder  String or Resource object in which to start search.
		 * @returns  Promise
		 */
		findResourceAsync: function(name, ignoreCase, inFolder, workspaceOnly) {
			// Deferred API placeholder until we have a real async implementation
			var promise = new Deferred();
			var resource = this.findResource(name, ignoreCase, inFolder, workspaceOnly);
			promise.resolve(resource);
			return promise;
		},

		/**
		 * @param name  Path of resource to find.  May include wildcard.
		 * @param ignoreCase
		 * @param inFolder  String or Resource object in which to start search.
		 * @returns  Resource
		 */
		findSync: function(name, ignoreCase, inFolder, workspaceOnly){
			var ws =  this.getWorkspace();

			return ws.findSync(name);
		},

		alphabeticalSort: function(items){
			return items.sort(function(a,b) {
				a = a.name.toLowerCase();
				b = b.name.toLowerCase();
				return a < b ? -1 : (a > b ? 1 : 0);
			});
		}
	});

	return Workspace;
});
