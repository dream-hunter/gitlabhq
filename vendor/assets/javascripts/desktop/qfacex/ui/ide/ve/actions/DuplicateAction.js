define([
	"require",
	"dojo/_base/declare",
	"dojo/dom-style",
	"qfacex/ui/ide/ve/actions/ContextAction",
	"qfacex/ui/ide/commands/CompoundCommand",
	"qfacex/ui/ide/ve/commands/AddCommand",
	"qfacex/ui/ide/ve/commands/MoveCommand",
	"qfacex/ui/ide/ve/widget",
	"qfacex/util/GeomUtils"
], function(require,declare, DomStyle, ContextAction, CompoundCommand, AddCommand, MoveCommand, widgetUtils, GeomUtils){


return declare([ContextAction], {

	run: function(context){
		context = this.fixupContext(context);
		if(context){
			if (!context.isInstanceOf(require("qfacex/ui/ide/ve/Context"))){
				return;
			}
			var selection = this._normalizeSelection(context);
			if(!this.selectionSameParent(selection)){
				return;
			}
			var newselection = [];
			if(selection.length > 0){
				var compoundCommand = new CompoundCommand();
				dojo.forEach(selection, function(w){
					//TODO: GENERALIZE THIS
					var newwidget;
					var d = w.getData({identify:false});
					if(d){
						d.context = context;
						dojo.withDoc(context.getDocument(), function(){
							newwidget = widgetUtils.createWidget(d);
						}, this);
						if(newwidget){
							compoundCommand.add(new AddCommand(newwidget, w.getParent(), undefined,context));
							newselection.push(newwidget);
							var position = (w && w.domNode) ? DomStyle.get(w.domNode, 'position') : null;
							var absolute = (position == 'absolute');
							if(absolute){
								var box = GeomUtils.getMarginBoxPageCoords(w.domNode);
								box.l += 25;	// New versions of absolutely positioned widgets shifted 10px to right
								compoundCommand.add(new MoveCommand(newwidget, box.l, box.t, undefined, undefined, undefined, true));
							}
						}
					}
				});
				context.getCommandStack().execute(compoundCommand);
				dojo.forEach(newselection, function(w, i) {
					context.select(w, i > 0);
				}, this);
			}
		}
	},


	/**
	 * Enable this command if this command would actually make a change to the document.
	 * Otherwise, disable.
	 */
	isEnabled: function(context){
		context = this.fixupContext(context);
		var selection = (context && context.getSelection) ? context.getSelection() : [];
		if(selection.length === 0){
			return false;
		}
		if(!this.selectionSameParent(selection)){
			return false;
		}
		return true;
	},

	shouldShow: function(context){
		context = this.fixupContext(context);
		var editor = context ? context.editor : null;
		return (editor && editor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")));
	},	
	
	/**
	 * Return true if all items in selection share the same parent
	 * @param {Object} selection  currently list of selected widgets
	 */
	selectionSameParent: function(selection){
		if(selection.length === 0){
			return false;
		}
		var firstParent = selection[0].getParent();
		for(var i=0; i<selection.length; i++){
			var widget = selection[i];
			if(widget.getParent() != firstParent){
				return false;
			}
		}
		return true;
	}


});
});
