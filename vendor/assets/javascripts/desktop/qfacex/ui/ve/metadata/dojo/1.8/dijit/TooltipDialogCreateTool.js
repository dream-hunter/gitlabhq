define("maq-metadata-dojo/dijit/TooltipDialogCreateTool", [
    "dojo/_base/declare",
    "qfacex/ui/ide/ve/tools/CreateTool",
	"qfacex/ui/ide/ve/widget",
	"qfacex/ui/ide/ve/commands/ModifyCommand",
	"qfacex/ui/ide/ve/States"
], function(declare, CreateTool, widget, ModifyCommand, States) {

	return declare(CreateTool, {

	create: function(args){
/*
		var bodyWidget = widget.getWidget(this._context.rootNode),
			target = args.directTarget;
		if(!this._data.properties){
			this._data.properties = {};
		}
		// Name the widget so it can be referenced by a state name
		//this._data.properties.id = dijit.getUniqueId(this._data.type.replace(/\./g,"_"));
		this._data.properties.id = dijit.getUniqueId(this._type.replace(/\./g,"_"));
		this._data.properties.connectId = [];
		if(target && target != this._context.container){
			var connectId = target.getId();
			if(!connectId){
				connectId = "auto_" + dijit.getUniqueId(target.type);
				this._context.getCommandStack().execute(new ModifyCommand(target, {id: connectId}));
			}
			if(connectId){
				this._data.properties.connectId.push(connectId);
			}
		}
		debugger;
		this._data.context = this._context;
		var w = this._create({parent: args.parent});
		var body = States.getContainer();
		States.add(body, "_show:" + w.getId());
*/
	}
});
});
