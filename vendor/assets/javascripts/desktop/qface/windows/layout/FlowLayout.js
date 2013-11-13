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
	//FlowLayoutは左から順番に右に向かって子要素を追加していくレイアウトです。
	//右側に追加できなくなった場合には左に戻って1つしたの位置に追加されていきます。
	//FlowLayoutの大きな特徴として追加される子要素のサイズをまったく変更しません。
	//その為、追加される子要素が持っている推奨サイズや明示的に指定したサイズで、
	//そのまま配置されます。
	var FlowLayout = declare(Layout,{
		"-privates-" : {
			_moveChildrenRow	: function(/*Array*/ children, /*int*/ x, /*int*/ y, /*int*/ width, /*int*/ height,
			                       /*int*/ rowStart, /*int*/ rowEnd) {
			  switch (this.halign) {
				  case Alignmeng.Horz.Left:
				      x += 0;
				      break;
				  case Alignmeng.Horz.Center:
				      x += width / 2;
				      break;
				  case Alignmeng.Horz.Right:
				      x += width;
				      break;
			  }
			  for (var i = rowStart ; i < rowEnd ; i++) {
			      var child = children[i];
			      if (child.isVisible()) {
					var cs = child.size,
						align = child.valign,
						cy = Layout.calcTopPosition(cs.height,align,height);
						
					child.location = new Location(x, cy);
					x += cs.width + this.hgap;
			      }
			  }
			  return height;
			}		
		},
		"-attributes-" : {
			halign : {
				type : Alignment.Horz
			},
			valign  : {
				type : Alignment.Vert
			},
			direction : {
				type : Direction
				default : Direction.LeftToRight
			}
			hgap : {
				type : Number,
				default : 0
			},
			vgap : {
				type : Number,
				default :0
			}			 	
		},
		
		constructor	: function() {

		},

		preferredLayoutSize	: function(/*Container*/parent) {
			return parent.size;
		},

		doLayout	: function(/*Container*/ parent) {
			var children = parent.children,
				s = this.preferredLayoutSize(parent), 
				maxwidth = s.width - this.hgap*2,
				x = 0,
				y = this.vgap,
				rowh = 0,
				start = 0;
					

			for(var i = 0;i < children.length; i++){
				var child = children[i];
				if(child.visible){
					var cs = child.getPreferredSize();
					child.size = cs;
					
					
					if ((x == 0) || ((x + cs.width) <= maxwidth)) {
						if (x > 0) {
							x += this.hgap;
						}
						x += cs.width;
						rowh = Math.max(rowh, cs.height);
					} else {
						rowh = this._moveChildrenRow(children, 0, y,maxwidth - x, rowh, start, i);
						x = cs.width;
						y += this.vgap + rowh;
						rowh = cs.height;
						start = i;
					}
				}
			}

		}
	});
	

	FlowLayout.ChildLayoutData = declare(Layout.ChildLayoutData,{
		//Left/Center/Right(Now Stretch is not supported!)
		halign : {
			type : Alignment.Horz,
			default : Alignment.Horz.Center
		},
		wrap : {
			type : Boolean,
			default : true
		}				 	
				
	});

	
	return FlowLayout;
	
});	
