/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
/*
* Text
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

define( [
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"./DisplayObject"
], function(dojo,lang,declare,DisplayObject){


	// namespace:
	dojo.global.createjs = dojo.global.createjs||{};
	
	var Text = declare([Visual],{
		/**
		 * Display one or more lines of dynamic text (not user editable) in the display list. Line wrapping support (using the
		 * lineWidth) is very basic, wrapping on spaces and tabs only. Note that as an alternative to Text, you can position HTML
		 * text above or below the canvas relative to items in the display list using the {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
		 * method, or using {{#crossLink "DOMElement"}}{{/crossLink}}.
		 *
		 * <b>Please note that Text does not support HTML text, and can only display one font style at a time.</b> To use
		 * multiple font styles, you will need to create multiple text instances, and position them manually.
		 *
		 * <h4>Example</h4>
		 *      var text = new createjs.Text("Hello World", "20px Arial", #ff7700");
		 *      text.x = 100;
		 *      text.textBaseline = "alphabetic";
		 *
		 * CreateJS Text supports web fonts (the same rules as Canvas). The font must be loaded and supported by the browser
		 * before it can be displayed.
		 *
		 * @class Text
		 * @extends DisplayObject
		 * @constructor
		 * @param {String} [text] The text to display.
		 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
		 * 36px Arial").
		 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
		 * "#F00", "red", or "#FF0000").
		 **/
		constructor : function(text, font, color) {
		  this.initialize(text, font, color);
		},
		
		
	// public properties:
		/**
		 * The text to display.
		 * @property text
		 * @type String
		 **/
		text : "",
		
		/**
		 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial"). 
		 * @property font
		 * @type String
		 **/
		font : null,
		
		/**
		 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
		 * @property color
		 * @type String
		 **/
		color : "#000",
		
		/**
		 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed 
		 * information view the 
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "left".
		 * @property textAlign
		 * @type String
		 **/
		textAlign : "left",
		
		/** The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", 
		 * "ideographic", or "bottom". For detailed information view the 
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "top".
		 * @property textBaseline
		 * @type String
		*/
		textBaseline : "top",
		
		/** The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or 
		 * shrunk to make it fit in this width. For detailed information view the 
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>.
		 * @property maxWidth
		 * @type Number
		*/
		maxWidth : null,
		
		/** If true, the text will be drawn as a stroke (outline). If false, the text will be drawn as a fill.
		 * @property outline
		 * @type Boolean
		 **/
		outline : false,
		
		/** Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0, 
		 * the value of getMeasuredLineHeight is used.
		 * @property lineHeight
		 * @type Number
		 **/
		lineHeight : 0,
		
		/**
		 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null, 
		 * the text will not be wrapped.
		 * @property lineWidth
		 * @type Number
		 **/
		lineWidth : null,
		
	// constructor:
		/**
		 * @property DisplayObject_initialize
		 * @private
		 * @type Function
		 **/
		//DisplayObject_initialize = initialize;
		
		/** 
		 * Initialization method.
		 * @method initialize
		 * @protected
		*/
		initialize : function(text, font, color) {
			//this.DisplayObject_initialize();
			this.text = text;
			this.font = font;
			this.color = color ? color : "#000";
		},
		
		/**
		 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
		 * This does not account for whether it would be visible within the boundaries of the stage.
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 * @method isVisible
		 * @return {Boolean} Whether the display object would be visible if drawn to a canvas
		 **/
		isVisible : function() {
			var hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
			return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
		},

		/**
		 * @property DisplayObject_draw
		 * @private
		 * @type Function
		 **/
		//DisplayObject_draw = draw;
		
		/**
		 * Draws the Text into the specified context ignoring it's visible, alpha, shadow, and transform.
		 * Returns true if the draw was handled (useful for overriding functionality).
		 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
		 * @method draw
		 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
		 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
		 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
		 * into itself).
		 **/
		draw : function(ctx, ignoreCache) {
			//if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
			
			if (this.inherited(arguments)){ return true; }

			if (this.outline) { ctx.strokeStyle = this.color; }
			else { ctx.fillStyle = this.color; }
			ctx.font = this.font;
			ctx.textAlign = this.textAlign||"start";
			ctx.textBaseline = this.textBaseline||"alphabetic";

			this._drawText(ctx);
			return true;
		},
		
		/**
		 * Returns the measured, untransformed width of the text without wrapping.
		 * @method getMeasuredWidth
		 * @return {Number} The measured, untransformed width of the text.
		 **/
		getMeasuredWidth : function() {
			return this._getWorkingContext().measureText(this.text).width;
		},

		/**
		 * Returns an approximate line height of the text, ignoring the lineHeight property. This is based 
		 * on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
		 * @method getMeasuredLineHeight
		 * @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is 
		 * based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
		 **/
		getMeasuredLineHeight : function() {
			return this._getWorkingContext().measureText("M").width*1.2;
		},

		/**
		 * Returns the approximate height of multiline text by multiplying the number of lines against
		 * either the lineHeight (if specified) or getMeasuredLineHeight(). Note that this operation
		 * requires the text flowing logic to run, which has an associated CPU cost.
		 * @method getMeasuredHeight
		 * @return {Number} The approximate height of the drawn multiline text.
		 **/
		getMeasuredHeight : function() {
			return this._drawText()*(this.lineHeight||this.getMeasuredLineHeight());
		},
		
		/**
		 * Returns a clone of the Text instance.
		 * @method clone
		 * @return {Text} a clone of the Text instance.
		 **/
		clone : function() {
			var o = new Text(this.text, this.font, this.color);
			this.cloneProps(o);
			return o;
		},
			
		/**
		 * Returns a string representation of this object.
		 * @method toString
		 * @return {String} a string representation of the instance.
		 **/
		toString : function() {
			return "[Text (text="+  (this.text.length > 20 ? this.text.substr(0, 17)+"..." : this.text) +")]";
		},
		
	// private methods:
		
		/**
		 * @property DisplayObject_cloneProps
		 * @private
		 * @type Function
		 **/
		//DisplayObject_cloneProps = cloneProps;

		/** 
		 * @method cloneProps
		 * @param {Text} o
		 * @protected 
		 **/
		cloneProps : function(o) {
			//this.DisplayObject_cloneProps(o);
			this.inherited(arguments);
			o.textAlign = this.textAlign;
			o.textBaseline = this.textBaseline;
			o.maxWidth = this.maxWidth;
			o.outline = this.outline;
			o.lineHeight = this.lineHeight;
			o.lineWidth = this.lineWidth;
		},

		/** 
		 * @method _getWorkingContext
		 * @protected 
		 **/
		_getWorkingContext : function() {
			var ctx = Text._workingContext;
			ctx.font = this.font;
			ctx.textAlign = this.textAlign||"start";
			ctx.textBaseline = this.textBaseline||"alphabetic";
			return ctx;
		},
		 
		/**
		 * Draws multiline text.
		 * @method _getWorkingContext
		 * @protected
		 * @return {Number} The number of lines drawn.
		 **/
		_drawText : function(ctx) {
			var paint = !!ctx;
			if (!paint) { ctx = this._getWorkingContext(); }
			var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
			var lineHeight = this.lineHeight||this.getMeasuredLineHeight();
			var count = 0;
			for (var i=0, l=lines.length; i<l; i++) {
				var w = ctx.measureText(lines[i]).width;
				if (this.lineWidth == null || w < this.lineWidth) {
					if (paint) { this._drawTextLine(ctx, lines[i], count*lineHeight); }
					count++;
					continue;
				}

				// split up the line
				var words = lines[i].split(/(\s)/);
				var str = words[0];
				for (var j=1, jl=words.length; j<jl; j+=2) {
					// Line needs to wrap:
					if (ctx.measureText(str + words[j] + words[j+1]).width > this.lineWidth) {
						if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
						count++;
						str = words[j+1];
					} else {
						str += words[j] + words[j+1];
					}
				}
				if (paint) { this._drawTextLine(ctx, str, count*lineHeight); } // Draw remaining text
				count++;
			}
			return count;
		},
		
		/** 
		 * @method _drawTextLine
		 * @param {CanvasRenderingContext2D} ctx
		 * @param {Text} text
		 * @param {Number} y
		 * @protected 
		 **/
		_drawTextLine : function(ctx, text, y) {
			// Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
				if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
				else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
			
		}
	});

	/**
	 * @property _workingContext
	 * @type CanvasRenderingContext2D
	 * @private
	 **/
	Text._workingContext = (createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")).getContext("2d");


	return dojo.global.createjs.Text = Text;
});

