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
	"dojo/touch"
],function(declare,touch) {

	var Manager = declare(null,{
        _$timers : null,

		constructor : function() {
			this.timers = {};
		},
		
        repaint : function(c,x,y,w,h){
            if (arguments.length == 1) {
                x = y = 0;
                w = c.width;
                h = c.height;
            }

            if (w > 0 && h > 0 && c.isVisible === true){
                var r = $cvp(c, temporary);
                if (r == null) return;
                MB.intersection(r.x, r.y, r.width, r.height, x, y, w, h, r);
                if (r.width <= 0 || r.height <= 0) return;
                x = r.x;
                y = r.y;
                w = r.width;
                h = r.height;

                var canvas = pkg.findCanvas(c);
                if(canvas != null){
                    var p = L.getAbsLocation(x, y, c), x2 = canvas.width, y2 = canvas.height;

                    x = p[0];
                    y = p[1];
                    if(x < 0) {
                        w += x;
                        x = 0;
                    }
                    if(y < 0) {
                        h += y;
                        y = 0;
                    }

                    if (w + x > x2) w = x2 - x;
                    if (h + y > y2) h = y2 - y;

                    if (w > 0 && h > 0)
                    {
                        var da = canvas.da;
                        if(da.width > 0) {
                            if (x >= da.x && y >= da.y && x + w <= da.x + da.width && y + h <= da.y + da.height) { 
                                return;
                            }
                            MB.unite(da.x, da.y, da.width, da.height, x, y, w, h, da);
                        }
                        else MB.intersection(0, 0, canvas.width, canvas.height, x, y, w, h, da);

                        if (da.width > 0 && !$timers[canvas]) {
                            var $this = this;
                            $timers[canvas] = setTimeout(function() {
                                $timers[canvas] = null;
                                var context = canvas.graph;

                                try {
                                    canvas.validate();
                                    context.save();

                                    //!!!! debug
                                    //zebra.print(" ============== DA = " + canvas.da.y );
                                    // var dg = canvas.canvas.getContext("2d");
                                    // dg.strokeStyle = 'red';
                                    //dg.beginPath();
                                    //dg.rect(da.x, da.y, da.width, da.height);
                                    // dg.stroke();

                                    context.clipRect(canvas.da.x, canvas.da.y, canvas.da.width, canvas.da.height);
                                    $this.paint(context, canvas);
                                    context.restore();
                                    canvas.da.width = -1; //!!!
                                }
                                catch(e) { zebra.print(e); }
                            }, 50);
                        }
                        if (da.width > 0) canvas.repaint(da.x, da.y, da.width, da.height);
                    }
                }
            }
        },

        paint : function(g,c){
            var dw = c.width, dh = c.height, ts = g.getTopStack();
            if(dw !== 0 && dh !== 0 && ts.width > 0 && ts.height > 0 && c.isVisible){
                c.validate();

                g.save();
                g.translate(c.x, c.y);
                g.clipRect(0, 0, dw, dh);

                ts = g.getTopStack();
                var c_w = ts.width, c_h = ts.height;
                if (c_w > 0 && c_h > 0) {
                    this.paintComponent(g, c);
                    var count = c.kids.length, c_x = ts.x, c_y = ts.y;
                    for(var i = 0; i < count; i++) {
                        var kid = c.kids[i];
                        if (kid.isVisible) {
                            var kidX = kid.x, kidY = kid.y,
                                iw = $MMI(kidX + kid.width,  c_x + c_w) - (kidX > c_x ? kidX : c_x),
                                ih = $MMI(kidY + kid.height, c_y + c_h) - (kidY > c_y ? kidY : c_y);

                            if (iw > 0 && ih > 0) this.paint(g, kid);
                        }
                    }
                    if (c.paintOnTop) c.paintOnTop(g);
                }

                g.restore();
            }
	    },
        compEnabled : function(t) { 
        	this.repaint(t); 
        };

        compShown : function(t){
            if (t.isVisible) this.repaint(t);
            else {
                if (t.parent != null) this.repaint(t.parent, t.x, t.y, t.width, t.height);
            }
        },

        compSized : function(t, pw, ph){
            if (t.parent != null) {
                this.repaint(t.parent, t.x, t.y, (t.width > pw) ? t.width : pw, (t.height > ph) ? t.height : ph);
            }
        },

        compMoved : function(t, px, py){
            var p = t.parent, w = t.width, h = t.height;
            if(p != null && w > 0 && h > 0){
                var x = t.x, y = t.y, nx = x < px ? x : px, ny = y < py ? y : py;
                
                //!!! some mobile browser has bug: moving a component leaves 0.5 sized traces 
                //!!! to fix it 1 pixel extra has to be added to all isdes of repainted rect area
                nx--;
                ny--;

                if (nx < 0) nx = 0;
                if (ny < 0) ny = 0;

                this.repaint(p, nx, ny, $MMI(p.width - nx, w + (x > px ? x - px : px - x)) + 2,
                                        $MMI(p.height - ny, h + (y > py ? y - py : py - y)) + 2);
            }
        },

        paintComponent : function(g,c){
            var b = c.bg != null && (c.parent == null || c.bg != c.parent.bg);

            if (c.border && c.border.outline && b && c.border.outline(g, 0, 0, c.width, c.height,c)) {
                g.save();
                g.clip();
                c.bg.paint(g, 0, 0, c.width, c.height, c);
                g.restore();
                b = false;
            }
         
            if (b) { 
                c.bg.paint(g, 0, 0, c.width, c.height, c);
            }

            if (c.border && c.border.paint) c.border.paint(g, 0, 0, c.width, c.height, c);

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
        },
        createVisual : function() {
        }
	    
	});
	
	return Manager;
	
});	