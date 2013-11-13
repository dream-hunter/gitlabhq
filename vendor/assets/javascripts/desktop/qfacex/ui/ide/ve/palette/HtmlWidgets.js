define([
	"dojo/_base/declare",
	"qfacex/ui/workbench/ViewPart",
	"qfacex/ui/ide/ve/palette/Palette"
], function(declare, ViewPart, Palette){

return declare( ViewPart, {
	constructor: function(params, srcNodeRef){
		this.subscribe("/davinci/ui/editorSelected", this._editorSelected);
	},

	_editorSelected : function (editorChange){
		if( editorChange.editor &&  editorChange.editor.supports("palette")){
			this.setContext( [ editorChange.editor.getContext()]);	
			dojo.removeClass(this.palette.domNode, "dijitHidden");
		}else{
			/* Scroll back to the top of the palette before hiding.  This is needed
			 	due to a Chrome/Mac issue where the palette would not show up if it has
			 	been scrolled down a lot.
			*/
			this.palette.domNode.scrollTop = 0;
			dojo.addClass(this.palette.domNode, "dijitHidden");
		}
	},

	postCreate: function(){
		this.inherited(arguments);
		this.palette = new Palette({_workbench:this._workbench});
		this.palette.descriptors = "dijit,dojox,html,OpenAjax"; // FIXME: parameterize this in plugin data?
		this.setContent(this.palette);
		this.attachToolbar();
		
		this.palette._loadPalette();
		dojo.addClass(this.palette.domNode, "dijitHidden");
		
	},

	setContext: function(context){		
		this.palette.setContext(context[0]);
	}
});
});

