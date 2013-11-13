define( [
    	"dojo/_base/declare",
    	"qfacex/ui/ide/actions/Action"
], function(declare, Action){


return declare( [Action], {

	run: function(selection){
		var e = this._workbench.getOpenEditor();
		var context = e.getContext();
		context.visualEditor.toggleOrientation();		
	},
	
	isEnabled: function(selection){
		var e = this._workbench.getOpenEditor();
		if (e && e.getContext){
			var context = e.getContext();
			if(context.getMobileDevice){
				var device = context.getMobileDevice();
				return (device && device != '' && device != 'none' && device != 'desktop');
			}else{
				return false;
			}
		}else{
			return false;
		}
	},
	
	updateStyling: function(){
		var landscape = false;
		var editor = this._workbench.getOpenEditor();
		if(editor){
			var visualEditor = editor.visualEditor;
			if(visualEditor && visualEditor.getOrientation){
				var orientation = visualEditor.getOrientation();
				landscape = (orientation == 'landscape');
			}
		}
		var landscapeClass = 'orientationLandscape';
		if(landscape){
			dojo.addClass(document.body, landscapeClass);
		}else{
			dojo.removeClass(document.body, landscapeClass);
		}
	}
});
});
