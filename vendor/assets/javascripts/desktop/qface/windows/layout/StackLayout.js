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
	"qface/lang/Stateful",
	"qface/windows/layout/Layout"
],function(declare,Statefu,Layout) {
	
	//
	var StackLayout = declare(Layout,{
		
		constructor	: function() {
		},

		preferredLayoutSize	: function(/*Container*/parent) {
            return Layout.calcMaxPreferredSize(parent);
		},

		doLayout	: function(/*Container*/parent) {
            var s = parent.clientSize,
            	pos = Location.x0y0,
            	children = parent.children;

            for(var i = 0;i < children.length; i++){
                var child = children[i];
                child.size = s;
                child.location = Location.x0y0;
            }
		}
	});
	
	
	return StackLayout;
	
});	
