/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare,
	"qface/lang/Alignment
],function(declare,Alignment) {

	var Layout = declare(null,{
		constructor	: function(container,params){
			this._container = container;
	    },
	    
	    getContainer : function() {
	    	return this._container;
	    },
	    invalidate : function() {
	    },
	    
	    /*
	     *�w�肳�ꂽ�R���e�i�̐����T�C�Y�̐��@���v�Z���܂��B�܂܂��R���|�[�l���g�͎w�肳��܂��B
	     *@method
	     *@param {Container} parent �z�u�����R���e�i
	     */
	    preferredLayoutSize : function(/*Container*/parent) {
	    },
	    
	    /*
	     *�w�肳�ꂽ�R���e�i�̍ŏ��T�C�Y�̐��@���v�Z���܂��B�܂܂��R���|�[�l���g�͎w�肳��܂��B
	     *@method
	     *@param {Container} parent �z�u�����R���e�i
	     */
	    minimumLayoutSize : function(parent) {
	    },
	    
	    
	    /*
	     *�w�肳�ꂽ�R���e�i��z�u���܂��B
	     *@method
	     *@param {Container} parent �z�u�����R���e�i
	     */
	    layoutContainer : function(/*Container*/parent) {
	    }
	});
	
	Layout.ChildLayoutData = declare(null,{
		// minSize: [const] Number
		//		Specifies a minimum size (in pixels) for this widget when resized by a splitter.
		minSize: 0,

		// maxSize: [const] Number
		//		Specifies a maximum size (in pixels) for this widget when resized by a splitter.
		maxSize: Infinity
			
	});

	
	Object.mixin(Layout,{
		//
		calcLeftPosition : function(childWidth,halign,containerWidth){
	    	if (halign == Alignment.Horz.Right)  return containerWidth - childWidth;
	    	if (halign == Alignment.Horz.Center)  return (containerWidth - childWidth)/2;
	    	return 0;
		},

		calcTopPosition : function(childHeight,valign,containerHeight){
	    	if (halign == Alignment.Vert.Bottom)  return containerHeight - childHeight;
	    	if (halign == Alignment.Vert.Center)  return (containerHeight - childHeight)/2;
	    	return 0;
		},
		calcMaxPreferredSize : function(/*Container*/parent) {
		    var children = parent.children,maxWidth = 0, maxHeight = 0;
		    for(var i = 0;i < children.length; i++){
		        var child = children[i];
		        if(child.visible){
		            var ps = child.getPreferredSize();
		            if(ps.width > maxWidth) maxWidth = ps.width;
		            if(ps.height > maxHeight) maxHeight = ps.height;
		        }
		    }
		    return { width:maxWidth, height:maxHeight };
		},

		isAncestorOf : function(p,c){
		    for(; c != null && c != p; c = c.parent);
		    return c != null;
		}
	});
	
	return Layout;
	
});	
