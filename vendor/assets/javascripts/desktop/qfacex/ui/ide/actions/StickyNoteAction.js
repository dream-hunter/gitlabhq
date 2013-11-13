define( [
        "dojo/_base/declare",
    	"qfacex/ui/ide/actions/Action",
    	"qfacex/ui/ide/commands/CompoundCommand",
    	"qfacex/ui/ide/ve/commands/AddCommand",
    	"qfacex/ui/ide/ve/commands/MoveCommand",
    	"qfacex/ui/ide/ve/commands/ResizeCommand",
    	"qfacex/ui/ide/ve/widget",
    	"qfacex/ui/ide/ve/metadata"
], function(declare, Action, CompoundCommand, AddCommand, MoveCommand, ResizeCommand, widgetUtils, Metadata){

return declare( Action, {

	run: function(selection){

		var e = this._workbench.getOpenEditor();
		var descriptor = Metadata.queryDescriptor("html.stickynote");
		if (!descriptor) {
			return;
		}
		var data = dojo.clone(descriptor);
		data.context = e.getContext();
		if (e && e.getContext){
	
			var widget = undefined;
			dojo.withDoc(e.getContext().getDocument(), function(){
				widget = widgetUtils.createWidget(data);
			}/*, this*/);
			if(!widget){
				return;
			}
	
			var command = new CompoundCommand();
			var doc = e.getContext().getDocument();
			var parent = doc.body;
			var container = e.getContext().getContainerNode();
			command.add(new AddCommand(widget,
					/* args.parent ||*/ e.getContext().getContainerNode(),
				 args.index,
				 e.getContext()));
	
//			if(args.position){
//				command.add(new MoveCommand(widget, args.position.x, args.position.y));
			command.add(new MoveCommand(widget, 50, 50));
//			}
			if(/*args.size || */widget.isLayoutContainer){
				// For containers, issue a resize regardless of whether an explicit size was set.
				// In the case where a widget is nested in a layout container,
				// resize()+layout() will not get called during create. 
				var w = args.size && args.size.w,
					h = args.size && args.size.h;
				command.add(new ResizeCommand(widget, w, h));
			}
			e.getContext().getCommandStack().execute(command);
			Metadata.getSmartInput(widget.type).then(function(inlineEdit){			
				if (inlineEdit && inlineEdit.displayOnCreate) {
					e.getContext().select(widget, null, true); // display inline
				} else {
					e.getContext().select(widget); // no inline on create
				}
			}.bind(this));

		}

	},
	
	isEnabled: function(selection){
		var e = this._workbench.getOpenEditor();
		return (e && e.getContext);
	}
});
});
