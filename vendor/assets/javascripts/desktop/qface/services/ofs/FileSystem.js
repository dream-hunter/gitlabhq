define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/Deferred",
	"qface/lang/Path",
	"qface/services/ofs/_Drive",
	"qface/services/ofs/Folder",
], function(declare,lang,array,Deferred,Path,Drive,Folder) {


	var drives = [];
	var driveRootFolders 

	var parsePathToDrive = function (path) {
		var segments = new Path(path,true);
		var driveName = segments.firstSegment(),
			drive = FileSystem.getDrive(driveName);
		if (!drive) {
			throw new Error("invalide path:"+path);
		}
		segments = segments.removeFirstSegments(1);
		return  {
			"d" : drive,
			"p" : segments.toString()
		};	
	};
	
	var RootFolder = declare(Folder,{

		constructor : function() {
			this._isLoaded = true;
		},
		
		reload: function(){
		},
		_createResourceSync: function(name, isFolder, localOnly) {
		},
		
		findSync: function(name){
			var segments,driveName,drive;
			if (typeof name == 'string') {
				segments = new Path(name);
			} else {
				segments = name;
			}
			driveName = segments.firstSegment();
			segments = segments.removeFirstSegments(1);
			drive = this.getChildSync(driveName);
			if (drive) {
				return drive.findSync(segments);
			}
		},
		
		
		_addChildFolder : function(name) {
			var child = new Folder(name,this);
			this._children.push(child);
		},
		
		_removeChildFolder : function(name) {
			var childIdx=-1;
			name = name.toLowerCase();
			array.some(this._children,function(child,idx){
				var childName = child.getName();
				childName = childName.toLowerCase();

				var match = childName == name;
				if (match) {
					childIdx = idx;
				}

				return match;
			});
			if (childIdx>-1) {
				this._children.splice(childIdx, 1);
			}
		},
		
		/**
		 * @method _created
		 * @param  {String} path
		 * @param  {Boolean} isFolder
		 * @return {dojo/Deferred} 
		 **/
		 _create : function(path,isFolder,sync) {
			var d_p = parsePathToDrive(path),
			  drive=d_p.d,pathInDrive=d_p.p;
			return drive.create(pathInDrive,isFolder,sync);
		},
		
		/**
		 * @method _delete
		 * @param  {String} path
		 * @return {dojo/Deferred} 
		 **/
		_delete : function(path,sync) {
			var d_p = parsePathToDrive(path),
			  drive=d_p.d,pathInDrive=d_p.p;
			return drive.delete(pathInDrive,sync);
		},
		
		/**
		 * @method _move
		 * @param  {String} oldPath
		 * @param  {String} newPath
		 * @return {dojo/Deferred} 
		 **/
		_move : function(oldPath,newPath,sync) {
			var d_p1 = parsePathToDrive(oldPath),
			  drive1=d_p1.d,pathInDrive1=d_p1.p;
			var d_p2 = parsePathToDrive(newPath),
			  drive2=d_p2.d,pathInDrive2=d_p2.p;
			if (drive1 == drive2) {
				return drive1.move(pathInDrive1,pathInDrive2,sync);
			}	
		},
		
		/**
		 * @method _writeFile
		 * @param  {String} path
		 * @param  {String} contents
		 * @return {dojo/Deferred} 
		 **/
		_writeFile : function(path,contents,sync) {
			var d_p = parsePathToDrive(path),
			  drive=d_p.d,pathInDrive=d_p.p;
			return drive.writeFile(pathInDrive,contents,sync);
		},
		
		/**
		 * @method _writeFile
		 * @param  {String} path
		 * @return {dojo/Deferred} 
		 **/
		_readFile: function(path,sync) {
			var d_p = parsePathToDrive(path),
			  drive=d_p.d,pathInDrive=d_p.p;
			return drive.readFile(pathInDrive,sync);
		},
		
		/**
		 * @method _writeFile
		 * @param  {String} path
		 * @return {dojo/Deferred} 
		 **/
		_list:function(path,sync) {
			var d_p = parsePathToDrive(path),
			  drive=d_p.d,pathInDrive=d_p.p;
			return drive.list(pathInDrive,sync);
		}
	});
	
	var root = new RootFolder("",null);
	
	var FileSystem = {
	}
	
	lang.mixin(FileSystem,{
		/**
		 * @method addDrive
		 * @param name 
		 * @param driveClass
		 * @returns  Drive
		 */
		addDrive : function(name,driveClass) {
			var drive = new driveClass(name);
			drives.push(drive);
			root._addChildFolder(name);
			return drive;
		},
		
		/**
		 * @method removeDrive
		 * @param name 
		 * @param driveClass
		 * @returns  Drive
		 */
		removeDrive : function(name) {
			var driveIdx=-1;
			name = name.toLowerCase();
			array.some(drives,function(child,idx){
				var driveName = child.getName();
				driveName = driveName.toLowerCase();

				var match = driveName == name;
				if (match) {
					driveIdx = idx;
				}

				return match;
			});
			if (driveIdx>-1) {
				root._removeChildFolder(name);
				return drives.splice(driveIdx, 1);
			}
		},
		
		/**
		 * @method getDrive
		 * @param name 
		 * @returns  Drive
		 */
		getDrive : function(name) {
			var driveIdx=-1;
			name = name.toLowerCase();
			array.some(drives,function(child,idx){
				var driveName = child.getName();
				driveName = driveName.toLowerCase();

				var match = driveName == name;
				if (match) {
					driveIdx = idx;
				}

				return match;
			});
			if (driveIdx>-1) {
				return drives[driveIdx];
			}
		},
		
		/**
		 * @method listDrive
		 * @returns  Array
		 */
		listDrive: function() {
			return array.map(drives,function(d){
				return d;
			});	
		},
		
		/**
		 * @method findSync
		 * @param name 
		 * @returns  Resource
		 */
		findSync : function(name) {
			return root.findSync(name);
		},
		
		/**
		 * @method getRootFolder
		 * @returns  Folder
		 */
		getRootFolder : function() {
			return  root;
		}
		
	});
	
	return FileSystem;
});

