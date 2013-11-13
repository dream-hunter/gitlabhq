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
	"qface/windows/layout/Layout",
	"qface/windows/layout/Region"
],function(declare,Statefu,Layout,Region) {

	var BorderLayout = declare(Layout,{
		"-attributes-" : {
			hgap : {
				type : Number,
				default : 0
			},
			vgap : {
				type : Number,
				default :0
			}			 	
		},
		
		constructor	: function(hgap,vgap) {
		},

		preferredLayoutSize	: function(/*Container*/container) {
			var children = container.children;
            var center = null, west = null,  east = null, north = null, south = null, d = null;
            for(var i = 0; i < children.length; i++){
                var child = children[i];
                if(child.isVisible){
                    switch(child.region) {
                       case Region.Center : center = l;break;
                       case Region.Top    : north  = l;break;
                       case Region.Bottom : south  = l;break;
                       case Region.Left   : west   = l;break;
                       case Region.Right  : east   = l;break;
                       default: throw new Error("Undefined Region: " + l); 
                    }
                }
            }

            var dim = { width:0, height:0 };
            if (east != null) {
                d = east.getPreferredSize();
                dim.width += d.width + this.hgap;
                dim.height = (d.height > dim.height ? d.height: dim.height );
            }

            if (west != null) {
                d = west.getPreferredSize();
                dim.width += d.width + this.hgap;
                dim.height = d.height > dim.height ? d.height : dim.height;
            }

            if (center != null) {
                d = center.getPreferredSize();
                dim.width += d.width;
                dim.height = d.height > dim.height ? d.height : dim.height;
            }

            if (north != null) {
                d = north.getPreferredSize();
                dim.width = d.width > dim.width ? d.width : dim.width;
                dim.height += d.height + this.vgap;
            }

            if (south != null) {
                d = south.getPreferredSize();
                dim.width = d.width > dim.width ? d.width : dim.width;
                dim.height += d.height + this.vgap;
            }
            return dim;
		},

		layoutContainer	: function(/*Container*/parent) {
            var cs = container.clientSize,children = parent.children,
                top = 0, bottom = cs.height,
                left = 0, right = cs.width,
                center = null, west = null,  east = null;

            for(var i = 0;i < children.length; i++){
                var child = children[i];
                if (child.isVisible()) {
                    switch(child.region) {
                        case Region.Center: center = child; break;
                        case Region.Top :
                            var ps = child.getPreferredSize();
                            childl.location = new Location(left, top);
                            child.size = new Size(right - left, ps.height);
                            top += ps.height + this.vgap;
                            break;
                        case Region.Bottom:
                            var ps = child.getPreferredSize();
                            child.location = new Location(left, bottom - ps.height);
                            child.size = new Size(right - left, ps.height);
                            bottom -= ps.height + this.vgap;
                            break;
                        case Region.Left: west = child; break;
                        case Region.Right: east = child; break;
                        default: throw new Error("Invalid constraints: " + l.constraints);
                    }
                }
            }

            if (east != null){
                var d = east.getPreferredSize();
                east.location = new Location(right - d.width, top);
                east.size(d.width, bottom - top);
                right -= d.width + this.hgap;
            }

            if (west != null){
                var d = west.getPreferredSize();
                west.location = new Location(left, top);
                west.size = new Size(d.width, bottom - top);
                left += d.width + this.hgap;
            }

            if (center != null){
                center.location = new Location(left, top);
                center.size = new Size(right - left, bottom - top);
            }
		}
	});
	
	BorderLayout.ChildLayoutData = declare(Layout.ChildLayoutData,{
		// summary:
		//		These properties can be specified for the children of a BorderContainer.

		// region: [const] Region
		//		Values: "top", "bottom", "leading", "trailing", "left", "right", "center".
		//		See the `dijit/layout/BorderContainer` description for details.
		region: '',

		// layoutPriority: [const] Number
		//		Children with a higher layoutPriority will be placed closer to the BorderContainer center,
		//		between children with a lower layoutPriority.
		layoutPriority: 0,

		// splitter: [const] Boolean
		//		Parameter for children where region != "center".
		//		If true, enables user to resize the widget by putting a draggable splitter between
		//		this widget and the region=center widget.
		splitter: false,

		// minSize: [const] Number
		//		Specifies a minimum size (in pixels) for this widget when resized by a splitter.
		minSize: 0,

		// maxSize: [const] Number
		//		Specifies a maximum size (in pixels) for this widget when resized by a splitter.
		maxSize: Infinity
			
	});
	
	return BorderLayout;
	
});	
