define("maq-metadata-dojo/dojox/mobile/IconMenuCreateTool", [
	"dojo/_base/declare",
	"qfacex/ui/ide/ve/tools/CreateTool",
	"qface/lang/Path",
], function (
	declare,
	CreateTool,
	Path
) {

return declare(CreateTool, {

	create: function(args) {
		var srcDocPath = new Path(this._context._srcDocument.fileName);

		// make the icons realtive to the file we are editing
		dojo.forEach(this._data.children, dojo.hitch(this, function(child) {
				var icon = new Path(child.properties.icon)
				child.properties.icon = icon.relativeTo(srcDocPath.getParentPath(), true).toString();
		}));

		var parent = args.target, parentNode, child;
		while (parent) {
			parentNode = parent.getContainerNode();
			if (parentNode) { // container widget
				break;
			}
			child = parent; // insert before this widget for flow layout
			parent = parent.getParent();
		}

		var index = args.index;
		var position = args.position;
		this._data.context=this._context;

		this._create({parent: parent, index: index, position: position, size: args.size}); 
	}
	
});

});
