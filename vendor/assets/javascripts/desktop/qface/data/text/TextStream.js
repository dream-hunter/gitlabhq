/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/Stateful"
], function(lang, array, declare, Stateful){

pkg.TextModel = Interface();
var MB = zebra.util;

function Line(s) {
    this.s = s;
    this.l = 0;
}

//  toString for array.join method
Line.prototype.toString = function() { return this.s; };

var TextModelListeners = MB.Listeners.Class("textUpdated");
pkg.Text = Class(pkg.TextModel, [
    function $prototype() {
        this.textLength = 0;

        this.getLnInfo = function(lines, start, startOffset, o){
            for(; start < lines.length; start++){
                var line = lines[start].s;
                if(o >= startOffset && o <= startOffset + line.length) return [start, startOffset];
                startOffset += (line.length + 1);
            }
            return [];
        };

        this.setExtraChar = function(i,ch){ this.lines[i].l = ch; };
        this.getExtraChar = function (i) { return this.lines[i].l; };
        this.getLine = function(line) { return this.lines[line].s; };
        this.getValue = function(){ return this.lines.join("\n"); };
        this.getLines = function () { return this.lines.length; };
        this.getTextLength = function(){ return this.textLength; };

        this.write = function (s, offset){
            var slen = s.length, info = this.getLnInfo(this.lines, 0, 0, offset), line = this.lines[info[0]].s, j = 0,
                lineOff = offset - info[1], tmp = [line.substring(0, lineOff), s, line.substring(lineOff)].join('');

            for(; j < slen && s[j] != '\n'; j++);

            if(j >= slen) {
                this.lines[info[0]].s = tmp;
                j = 1;
            }
            else {
                this.lines.splice(info[0], 1);
                j = this.parse(info[0], tmp, this.lines);
            }
            this.textLength += slen;
            this._.textUpdated(this, true, offset, slen, info[0], j);
        };

        this.remove = function (offset,size){
            var i1   = this.getLnInfo(this.lines, 0, 0, offset), 
                i2   = this.getLnInfo(this.lines, i1[0], i1[1], offset + size),
                l2   = this.lines[i2[0]].s, 
                l1   = this.lines[i1[0]].s, 
                off1 = offset - i1[1], off2 = offset + size - i2[1],
                buf  = [l1.substring(0, off1), l2.substring(off2)].join('');

            if (i2[0] == i1[0]) this.lines.splice(i1[0], 1, new Line(buf));
            else {
                this.lines.splice(i1[0], i2[0] - i1[0] + 1);
                this.lines.splice(i1[0], 0, new Line(buf));
            }
            this.textLength -= size;
            this._.textUpdated(this, false, offset, size, i1[0], i2[0] - i1[0] + 1);
        };

        this.parse  =function (startLine, text, lines){
            var size = text.length, prevIndex = 0, prevStartLine = startLine;
            for(var index = 0; index <= size; prevIndex = index, startLine++){
                var fi = text.indexOf("\n", index);
                index = (fi < 0 ? size : fi);
                this.lines.splice(startLine, 0, new Line(text.substring(prevIndex, index)));
                index++;
            }
            return startLine - prevStartLine;
        };

        this.setValue = function(text){
            if (text == null) throw new Error();
            var old = this.getValue();
            if (old !== text) {
                if (old.length > 0) {
                    var numLines = this.getLines(), txtLen = this.getTextLength();
                    this.lines.length = 0;
                    this.lines = [ new Line("") ];
                    this._.textUpdated(this, false, 0, txtLen, 0, numLines);
                }

                this.lines = [];
                this.parse(0, text, this.lines);
                this.textLength = text.length;
                this._.textUpdated(this, true, 0, this.textLength, 0, this.getLines());
            }
        };

        this[''] = function(s){
            this.lines = [ new Line("") ];
            this._ = new TextModelListeners();
            this.setValue(s == null ? "" : s);
        };
    }
]);

pkg.SingleLineTxt = Class(pkg.TextModel, [
    function $prototype() {
        this.setExtraChar = function(i,ch) { this.extra = ch; };
        this.getExtraChar = function(i){ return this.extra; };

        this.getValue = function(){ return this.buf; };
        this.getLines = function(){ return 1; };
        this.getTextLength = function(){ return this.buf.length; };
        this.getLine = function(line){ return this.buf; };

        this.write = function(s,offset){
            var buf = this.buf, j = s.indexOf("\n");
            if (j >= 0) s = s.substring(0, j);
            var l = (this.maxLen > 0 && (buf.length + s.length) >= this.maxLen) ? this.maxLen - buf.length : s.length;
            if (l!==0) {
                this.buf = [buf.substring(0, offset), s.substring(0, l), buf.substring(offset)].join('');
                if (l > 0) this._.textUpdated(this, true, offset, l, 0, 1);
            }
        };

        this.remove = function(offset,size){
            this.buf = [ this.buf.substring(0, offset), this.buf.substring(offset + size)].join('');
            this._.textUpdated(this, false, offset, size, 0, 1);
        };

        this.setValue = function(text){
            if (text == null) throw new Error();
            var i = text.indexOf('\n');
            if (i >= 0) text = text.substring(0, i);
            if(this.buf == null || this.buf !== text) {
                if (this.buf != null && this.buf.length > 0) this._.textUpdated(this, false, 0, this.buf.length, 0, 1);
                if (this.maxLen > 0 && text.length > this.maxLen) text = text.substring(0, this.maxLen);
                this.buf = text;
                this._.textUpdated(this, true, 0, text.length, 0, 1);
            }
        };

        this.setMaxLength = function (max){
            if(max != this.maxLen){
                this.maxLen = max;
                this.setValue("");
            }
        };

        this[''] = function (s, max) {   
            this.maxLen = max == null ? -1 : max;
            this.buf = null;
            this.extra = 0;
            this._ = new TextModelListeners();
            this.setValue(s == null ? "" : s);
        };
    }
]);

});
