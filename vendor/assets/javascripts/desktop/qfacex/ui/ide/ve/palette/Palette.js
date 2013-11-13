define( [
    "dojo/_base/declare",
	"qfacex/ui/layout/palette/Palette",
	"qfacex/ui/ide/ve/palette/PaletteItem",
	"dojo/i18n!qfacex/ui/ide/ve/nls/common",
	"qfacex/ui/ide/ve/tools/CreateTool"
], function(
	declare,
	QxPalette,
	PaletteItem,
	commonNls,
	CreateTool) {

return declare([QxPalette], {

//	_resource: null,
//	_context: null,
	
	postMixInProperties: function() {
		this._resource = commonNls;
	},
	
	postCreate: function(){
		this.inherited(arguments);
		dojo.subscribe("/davinci/ui/libraryChanged", this, "refresh");
//		dojo.subscribe("/davinci/ui/addedCustomWidget", this, "addCustomWidget");
	},
	
	
	setContext: function(context){
		this._context = context;
		this._loadPalette();
		this.startupKeyNavChildren();

		// setting context will reset
		this.filterField.set("value", "");
		this._filter();
	},

	refresh: function() {
		delete this._loaded;
		this._createFolderTemplate();
		this._createItemTemplate();
		this._createHeader();
		
		if (this._context) {
			this._loadPalette();
			this.startupKeyNavChildren();
		}
	},

	_createPalette: function(component){
		
		//FIXME: Hardcode icons for now. Need to make this into configuration metadata feature.
		//See bug 7642
		var iconFolder = "ve/resources/images/";
		var icon_table = {
			"Dojo Containers":"dojo-objects.png",
			"Dojo Controls":"dojo-objects.png",
			"HTML":"html-widgets.png",
			"Drawing Tools":"drawing-tools-widgets.png",
			"Clip Art":"clipart-widgets.png",
			"Untested Dojo & HTML":"untested.gif",
//			"jQuery UI":"jquery-wdgts.gif",
//			"YUI":"yui-widgets.gif",
			"Lotus One UI":"lts-widgets.gif",
			"Dojox Mobile":"dojox.mobile.cat.gif"
		};
		var defaultIconFile = "fldr_obj.gif";
		var iconFile = icon_table[component.name];
		if(!iconFile){
			iconFile = defaultIconFile;
		}
		
		var iconUri = iconFolder + iconFile;
		var componentIcon = this._getIconUri(component.icon, iconUri);
		
		var opt = {
			paletteId: this.id,
			icon: componentIcon,
			displayName: /* XXX component.provider.getDescriptorString(component.name) ||*/ component.name
		};
		this._createFolder(opt);
		dojo.forEach(component.items, function(item){
	        // XXX For now, we want to keep some items hidden. If item.hidden is set, then don't
	        //  add this item to palette (see bug 5626).
	        if (item.hidden) {
	            return;
	        }

			var opt = {
				icon: item.iconBase64 || this._getIconUri(item.icon, "ve/resources/images/file_obj.gif"),
				displayName:
					item.$library._maqGetString(item.type) ||
					item.$library._maqGetString(item.name) ||
					item.name,
				description: 
				    item.$library._maqGetString(item.type+"_description") || 
				    item.$library._maqGetString(item.name+"_description") || 
					item.description || 
					item.type,
				name: item.name,
				paletteId: this.id,
				type: item.type,
				data: item.data || {name:item.name, type: item.type, properties: item.properties, children: item.children},
				category: component.name
			};
			this._createItem(opt,null,PaletteItem);
		}, this);
	},

	_loadPalette: function(){
		if (this._loaded) { return; }

		var workbench = this._workbench;
		var metadata = workbench.registry.metadata;
		var libraries = metadata.getLibrary();

		// Merge descriptors that have the same category
		// XXX Need a better solution for enumerating through descriptor items and creating
		//    category groups.
		var descriptorObject = {};
		for (var name in libraries) {
			if (libraries.hasOwnProperty(name)) {
				var lib = libraries[name].$wm;
			  if (! lib) {
			  	continue;
			  }

			  dojo.forEach(lib.widgets, function(item) {
			  	// skip untested widgets 
			  	if (item.category == "untested") {
						return;
					}
					
					var category = lib.categories[item.category];

					if (!descriptorObject[category.name]) {
							descriptorObject[category.name] = dojo.clone(category);
							descriptorObject[category.name].items = [];
					}
					var newItem = dojo.clone(item);
					newItem.$library = lib;
					descriptorObject[category.name].items.push(newItem);
			  });
			}
		}
		
		// Force certain hardcoded ones to top: Containers, Controls, Other, Untested, ...
		// FIXME: Need a more flexible approach (versus hardcoding in JavaScript)
		var orderedDescriptors = [];
		var predefined = ["Dojo Containers", "Dojo Controls", "HTML", "Dojox Mobile", "Clip Art", "Drawing Tools", "Untested Dojo & HTML"];
		dojo.forEach(predefined, function(name) {
		    if (descriptorObject[name]) {
		        orderedDescriptors.push(descriptorObject[name]);
		        delete descriptorObject[name];
		    }
		});
		// For any categories other than the hardcoded ones.
		for (var category in descriptorObject) {
            orderedDescriptors.push(descriptorObject[category]);
            delete descriptorObject[category];
        }
		
		this._generateCssRules(orderedDescriptors);
		dojo.forEach(orderedDescriptors, function(component) {
			if (component.name && !this._folders[component.name]) {
				this._createPalette(component);
				this._folders[component.name] = true;
			}
		}, this);
		this._loaded = true; // call this only once
	},
	
	// generate CSS Rules for icons based on this._descriptor
	// TODO: Currently this is used by Outline only, Palette should use
	_generateCssRules: function(descriptor) {
		var sheet = dojo.doc.styleSheets[0]; // This is dangerous...assumes content.css is first position
		if(!sheet){ return; }

		dojo.forEach(descriptor, function(component){
			dojo.forEach(component.items, function(item){
				var iconSrc = item.iconBase64 || this._getIconUri(item.icon, "ve/resources/images/file_obj.gif");
				var selector = "img.davinci_"+item.type.replace(/\./g, "_");
				var rule = "{background-image: url(" + iconSrc + ")}";
				if(dojo.isIE){
					sheet.addRule(selector, rule);
				}else{
					sheet.insertRule(selector + rule, sheet.cssRules.length);
				}
			}, this);
		}, this);
	},
	
	_getIconUri: function(uri, fallbackUri) {
		
	    if (uri) {
	    	/* maybe already resolved */
	    	if(uri.indexOf("http")==0) {
	    		return uri;
	    	}
	    	
	    	return this._workbench.location() + uri;
	    }
	    return require.toUrl("qfacex/ui/ide/" + fallbackUri);
	},
	
	onDragStart: function(e){	
		var workbench = this._workbench;
		var metadata = workbench.registry.metadata;
		var data = e.dragSource.data;
		metadata.getHelper(data.type, 'tool').then(function(ToolCtor) {
			// Copy the data in case something modifies it downstream -- what types can data.data be?
			var tool = new (ToolCtor || CreateTool)(dojo.clone(data.data));
			this._context.setActiveTool(tool);
		}.bind(this));

		// Sometimes blockChange doesn't get cleared, force a clear upon starting a widget drag operation
		this._context.blockChange(false);

		// Place an extra DIV onto end of dragCloneDiv to allow 
		// posting a list of possible parent widgets for the new widget
		// and register the dragClongDiv with Context
		if(e._dragClone){
			dojo.create('div',{className:'maqCandidateParents'}, e._dragClone);
		}
		//FIXME: Attach dragClone and event listeners to tool instead of context?
		this._context.setActiveDragDiv(e._dragClone);
		this._dragKeyDownListener = dojo.connect(document, 'onkeydown', dojo.hitch(this,function(event){
			var tool = this._context.getActiveTool();
			if(tool && tool.onKeyDown){
				tool.onKeyDown(event);
			}
		}));
		this._dragKeyUpListener = dojo.connect(document, 'onkeyup', dojo.hitch(this,function(event){
			var tool = this._context.getActiveTool();
			if(tool && tool.onKeyUp){
				tool.onKeyUp(event);
			}
		}));
	},

    onDragEnd: function(e){
		this.pushedItem = null;
		this._context.setActiveTool(null);
		this._context.setActiveDragDiv(null);
		dojo.disconnect(this._dragKeyDownListener);
		dojo.disconnect(this._dragKeyUpListener);
	},
	
	
	
	});
});
