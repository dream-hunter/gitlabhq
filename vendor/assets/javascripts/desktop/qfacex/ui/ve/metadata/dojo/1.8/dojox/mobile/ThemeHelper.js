define("maq-metadata-dojo/dojox/mobile/ThemeHelper", [
    "dojo/_base/array",
    "dojo/dom-style",
    "qfacex/ui/ide/model/Path",
    "qfacex/ui/ide/html/HTMLElement",
    "qfacex/ui/ide/html/HTMLText",
    "qfacex/ui/ide/Theme",
    "dojo/_base/sniff"
], function(
    array,
    domStyle,
    Path,
    HTMLElement,
    HTMLText,
    Theme,
    has
) {

return {

	
	onContentChange: function(context, theme){
		if(!context || !context.editor || !context.editor.isActiveEditor()){
			return;
		}
		var userDoc, useBodyFontBackgroundClass;
		if(context && context.rootNode){
			userDoc = context.rootNode.ownerDocument;
		}
		if(theme){
			useBodyFontBackgroundClass = theme.useBodyFontBackgroundClass;
		}
		if(userDoc && useBodyFontBackgroundClass){
			var nodes = userDoc.querySelectorAll('.'+useBodyFontBackgroundClass);
			var body = userDoc.body;
			if(nodes.length>0){
				var props = ['backgroundAttachment', 'backgroundClip', 'backgroundColor', 'backgroundImage', 
				             'backgroundOrigin', 'backgroundPosition', 'backgroundRepeat', 'backgroundSize',
				             'color','fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'fontVariant'];
				// Using setTimeout because BODY style may not be fully baked
				// due to browser quirks with delayed computation of computed style.
				setTimeout(function(){
					var body_style = domStyle.get(body);
					for(var i=0; i<nodes.length; i++){
						var style = nodes[i].style;
						props.forEach(function(prop){
							style[prop] = body_style[prop];
						});
					}
				},50);
			}	
		}
	}
  
};

});
