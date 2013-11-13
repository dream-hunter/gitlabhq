define([
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/_LayerAction"
], function(declare, _LayerAction){


return declare( [_LayerAction], {
	
	name: "hide",
	run: function(context){
		if(!context){
			return;
		}
		var widget = context.getSelection()[0];
		if(!widget){
			return;
		}
		var node = widget.domNode;
		if(dojo.style(node, "visibility") != "hidden"){
			dojo.style(node, "visibility", "hidden");
		}
		if(dojo.style(node, "display") != "none"){
			dojo.style(node, "display", "none");
		}
		context.deselect(widget);
	}
});
});
