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
	"qface/windows/layout/Layout",
	"qface/windows/layout/Alignment",
	"qface/windows/layout/Direction"
],function(declare,Layout,Alignment,Direction) {
	//子どもの部品を横 1 行に並べるレイアウトです。
	var RowLayout = declare(Layout,{
		"-attributes-" : {
			halign : {
				type : Alignment.Horz
				default : Alignment.Horz.Left
			},
			gap : {
				type : Number,
				default : 0
			},
		},
		
		constructor	: function(gap,halign) {

		},

		preferredLayoutSize	: function(/*Container*/parent) {
			var children = parent.children;
            var width = 0, height = 0;
            for(var i = 0; i < children.length; i++){
                var child = children[i];
                var cs = child.getPreferredSize();
                width += (cs.width + (i > 0 ? this.gap : 0));
                if (height < cs.width) height = cs.height;
            }
            return new Size(width,height);
		},

		layoutContainer	: function(/*Container*/parent) {
			var children = parent.children,
            	 s = parent.clientSize,
            	 left = 0;
            for(var i = 0;i < children.length; i++){
                var child = children[i];
                if(child.visible){
                    var cs = child.getPreferredSize(), 
                    	align = child.valign,
                    	height = align == Alignment.Vert.Stretch ? s.height:cs.height,
                    	width = cs.width,
                    	top = Layout.calcTopPosition(height,align,s.height);
                    
                    child.size = new Size(width,Height);
                    child.location = new Location(left,top);
                    left += (width + this.gap);
                }
            }
		}
	});
	
	RowLayout.ChildLayoutData = declare(Layout.ChildLayoutData,{
		valign : {
			type : Alignment.Vert,
			default : Alignment.Vert.Stretch
		}	
	});
	
	return FlowLayout;
	
});	
