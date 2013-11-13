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

	var FocusManager = declare(null,{
        prevFocusOwner : null,
        focusOwner : null,
        
        freeFocus : function (ctx, t){ 
        	if(t == ctx.focusOwner) 
        		ctx.requestFocus(null);
        	}
        },	


        compEnabled : function(c)   { 
        	if (c.isEnabled === false) 
        		freeFocus(this, c); 
        },
        
        compShown   : function(c)   { 
        	if (c.isVisible === false) 
        		freeFocus(this, c); 
        },
        
        compRemoved : function(p,c) { 
        	freeFocus(this, c); 
        },

        hasFocus : function(c) { 
        	return this.focusOwner == c; 
        },

        keyPressed : function(e){
            if (KE.TAB == e.code){
                var cc = this.ff(e.source, e.isShiftPressed() ?  -1 : 1);
                if (cc != null) this.requestFocus(cc);
            }
        },

        findFocusable : function(c){ 
        	return (this.isFocusable(c) ? c : this.fd(c, 0, 1)); 
        },

        isFocusable : function(c){
            var d = pkg.findCanvas(c);
            //!!!
            // also we should checks whether parents isFocusable !!!
            return d && c.isEnabled && c.isVisible && c.canHaveFocus && c.canHaveFocus();
        },

        fd : function(t,index,d){
            if(t.kids.length > 0){
                var isNComposite = (instanceOf(t, Composite) === false);
                for(var i = index; i >= 0 && i < t.kids.length; i += d) {
                    var cc = t.kids[i];
                    if (cc.isEnabled && cc.isVisible && cc.width > 0 && cc.height > 0 && 
                        (isNComposite || (t.catchInput && t.catchInput(cc) === false)) &&
                        ((cc.canHaveFocus && cc.canHaveFocus()) || (cc = this.fd(cc, d > 0 ? 0 : cc.kids.length - 1, d)) != null))
                    {
                        return cc;
                    }
                }
            }
            return null;
        },

        ff : function(c,d){
            var top = c;
            while (top && top.getFocusRoot == null) top = top.parent;
            top = top.getFocusRoot();
            for(var index = (d > 0) ? 0 : c.kids.length - 1;c != top.parent; ){
                var cc = this.fd(c, index, d);
                if(cc != null) return cc;
                cc = c;
                c = c.parent;
                if(c != null) index = d + c.indexOf(cc);
            }
            return this.fd(top, d > 0 ? 0 : top.kids.length - 1, d);
        },

        requestFocus : function (c){
            if (c != this.focusOwner && (c == null || this.isFocusable(c))){
                var oldFocusOwner = this.focusOwner;
                if (c != null) {
                    var nf = EM.getEventDestination(c);
                    if (nf == null || oldFocusOwner == nf) return;
                    this.focusOwner = nf;
                }
                else {
                    this.focusOwner = c;
                }

                this.prevFocusOwner = oldFocusOwner;
                if (oldFocusOwner  != null) {
                    pkg.events.performInput(new IE(oldFocusOwner, IE.FOCUS_LOST, IE.FOCUS_UID));
                }

                if (this.focusOwner != null) {
                    pkg.events.performInput(new IE(this.focusOwner, IE.FOCUS_GAINED, IE.FOCUS_UID)); 
                }

                return this.focusOwner;
            }
            return null;
        },

        mousePressed : function(e){
            if (e.isActionMask()) {
                this.requestFocus(e.source);
            }
        }
	});
	
	return FocusManager;
	
});	