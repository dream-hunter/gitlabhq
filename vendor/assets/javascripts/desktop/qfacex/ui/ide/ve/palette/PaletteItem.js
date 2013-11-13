define([
	"dojo/_base/declare",
	"qfacex/ui/layout/palette/PaletteItem",
	"qfacex/ui/ide/ve/tools/CreateTool",
	"qfacex/ui/dnd/DragManager",
	"qfacex/util//GeomUtils",
	"qfacex/ui/ide/ve/metadata"
], function(
	declare,
	QxPaletteItem,
	CreateTool,
	DragManager,
	GeomUtils,
	Metadata
){

	return declare( QxPaletteItem,{

		tool: "",

		itemMouseDownHandler: function(e){

			this.inherited(arguments);
				
			DragManager.document = this.palette._context.getDocument();
			var frameNode = this.palette._context.frameNode;
			if(frameNode){
				var coords = dojo.coords(frameNode);
				var containerNode = this.palette._context.getContainerNode();
				DragManager.documentX = coords.x - GeomUtils.getScrollLeft(containerNode);
				DragManager.documentY = coords.y - GeomUtils.getScrollTop(containerNode);
			}

			// pre-fetch helper to warm the cache
			Metadata.getHelper(this.type, 'helper');
		},

		/**
		 * Invoked when user clicks on a widget entry (but not to perform drag/drop).
		 * @param {Event} e
		 */
		itemMouseUpHandler: function(e){
			this.inherited(arguments);

			Metadata.getHelper(this.type, 'tool').then(function(ToolCtor) {
				var tool = new (ToolCtor || CreateTool)(dojo.clone(this.data));
				this.palette._context.setActiveTool(tool);
			}.bind(this));

			var clearItem = function(){
				if(this.palette._contextMouseUpHandler){
					this.disconnect(this.palette._contextMouseUpHandler);
					this.palette._contextMouseUpHandler = null;
				}
				if(this.palette._docMouseUpHandler){
					dojo.disconnect(this.palette._docMouseUpHandler);
					this.palette._docMouseUpHandler = null;
				}
				this.palette.selectedItem = null;
				this.palette.currentItem = null;
				this.flat(this.domNode);
				this.palette._context.dragMoveCleanup();
			}.bind(this);
			
			// Register mouseup handler on user's doc
			this.palette._contextMouseUpHandler = this.connect(this.palette._context, "onMouseUp", function(e){
				clearItem();
			}.bind(this));
			
			// Register mouseup handler on entire Maqetta application
			// Put the doc-level mouseUp handler in setTimeout so that
			// the current mouseup event (this routine) doesn't trigger
			// the doc-level mouseup handler on the very same event.
			setTimeout(function(){
				// If currentItem has a value and user clicked anywhere in Maq app,
				// then turn off everything registered to happen on currentItem.
				this.palette._docMouseUpHandler = dojo.connect(document, "onmouseup", function(e){
					if(this.palette.currentItem){
						clearItem();
						this.palette._context.setActiveTool(null);
					}
				}.bind(this));
			}.bind(this), 0);
		},
		
		/**
		 * Invoked when travelling widget list using arrow keys.
		 * @param {Event} e
		 */
		itemKeyDownHandler: function(e) {
			this.inherited(arguments);
			
			if(e.keyCode != dojo.keys.ENTER){return;}

			Metadata.getHelper(this.type, 'tool').then(function(ToolCtor) {
				var tool = new (ToolCtor || CreateTool)(dojo.clone(this.data)),
					context = this.palette._context;
				context.setActiveTool(tool);
				tool.create({target: context.getSelection()[0], position: {x:50, y:50}});
				context.setActiveTool(null);			
				context.getContainerNode().focus();  // to enable moving with arrow keys immediately
			});

			// pre-fetch helper
			Metadata.getHelper(this.type, 'helper');
		}
	});
});
