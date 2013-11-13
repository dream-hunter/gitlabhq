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

	var index2point  = function(offset,cols) { return [~~(offset / cols), (offset % cols)]; };
	var indexByPoint = function(row,col,cols){ return (cols <= 0) ?  -1 : (row * cols) + col; };

	var GridLayout = declare(Layout,{
		"-privates-" : {
			getSizes : function(c, isRow){
				var max = isRow ? this.rows : this.cols, res = isRow ? this.rowSizes : this.colSizes;
				res[max] = 0;
				for(var i = 0;i < max; i++){
					res[i] = isRow ? this.calcRowSize(i, c) : this.calcColSize(i, c);
					res[max] += res[i];
				}
				return res;
	        },

			calcRowSize : function(row, /*Container*/parent){
				var max = 0, 
				s = indexByPoint(row, 0, this.cols),
				children = parent.children;
				for(var i = s; i < children.length && i < s + this.cols; i ++ ){
					var child = children[i];
					if(child.isVisible()){
						var h = child.getPreferredSize().height;
						max = (h > max ? h : max);
					}
				}
				return max;
			},

			calcColSize : function(col, /*Container*/parent){
				var max = 0, 
				r = 0, 
				i = 0,
				children = parent.children;
				while((i = indexByPoint(r, col, this.cols)) < children.length){
					var child = children[i];
					if (child.isVisible()) {
						var w = child.getPreferredSize().width;
						max = (w > max ? w : max);
					}
					r++;
				}
				return max;
			}
		},
		
		"-attributes-" : {
			halign : {
				type : Alignment.Horz
			},
			valign  : {
				type : Alignment.Vert
			},
			cols	:{
				type	: Number
			},
			rows	:{
				type	: Number
			},
			hgap	:{
				type	: Number
			},
			vgap	:{
				type	: Number
			}
		},
		constructor	: function(x,y) {
		},


        preferredLayoutSize : function(c){
            return { width : this.getSizes(c, false)[this.cols],
                     height: this.getSizes(c, true) [this.rows] };
        },

        layoutContainer : function(/*Container*/parent){
            var rows = this.rows, cols = this.cols,
                colSizes = this.getSizes(parent, false),
                rowSizes = this.getSizes(parent, true),
                top = 0, left = 0;

            if ((this.mask & pkg.HORIZONTAL) > 0) {
                var dw = c.width - left - c.getRight() - colSizes[cols];
                for(var i = 0;i < cols; i ++ ) {
                    colSizes[i] = colSizes[i] + (colSizes[i] !== 0 ? ~~((dw * colSizes[i]) / colSizes[cols]) : 0);
                }
            }

            if ((this.mask & pkg.VERTICAL) > 0) {
                var dh = c.height - top - c.getBottom() - rowSizes[rows];
                for(var i = 0;i < rows; i++) {
                    rowSizes[i] = rowSizes[i] + (rowSizes[i] !== 0 ? ~~((dh * rowSizes[i]) / rowSizes[rows]) : 0);
                }
            }

            var cc = 0,children = parent.children;
            for (var i = 0;i < rows && cc < children.length; i++) {
                var xx = left;
                for(var j = 0;j < cols && cc < children.length; j++, cc++){
                    var child = children[cc];
                    if(child.isVisible()){
                        var cs   = child.getPreferredSize(),
                            cellW = colSizes[j], cellH = rowSizes[i];

                        cellW -= (arg.left + arg.right);
                        cellH -= (arg.top  + arg.bottom);

                        if (child.halign == Alignment.Horz.Stretch) cs.width  = cellW;
                        if (child.valign == Alignment.Vert.Stretch) cs.height = cellH;
                        child.size = cs;
                        
                        var x = xx  + Layout.calcLeftPosition(cs.width,child.halign, cellW),
                        	y = top + Layout.calcTopPosition(cs.height, child.valign, cellH);
                        xx += colSizes[j];
                    }
                }
                top += rowSizes[i];
            }
        }
	});
	
	GridLayout.ChildLayoutData = declare(Layout.ChildLayoutData,{
		column : {
			type : Number
		},
		row : {
			type : Number
		},
		halign : {
			type : Alignment.Horz,
			default : Alignment.Horz.Stretch
		},		
		valign : {
			type : Alignment.Vert,
			default : Alignment.Vert.Stretch
		}	
	});
	
	return GridLayout;
	
});	
