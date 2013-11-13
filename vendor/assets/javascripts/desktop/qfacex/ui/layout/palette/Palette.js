define( [
    "dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_KeyNavContainer",
	"dijit/Tooltip",
	"dijit/form/TextBox",
	"qfacex/ui/dnd/DragSource",
	"qfacex/ui/layout/palette/PaletteFolder",
	"qfacex/ui/layout/palette/PaletteItem"
], function(
	declare,
	WidgetBase,
	_KeyNavContainer,
	Tooltip,
	TextBox,
	DragSource,
	PaletteFolder,
	PaletteItem
) {

return declare( [WidgetBase, _KeyNavContainer], {

	descriptors: "", // "fooDescriptor,barDescriptor"
//	_resource: null,
//	_context: null,
//	_folders: {}, //FIXME: not instance safe
//	_folderNodes: {}, //FIXME: not instance safe
	
	constructor : function() {
		this._folders = {};
		this._folderNodes = {};
	},
	
	postCreate: function(){
		dojo.addClass(this.domNode, "dojoyPalette");
		this.refresh();
		this.connectKeyNavHandlers([dojo.keys.UP_ARROW], [dojo.keys.DOWN_ARROW]);
	},
	
	refresh: function() {
		alert("1");
	},

	// possible to add descriptor and palette items dynamically
// XXX not used
//	addDescriptor: function(name){
//		
//		//FIXME: Not sure this function ever gets called
//		//FIXME: Bug here. Can't add widgets to an already-existing section
//		dojo.forEach(this._getDescriptor(name), 
//			function(component) { 
//				if (component.category && !this._folders[component.category]) {
//					this._createPalette(component);
//					this._folders[component.category] = true;
//				}
//			},
//			this
//		);
//	},
	
	

	_createFolder: function(opt){
		if(this._folderNodes[opt.displayName]!=null) {
			return this._folderNodes[opt.displayName];
		}

		this._folderNodes[opt.displayName] = new PaletteFolder(opt);
		this.addChild(this._folderNodes[opt.displayName]);
		return this._folderNodes[opt.displayName];
	},
	
	_createFolderTemplate: function(){
		// <DIV class="dojoyPaletteFolder">
		//     <A href="javascript:void(0)"><IMG src="a.gif">label</A>
		// </DIV>
		this.folderTemplate = dojo.create('div',
		        {
		            className: 'dojoyPaletteCommon dojoyPaletteFolder dojoyPaletteFolderLow',
		            innerHTML: '<a href="javascript:void(0)"><img border="0"/></a>'
		        }
		);
	},

	_createItemTemplate: function(){
	    this.itemTemplate = dojo.create('div',
	            {
	                className: 'dojoyPaletteCommon dojoyPaletteItem',
	                innerHTML: '<a href="javascript:void(0)"><img border="0"/></a>'
	            }
	    );
	},

	_createHeader: function(){
		var div = dojo.doc.createElement("div");
		div.className = "dojoyPaletteCommon";

		var input = dojo.doc.createElement("input");
		div.appendChild(input);
		this.domNode.appendChild(div);

		var searchString =  this._resource["filter"]+"...";
		this.filterField = new TextBox({style: "width: 99%", placeHolder: searchString}, input);
		dojo.connect(this.filterField, "onKeyUp", this, "_filter");

	},
	
	_filter: function(e) {
		var value = this.filterField.get("value"),
    	re = new RegExp(value, 'i'),
      action;

      // reset to default state -- only show category headings
	    function resetWidgets(child) {
	    	if (!(child.isInstanceOf(TextBox))) {
	    		var style = child.isInstanceOf(PaletteFolder) ?
	    			'block' : 'none';
	    		dojo.style(child.domNode, 'display', style);
	    	}
	    }

	    // show widgets which match filter text
	    function filterWidgets(child) {
	    	if (child.isInstanceOf(TextBox)) {
	    		// do nothing
	    	} else if (child.isInstanceOf(PaletteFolder)) {
	    		dojo.style(child.domNode, 'display', 'none');
	    	} else if (child.name && re.test(child.name)) {
	    		dojo.style(child.domNode, 'display', 'block');
	    	} else {
	    		dojo.style(child.domNode, 'display', 'none');
	    	}
	    }

	    if (value === '') {
	        action = resetWidgets;
	        dojo.removeClass(this.domNode, 'maqWidgetsFiltered');
	    } else {
	        action = filterWidgets;
	        dojo.addClass(this.domNode, 'maqWidgetsFiltered');
	    }
        this.getChildren().forEach(action);
	},
	
	_hasItem : function(type){
		var children = this.getChildren();
		for(var i=0;i<children.length;i++){
			
			if(children[i].type==type){
				return true; // already exists.
			}
		}
		return false;
	},
	
	_createItem: function(opt,folder,PaletteItemCtoc){
		
		
		
		var node = new (PaletteItemCtoc?PaletteItemCtoc : PaletteItem)(opt);
		if(!folder){
			this.addChild(node);
		}else{
			folder.addChild(node);
		}
		var ds = new DragSource(node.domNode, "component", node);
		ds.targetShouldShowCaret = true;
		ds.returnCloneOnFailure = false;
		this.connect(ds, "onDragStart", dojo.hitch(this,function(e){this.onDragStart(e);})); // move start
		this.connect(ds, "onDragEnd", dojo.hitch(this,function(e){this.onDragEnd(e);})); // move end
		node.tooltip = new Tooltip({
			label:opt.description, 
			connectId:[node.id]
		});
		return node;
	},
	
	onDragStart: function(e){	
	},

    onDragEnd: function(e){
		this.pushedItem = null;
	},
	
	onDragMove: function(e){
		// someone may want to connect to this...
	},

	nop: function(){
		return false;
	},

	__dummy__: null	
});
});
