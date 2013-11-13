define([
    	"dojo/_base/declare",
    	"qfacex/ui/ide/ve/actions/ContextAction",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/RemoveCommand",
    	"qfacex/ui/ide/ve/commands/AddCommand",
    	"qfacex/ui/ide/ve/commands/ReparentCommand",
    	"qfacex/ui/ide/ve/widget"
], function(declare, ContextAction, CompoundCommand, RemoveCommand, AddCommand, ReparentCommand, Widget){


return declare([ContextAction], {


	run: function(context){
		context = this.fixupContext(context);
		var newWidget, tag = this.item.surroundWithTagName;
		if(!tag){
			console.error('missing surroundWithTagName');
			return;
		}
		dojo.withDoc(context.getDocument(), function(){
			newWidget = Widget.createWidget({type: "html." + tag, properties: {}, children: [], context: context});
		});
		var command = new CompoundCommand(),
			selection = [].concat(context.getSelection()),
			first = selection[0],
			parent = first.getParent();

		selection.sort(function(a, b){
			return parent.indexOf(a) - parent.indexOf(b);
		});
		command.add(new AddCommand(newWidget, parent, parent.indexOf(first),context));
		dojo.forEach(selection, function(w){
			command.add(new ReparentCommand(w, newWidget, "last"));
		});
		context.getCommandStack().execute(command);
	},

	isEnabled: function(context){
		context = this.fixupContext(context);
		if (context && context.getSelection().length){
			var parent = context.getSelection()[0].getParent(),
				indices = [];
			var siblings = dojo.every(context.getSelection(), function(selection){
				indices.push(parent.indexOf(selection));
				return parent.id == selection.getParent().id;
			});
			if (siblings){
				// return true only if they are sequential
				indices.sort();
				var i,j;
				for(i = indices.shift(); indices.length; i = j){
					j = indices.shift();
					if(j != i + 1){
						return false;
					}
				}
				return true;
			}
		}
		return false;
	}
});
});
