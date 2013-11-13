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
var TreeNodeSignVisual = declare(PanelVisual, {
	"-attributes-"	:	{
		"border"	:	{
		},
		"background"	:	{
		},
		"cross"
	},
	
	"-methods-"	:	{
		draw	:	function(gdi){
            this.drawBorder(gdi);
            this.drawBackground(gdi);

            var pen g.setColor(this.color);
            g.lineWidth = 2;
            x+=2;
            w-=4;
            h-=4;
            y+=2;
            g.drawLine(x, y + h/2,x + w, y + h/2);
            if (this.plus) {
                gdi.drawLine((x + w/2, y,x + w/2, y + h);
            }

            g.stroke();
            g.lineWidth = 1;
		}
	}
});

    function () {
        this.$this(true);
    },

    function (plus) {
        this.$this("white", "lightGray", plus);
    },

    function (color, bg, plus) {
        this.color = color;
        this.bg = bg;
        this.plus = plus;
        this.br = new ui.Border("rgb(65, 131, 215)", 1, 3);
    },

    function $prototype() {
        this.paint = function(g, x, y, w, h, d) {
            this.br.outline(g, x, y, w, h, d);

            g.setColor(this.bg);
            g.fill();
            this.br.paint(g, x, y, w, h, d);

            g.setColor(this.color);
            g.lineWidth = 2;
            x+=2;
            w-=4;
            h-=4;
            y+=2;
            g.beginPath();
            g.moveTo(x, y + h/2);
            g.lineTo(x + w, y + h/2);
            if (this.plus) {
                g.moveTo(x + w/2, y);
                g.lineTo(x + w/2, y + h);
            }

            g.stroke();
            g.lineWidth = 1;
        };

        this.getPreferredSize = function() {
            return { width:12, height:12};
        };
    }
]);
		
	
	return TreeNodeSignVisual;
	
});	
