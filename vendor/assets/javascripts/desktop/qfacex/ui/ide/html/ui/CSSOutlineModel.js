define( [
	"dojo/_base/declare",
	"qfacex/ui/ide/ui/widgets/DavinciModelTreeModel"
], function(declare, DavinciModelTreeModel){
	
return declare(DavinciModelTreeModel, {

	_childList: function(item) {
		var children=[];

		switch(item.elementType) {
		case "CSSFile":
			children = item.children;
			break;
		case "CSSRule":
			children = item.properties;
			break;
		default:
		}

		return children;
	}

});
});