pkg.TextRender = Class(pkg.Render, zebra.util.Position.PositionMetric, [
    function $prototype() {
        this.owner = null;

        this.getLineIndent = function()  { return 1; };
        this.getLines      = function()  { return this.target.getLines(); };
        this.getLineSize   = function(l) { return this.target.getLine(l).length + 1; };
        this.getLineHeight = function(l) { return this.font.height; };
        this.getMaxOffset  = function()  { return this.target.getTextLength(); };
        this.ownerChanged  = function(v) { this.owner = v; };
        this.paintLine     = function(g,x,y,line,d) { g.fillText(this.getLine(line), x, y + this.font.ascent); };
        this.getLine       = function(r) { return this.target.getLine(r); };

        this.targetWasChanged = function(o,n){
            if (o != null) o._.remove(this);
            if (n != null) {
                n._.add(this);
                this.invalidate(0, this.getLines());
            }
            else this.lines = 0;
        };

        this.getValue = function(){
            var text = this.target;
            return text == null ? null : text.getValue();
        };

        this.lineWidth = function (line){
            this.recalc();
            return this.target.getExtraChar(line);
        };

        this.recalc = function(){
            if (this.lines > 0 && this.target != null){
                var text = this.target;
                if (text != null) {
                    if (this.lines > 0) {
                        for(var i = this.startLine + this.lines - 1;i >= this.startLine; i-- ){
                            text.setExtraChar(i, this.font.stringWidth(this.getLine(i)));
                        }
                        this.startLine = this.lines = 0;
                    }
                    this.textWidth = 0;
                    var size = text.getLines();
                    for(var i = 0;i < size; i++){
                        var len = text.getExtraChar(i);
                        if (len > this.textWidth) this.textWidth = len;
                    }
                    this.textHeight = this.getLineHeight() * size + (size - 1) * this.getLineIndent();
                }
            }
        };

        this.textUpdated = function(src,b,off,size,ful,updatedLines){
            if (b === false) {
                if (this.lines > 0) {
                    var p1 = ful - this.startLine, p2 = this.startLine + this.lines - ful - updatedLines;
                    this.lines = ((p1 > 0) ? p1 : 0) + ((p2 > 0) ? p2 : 0) + 1;
                    this.startLine = this.startLine < ful ? this.startLine : ful;
                }
                else {
                    this.startLine = ful;
                    this.lines = 1;
                }
                if (this.owner != null) this.owner.invalidate();
            }
            else {
                if(this.lines > 0){
                    if (ful <= this.startLine) this.startLine += (updatedLines - 1);
                    else {
                        if (ful < (this.startLine + size)) size += (updatedLines - 1);
                    }
                }
                this.invalidate(ful, updatedLines);
            }
        };

        this.invalidate = function(start,size){
            if (size > 0 && (this.startLine != start || size != this.lines)){
                if (this.lines === 0){
                    this.startLine = start;
                    this.lines = size;
                }
                else {
                    var e = this.startLine + this.lines;
                    this.startLine = start < this.startLine ? start : this.startLine;
                    this.lines     = Math.max(start + size, e) - this.startLine;
                }
                if (this.owner != null) this.owner.invalidate();
            }
        };

        this.getPreferredSize = function(){
            this.recalc();
            return { width:this.textWidth, height:this.textHeight };
        };

        this.paint = function(g,x,y,w,h,d) {
            var ts = g.getTopStack();
            if (ts.width > 0 && ts.height > 0) {
                var lineIndent = this.getLineIndent(), lineHeight = this.getLineHeight(), lilh = lineHeight + lineIndent;
                w = ts.width  < w ? ts.width  : w;
                h = ts.height < h ? ts.height : h;
                var startLine = 0;
                if (y < ts.y) {
                    startLine = ~~((lineIndent + ts.y - y) / lilh);
                    h += (ts.y - startLine * lineHeight - startLine * lineIndent);
                }
                else if (y > (ts.y + ts.height)) return;

                var size = this.target.getLines();
                if (startLine < size){
                    var lines =  ~~((h + lineIndent) / lilh) + (((h + lineIndent) % lilh > lineIndent) ? 1 : 0);
                    if (startLine + lines > size) lines = size - startLine;
                    y += startLine * lilh;

                    g.setFont(this.font);
                    if (d == null || d.isEnabled === true){
                        var fg = this.color;
                        g.setColor(fg);
                        for(var i = 0;i < lines; i++){
                            if (d && d.getStartSelection) {
                                var p1 = d.getStartSelection();
                                if (p1 != null){
                                    var p2 = d.getEndSelection(), line = i + startLine;
                                    if ((p1[0] != p2[0] || p1[1] != p2[1]) && line >= p1[0] && line <= p2[0]){
                                        var s = this.getLine(line), lw = this.lineWidth(line), xx = x;
                                        if (line == p1[0]) {
                                            var ww = this.font.charsWidth(s, 0, p1[1]);
                                            xx += ww;
                                            lw -= ww;
                                            if (p1[0] == p2[0]) lw -= this.font.charsWidth(s, p2[1], s.length - p2[1]);
                                        }
                                        else {
                                            if (line == p2[0]) lw = this.font.charsWidth(s, 0, p2[1]);
                                        }
                                        this.paintSelection(g, xx, y, lw === 0 ? 1 : lw, lilh, line, d);
                                        // restore foreground color after selection has been rendered
                                        g.setColor(fg);
                                    }
                                }
                            }
                            this.paintLine(g, x, y, i + startLine, d);
                            y += lilh;
                        }
                    }
                    else {
                        var c1 = pkg.disabledColor1, c2 = pkg.disabledColor2;
                        for(var i = 0;i < lines; i++){
                            if (c1 != null){
                                g.setColor(c1);
                                this.paintLine(g, x, y, i + startLine, d);
                            }
                            if (c2 != null){
                                g.setColor(c2);
                                this.paintLine(g, x + 1, y + 1, i + startLine, d);
                            }
                            y += lilh;
                        }
                    }
                }
            }
        };

        this.paintSelection = function(g, x, y, w, h, line, d){
            g.setColor(d.selectionColor);
            g.fillRect(x, y, w, h);
        };

        this.setValue = function (s) { this.target.setValue(s); };

        this.setFont = function(f){
            var old = this.font;
            if (f && zebra.isString(f)) f = new pkg.Font(f);
            if(f != old && (f == null || f.s != old.s)){
                this.font = f;
                this.invalidate(0, this.getLines());
            }
        };

        this.setColor = function(c){
            if (c != this.color) {
                this.color = c;
                return true;
            }
            return false;
        };
    },

    function(text) {
        this.color = pkg.fontColor;
        this.font  = pkg.font;
        this.textWidth = this.textHeight = this.startLine = this.lines = 0;
        //!!!
        //!!! since text is widely used structure we do slight hack - don't call parent constructor
        //!!!
        this.setTarget(zebra.isString(text) ? new zebra.data.Text(text) : text);
    }
]);

