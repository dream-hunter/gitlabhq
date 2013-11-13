define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/Tree",
	"dojo/mouse",
	"qfacex/ui/ide/ui/dnd/DragSource"
], function(declare,lang, DijitTree, mouse, DragSource) {
	
	return declare(DijitTree, {
		postCreate: function(){
			this.inherited(arguments);

			var down = this.dndController.onMouseDown,
				handler = function(oldHandler, event){
					// right clicking does not select in dojo tree, so lets do it ourselves
					if (mouse.isRight(event)) {
						var w = dijit.getEnclosingWidget(event.target);

						// if not in select select the node
						if (this.get("selectedItems").indexOf(w.item) === -1) {
							this.set("selectedItems", [w.item]);
						}
					}

					var stop = dojo.stopEvent;
					dojo.stopEvent = function(){};
					try{
						oldHandler.call(tree.dndController, event);
					}finally{
						dojo.stopEvent = stop;	
					}
				};

			this.dndController.onMouseDown = lang.hitch(null, handler, down);
		},
		_createTreeNode: function(args){
			var treeNode = this.inherited(arguments);
	 		if (dragSources && args.item){
				dragSources.forEach(function(source){
					if (source.dragSource(args.item)){
						var ds = new DragSource(treeNode.domNode, "component", treeNode);
						ds.targetShouldShowCaret = true;
						ds.returnCloneOnFailure = false;
						require([source.dragHandler], function(dragHandlerClass) {
							ds.dragHandler = new dragHandlerClass(args.item);
			                this.connect(ds, "initDrag", function(e){if (ds.dragHandler.initDrag) ds.dragHandler.initDrag(e);}); // move start
							this.connect(ds, "onDragStart", function(e){ds.dragHandler.dragStart(e);}); // move start
							this.connect(ds, "onDragEnd", function(e){ds.dragHandler.dragEnd(e);}); // move end								
						}.bind(this));
					}
		 		}, this);
	 		}
			return treeNode;
		},
		refreshModel: function () {

			// reset the itemNodes Map
			this._itemNodesMap = {};

			// reset the state of the rootNode
			this.rootNode.state = "UNCHECKED";

			// remove the rootNode
			if (this.rootNode) {
				this.rootNode.destroyRecursive();
			}

			// reload the tree
			this._load();			
		}	
	});
	

});
