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
	"qface/data/geom/Geometry",
	"qface/data/geom/Rect",
	"qface/data/geom/Ellipse",
	"qface/data/geom/Line",
	"qface/data/geom/Polyline",
	"qface/data/geom/Arrow",
	"qface/data/styles/Stroke",
	"qface/data/styles/Fill",
	"qface/windows/control/primitives/PanelVisual"
],function(declare,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Fill,PanelVisual) {

var DefEditors = declare(null,{
	"-attributes-"	:	{
	},
	
	"-methods-"	:	{
		getEditor : function(src,item){
			var o = item.value;
			this.tf.setValue((o == null) ? "" : o.toString());
			return this.tf;
		},

		fetchEditedValue : function(src,editor){ 
			return editor.view.target.getValue(); 
		},

		shouldStartEdit : function(src,e){
			return (e.ID == ui.MouseEvent.CLICKED && e.clicks > 1) ||
			       (e.ID == KE.PRESSED && e.code == KE.ENTER);
		}
	
	},


    constructor	:	function (){
        this.tf = new ui.TextField(new zebra.data.SingleLineTxt(""));
        this.tf.setBackground("white");
        this.tf.setBorder(null);
        this.tf.setPadding(0);
    },

});
		
	
	return TreeNodeEditor;
	
});	
