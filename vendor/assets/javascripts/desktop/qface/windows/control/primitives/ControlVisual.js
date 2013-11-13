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
	"qface/windows/control/primitives/PanelVisual",
	"qface/windows/control/primitives/HorzScrollBarVisual",
	"qface/windows/control/primitives/VertScrollBarVisual"
],function(declare,Geometry,Rect,Ellipse,Line,Polyline,Arrow,Stroke,Fill,PanelVisual,HorzScrollBarVisual,VertScrollBarVisual) {

	var ControlVisual = = declare(PanelVisual,{
		"-privates-"	: {
			/*
			 *@override
			 */
			_clientLeftGetter	:	function() {
				//TODO will be implemented
				return borderWidthLeft + paddingLeft;
			},
			/*
			 *@override
			 */
			_clientTopGetter	:	function() {
				//TODO will be implemented
				return borderWidthTop + paddingTop;
			},
			/*
			 *@override
			 */
			_clientRightGetter	:	function() {
				//TODO will be implemented
				return borderWidthRight + paddingRight + VertScrollBar.width;
			},
			/*
			 *@override
			 */
			_clientBottomGetter	:	function() {
				//TODO will be implemented
				return borderWidthBottom + paddingBottom + HorzScrollBar.height;
			},
			
			_drawBorder : function(g,x,y,w,h,d) {
				var outline = function(g,x,y,w,h,d) {
				    if (this.radius <= 0) return false;
				    var r = this.radius, dt = this.width / 2, xx = x + w - dt, yy = y + h - dt;
				    x += dt;
				    y += dt;
				    g.beginPath();
				    g.moveTo(x - 1 + r, y);
				    g.lineTo(xx - r, y);
				    g.quadraticCurveTo(xx, y, xx, y + r);
				    g.lineTo(xx, yy  - r);
				    g.quadraticCurveTo(xx, yy, xx - r, yy);
				    g.lineTo(x + r, yy);
				    g.quadraticCurveTo(x, yy, x, yy - r);
				    g.lineTo(x, y + r);
				    g.quadraticCurveTo(x, y, x + r, y);
				    return true;
				};
			    if (this.color == null) return;

			    var ps = g.lineWidth;
			    g.lineWidth = this.width;
			    if (this.radius > 0) this.outline(g,x,y,w,h, d);
			    else {
					var dt = this.width / 2;
					g.beginPath();
					g.rect(x + dt, y + dt, w - this.width, h - this.width);
			    }
			    g.setColor(this.color);
			    g.stroke();
			    g.lineWidth = ps;
			},
			
			_drawBackground	: function() {
			},
			
			
			_boundsGetter	: function() {
			},
			
			layout	:	function (target){
			    var sman   = (this.scrollObj == null) ? null : this.scrollObj.scrollManager,
					right  = this.clientRight, 
					top    = this.clientTop, 
					bottom = this.clientBottom, 
					left   = this.clientLeft,
					ww     = this.width  - left - right,  maxH = ww, 
					hh     = this.height - top  - bottom, maxV = hh,
					so     = this.scrollSize,
					vps    = this.vertScrollBar == null ? { width:0, height:0 } : this.vertScrollBar.preferredSize,
					hps    = this.horzScrollBar == null ? { width:0, height:0 } : this.horzScrollBar.preferredSize;

			    // compensate scrolled vertical size by reduction of horizontal bar height if necessary
			    // autoHidded scrollers don't have an influence to layout
			    if (this.horzScrollBar != null && this.autoHide === false &&
					  (so.width  > ww ||
					  (so.height > hh && so.width > (ww - vps.width))))
			    {
					maxV -= hps.height;
			    }
			    maxV = so.height > maxV ? (so.height - maxV) :  -1;
			    
			    // compensate scrolled horizontal size by reduction of vertical bar width if necessary
			    // autoHidded scrollers don't have an influence to layout
			    if (this.vertScrollBar != null && this.autoHide === false &&
					  (so.height > hh ||
					  (so.width > ww && so.height > (hh - hps.height))))
			    {
					maxH -= vps.width;
			    }
			    maxH = so.width > maxH ? (so.width - maxH) :  -1;
			   
			    var sy = this.scrollTop, sx = this.scrollLeft;
			    if (this.vertScrollBar != null) {
					if (maxV < 0) {
					    if (this.vertScrollBar.isVisible()){
							this.vertScrollBar.visible = false;
							sman.scrollTo(sx, 0);
							this.vertScrollBar.position=0;
					    }
					    sy = 0;
					} else {
						this.vertScrollBar.visible = true;
					}	
			    }

			    if (this.horzScrollBar != null){
					if (maxH < 0){
					    if (this.horzScrollBar.isVisible){
							this.horzScrollBar.setVisible(false);
							this.scrollTo(0, sy);
							this.horzScrollBar.position = 0;
					    }
					} else {
						this.horzScrollBar.visible = true;
					}	
			    }


			    if (this.horzScrollBar != null && this.horzScrollBar.isVisible){
					this.horzScrollBar.location = new Location(left, this.height - bottom - hps.height);
					this.hBar.size = new Size(ww - (this.vertScrollBar != null && this.vertScrollBar.isVisible ? vps.width : 0), hps.height);
					this.horzScrollBar.max = maxH;
			    }

			    if (this.vertScrollBar != null && this.vertScrollBar.isVisible){
					this.vertScrollBar.setLocation(this.width - right - vps.width, top);
					this.vertScrollBar.size = new Size(vps.width, hh -  (this.horzScrollBar != null && this.horzScrollBar.isVisible ? hps.height : 0));
					this.vertScrollBar.max = maxV;
			    }
			},
			_draw : function(g,c){
				var state = c.controlState,
					cbg = c.background,
					fill = cbg.getStateValue(state),
					cfont = c.font,
					font = cfont.getStateValue(state),
					cborder = c.border,
					border = cborder.getStateValue(state);
				if (!fill) {
					fill = cbg;
				}
				if (!font) {
					font = cfont;
				}
				if (!border) {
					border = cborder;
				}
				if (border) {
					this._drawBorder(border);
				}
				if (fill) {
					this._drawBackground(fill);
				}
				this.inherited(arguments);
			    var b = c.bg != null && (c.parent == null || c.bg != c.parent.bg);

			    if (c.border && c.border.outline && b && c.border.outline(g, 0, 0, c.width, c.height,c)) {
					g.save();
					g.clip();
					this._drawBackground(g, 0, 0, c.width, c.height, c);
					g.restore();
					b = false;
			    }
			 
			    if (b) { 
					c.bg.paint(g, 0, 0, c.width, c.height, c);
			    }

			    if (c.border && c.border.paint) this._drawBorder(g, 0, 0, c.width, c.height, c);

			    if (c.update) c.update(g);

			    if (c.paint) {
					var left = c.getLeft(), top = c.getTop(), bottom = c.getBottom(), right = c.getRight(), id = -1;
					if(left + right + top + bottom > 0){
					    var ts = g.getTopStack(), cw = ts.width, ch = ts.height;
					    if(cw <= 0 || ch <= 0) return;
					    var cx = ts.x, cy = ts.y, x1 = (cx > left ? cx : left), y1 = (cy > top ? cy : top);
					    id = g.save();
					    g.clipRect(x1, y1, $MMI(cx + cw, c.width - right) - x1,
									       $MMI(cy + ch, c.height - bottom) - y1);
					}
					c.paint(g);
					if (id > 0) g.restore();
			    }
			}
		},
		
		"-attributes-"	:	{
		},
		
		"-methods-"	: {
		},
		
		constructor	:	function(/*Control*/c){
		
		}
	
	});
		
	
	return ControlVisual;
	
});	
