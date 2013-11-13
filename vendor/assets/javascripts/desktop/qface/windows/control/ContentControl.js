/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare",
	"qface/windows/controlss/Control"
],function(declare,Control) {

    var ContentKind = ContentControl.ContentKind = Enum.declare(["Text","Container"]);

	var ContentControl = declare(Control,{
	    /// <summary>
	    ///     The base class for all controls with a single piece of content.
	    /// </summary>
	    /// <remarks>
	    ///     ContentControl adds Content, ContentTemplate, ContentTemplateSelector and Part features to a Control.
	    /// </remarks>
		"-attributes-" : {
			content : {
				type : Object
			},
			contentKind : {
				type : ContentKind
			},
		},
		
		constructor	: function() {
		}
	});
	
	
	return ContentControl;
	
});	
