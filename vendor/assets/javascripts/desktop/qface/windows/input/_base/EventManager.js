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

    var IEHM = [], MUID = IE.MOUSE_UID, KUID = IE.KEY_UID;

    IEHM[KE.TYPED]          = 'keyTyped';
    IEHM[KE.RELEASED]       = 'keyReleased';
    IEHM[KE.PRESSED]        = 'keyPressed';
    IEHM[ME.DRAGGED]        = 'mouseDragged';
    IEHM[ME.DRAGSTARTED]    = 'mouseDragStarted';
    IEHM[ME.DRAGENDED]      = 'mouseDragEnded';
    IEHM[ME.MOVED]          = 'mouseMoved';
    IEHM[ME.CLICKED]        = 'mouseClicked';
    IEHM[ME.PRESSED]        = 'mousePressed';
    IEHM[ME.RELEASED]       = 'mouseReleased';
    IEHM[ME.ENTERED]        = 'mouseEntered';
    IEHM[ME.EXITED]         = 'mouseExited';
    IEHM[IE.FOCUS_LOST]     = 'focusLost';
    IEHM[IE.FOCUS_GAINED]   = 'focusGained';

    IEHM[CL.COMP_SIZED]   = 'compSized';
    IEHM[CL.COMP_MOVED]   = 'compMoved';
    IEHM[CL.COMP_ENABLED] = 'compEnabled';
    IEHM[CL.COMP_SHOWN]   = 'compShown';
    IEHM[CL.COMP_ADDED]   = 'compAdded';
    IEHM[CL.COMP_REMOVED] = 'compRemoved';

	var EventManager = declare(null,{
	    constructor : function() {
	        this.m_l  = [];
	        this.k_l  = [];
	        this.f_l  = [];
	        this.c_l  = [];
	    },
        performComp : function(id, src, p1, p2){
            var n = IEHM[id];

            if (src[n] != null && instanceOf(src, CL)) {
                src[n].call(src, src, p1, p2);            
            }

            for(var i = 0;i < this.c_l.length; i++) {
                var t = this.c_l[i];
                if (t[n] != null) t[n].call(t, src, p1, p2);            
            } 
            
            for(var t = src.parent;t != null; t = t.parent){
                if (t.childCompEvent != null && instanceOf(t, ChildrenListener)) t.childCompEvent(id, src, p1, p2);
            }
        },

        // destination is component itself or one of his composite parent.
        // composite component is a component that grab control from his children component. to make a component composite
        // it has to implement Composite interface. If composite component has catchInput method it will be called
        // to clarify if the composite component takes control for the given kid.
        // composite components can be embedded (parent composite can take control on its child composite 
        // component) 
        getEventDestination : function(c) {
            if (c == null) return null;
            var cp = c, p = c;
            while((p = p.parent) != null) {
                if (instanceOf(p, Composite) && (p.catchInput == null || p.catchInput(cp))) {
                    cp = p;
                }
            }
            return cp;
        },

        performInput : function(e){
            var t = e.source, id = e.ID, it = null, k = IEHM[id], b = false;
            switch(e.UID)
            {
                case MUID:
                    if (t[k] != null && instanceOf(t, MouseListener)) {
                        t[k].call(t, e);
                    }

                    if (id > 25) {
                        for(var i = 0; i < this.m_l.length; i++) {
                            var tt = this.m_l[i];
                            if (tt[k] != null) tt[k].call(tt, e);
                        }
                        return b;
                    }
                    it = this.m_l;
                    break;
                case KUID:
                    if (t[k] != null && instanceOf(t, KeyListener)) {
                        b = t[k].call(t, e);
                    }
                    it = this.k_l;
                    break;
                case IE.FOCUS_UID:
                    if (t[k] != null && instanceOf(t, FocusListener)) {
                        t[k].call(t, e);
                    }
                    t.focused();
                    it = this.f_l;
                    break;
                default: throw new Error("Invalid input event UID");
            }

            // distribute event to globally registered listeners
            for(var i = 0;i < it.length; i++) {
                var tt = it[i], m = tt[k];
                if (m != null) b = m.call(tt, e) || b;
            }

            for (t = t.parent;t != null; t = t.parent){
                if (t.childInputEvent != null && instanceOf(t, ChildrenListener)) t.childInputEvent(e);
            }
            return b;
        },

        addListener : function (l){
            if (instanceOf(l,CL))                  this.addComponentListener(l);
            if (instanceOf(l,MouseListener))       this.addMouseListener(l);
            if (instanceOf(l,KeyListener))         this.addKeyListener(l);
            if (instanceOf(l,FocusListener))       this.addFocusListener(l);
        },

        removeListener : function (l) {
            if (instanceOf(l, CL))                  this.removeComponentListener(l);
            if (instanceOf(l, MouseListener))       this.removeMouseListener(l);
            if (instanceOf(l, KeyListener))         this.removeKeyListener(l);
            if (instanceOf(l, FocusListener))       this.removeFocusListener(l);
        },

        addComponentListener : function (l) { 
        	this.a_(this.c_l, l); 
        },
        removeComponentListener  : function(l){ 
        	this.r_(this.c_l, l); 
        },
        addMouseListener   : function(l){ 
        	this.a_(this.m_l, l); 
        },
        removeMouseListener  : function (l){ 
        	this.r_(this.m_l, l); 
        },
        addFocusListener  : function (l){ 
        	this.a_(this.f_l, l); 
        },
        removeFocusListener : function (l){ 
        	this.r_(this.f_l, l); 
        },
        addKeyListener   : function (l){ 
        	this.a_(this.k_l, l); 
        },
        removeKeyListener : function (l){ 
        	this.r_(this.k_l, l); 
        },

        a_ : function(c, l){ 
        	(c.indexOf(l) >= 0) || c.push(l); 
        },
        
        r_ : function(c, l){ 
        	(c.indexOf(l) < 0) || c.splice(i, 1); 
        }
	});
	
	return EventManager;
	
});	