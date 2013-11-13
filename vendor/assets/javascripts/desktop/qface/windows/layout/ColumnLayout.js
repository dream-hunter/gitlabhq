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
	"qface/windows/layout/Location",
	"qface/windows/layout/Size",
	"qface/windows/layout/Alignment",
	"qface/windows/layout/Direction"
],function(declare,Layout,Location,Size,Alignment,Direction) {

	//子要素をを縦1列に並べるレイアウトです
	var ColumnLayout = declare(Layout,{
		attributies :  {
			gap : {
				type	: Number,
				default : 2
			},
			valign : {
				type	: Alignment.Vert,
				default : Alignment.Vert.Top
			}
		},
		
		constructor	: function(gap,valign){
	    },

		preferredLayoutSize	: function(/*Container*/parent) {
			var children = parent.children;
            var width = 0, height = 0;
            for(var i = 0; i < children.length; i++){
                var child = children[i];
                var cs = child.getPreferredSize();
                height += (cs.height + (i > 0 ? this.gap : 0));
                if (width < cs.width) width = cs.width;
            }
            return new Size(width,height);
		},

		layoutContainer	: function(/*Container*/parent) {
			var children = parent.children,
            	 s = parent.clientSize,
            	 top = 0;
            for(var i = 0;i < children.length; i++){
                var child = children[i];
                if(child.visible){
                    var cs = child.getPreferredSize(), 
                    	align = child.halign,
                    	width = align == Alignment.Horz.Stretch ? s.width:cs.width,
                    	height = cs.height,
                    	left = Layout.calcLeftPosition(width,align,s.width);
                    
                    child.size = new Size(width,Height);
                    child.location = new Location(left,top);
                    top += (height + this.gap);
                }
            }
		}
	});
	

	ColumnLayout.ChildLayoutData = declare(Layout.ChildLayoutData,{
		halign : {
			type : Alignment.Horz,
			default : Alignment.Horz.Stretch
		}			
	});

	return ColumnLayout;
	
});	
