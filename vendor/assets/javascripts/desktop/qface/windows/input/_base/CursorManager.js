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

	var CursorManager = declare(null,{
	    constructor : function(){
	        this.cursors = {};
	        this.cursorType = "default";
	    },
	    
        setCursorable : function(t,c){
            if(c == null) delete this.cursors[t];
            else this.cursors[t] = c;
        },

        mouseMoved   : function(e){ 
        	this.setCursorType1(e); 
        },
        
        mouseEntered : function(e){ 
        	this.setCursorType1(e); 
        },
        
        mouseExited  : function(e){ 
        	this.setCursorType2("default", e.source); 
        },
        
        mouseDragged : function(e){ 
        	this.setCursorType1(e); 
        },

        setCursorType1 : function(e){
            var t = e.source, c = this.cursors.hasOwnProperty(t) ? this.cursors[t] : null;
            if(c == null && instanceOf(t, Cursorable)) c = t;
            this.setCursorType2(((c != null) ? c.getCursorType(t, e.x, e.y) :  "default"), t);
        },

        setCursorType2 : function(type,t){
            if (this.cursorType != type) {
                var d = pkg.findCanvas(t);
                if(d != null){
                    this.cursorType = type;
                    d.canvas.style.cursor = (this.cursorType < 0) ? "default" : this.cursorType;
                }
            }
        }
	});
	
	return CursorManager;
	
});	