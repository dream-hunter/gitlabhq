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
	"qface/lang/String",
	"qface/windows/controlss/_base/UIElement"
],function(declare,String,UIElement) {
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
	        this.$super();
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

        addComponentListener      : function (l) { this.a_(this.c_l, l); },
        removeComponentListener   : function(l){ this.r_(this.c_l, l); },
        addMouseListener          : function(l){ this.a_(this.m_l, l); },
        removeMouseListener       : function (l){ this.r_(this.m_l, l); },
        addFocusListener          : function (l){ this.a_(this.f_l, l); },
        removeFocusListener       : function (l){ this.r_(this.f_l, l); },
        addKeyListener            : function (l){ this.a_(this.k_l, l); },
        removeKeyListener         : function (l){ this.r_(this.k_l, l); },

        a_ : function(c, l){ (c.indexOf(l) >= 0) || c.push(l); },
        r_ : function(c, l){ (c.indexOf(l) < 0) || c.splice(i, 1); }
	});

	var Display = declare(UIElement,{
		
		constructor	: function(canvas,width,height) {
	        var pc = canvas, $this = this;
	        if (String.isString(canvas)) { 
	            canvas = document.getElementById(canvas);
	            if (canvas != null && pkg.$detectZCanvas(canvas)) {
	                throw new Error("Canvas is already in use");
	            }
	        }
	        
	        if (canvas == null) {
	            canvas = document.createElement("canvas");
	            canvas.setAttribute("class", "zebcanvas");
	            canvas.setAttribute("width",  w <= 0 ? "400" : "" + w);
	            canvas.setAttribute("height", h <= 0 ? "400" : "" + h);
	            canvas.setAttribute("id", pc);
	            document.body.appendChild(canvas);
	        }

	        //!!! Pay attention IE9 handles padding incorrectly 
	        //!!! the padding has to be set to 0px by appropriate 
	        //!!! stylesheet getPropertySetter

	        if (canvas.getAttribute("tabindex") === null) {
	            canvas.setAttribute("tabindex", "1");
	        }

	        // init internal canvas variable to host dirty area
	        this.da = { x:0, y:0, width:-1, height:0 };

	        // canvas has to be set before super 
	        this.canvas = canvas;

	        // specify canvas specific layout that stretches all kids to fill the whole canvas area
	        this.$super(new pkg.zCanvas.Layout());
	    
	        //!!! Event manager EM variable cannot be initialized before zebra.ui initialization
	        EM = pkg.events;
	        for(var i=0; i < pkg.layers.length; i++) {
	            var l = pkg.layers[i];
	            this.add(l.$new ? l.$new() : l);
	        }
	    
	        if (zebra.isTouchable) {
	            new pkg.TouchHandler(canvas, [
	                function $prototype() {
	                    this.started = function(e) {
	                        ME_STUB.touch          = e;
	                        ME_STUB.touches        = this.touches;
	                        ME_STUB.touchCounter   = this.touchCounter;
	                        $this.mousePressed(e.identifier, e, this.touchCounter == 1 ? ME.LEFT_BUTTON 
	                                                                                   : (e.group && e.group.size == 2 && e.group.index == 1 ? ME.RIGHT_BUTTON : 0)); 
	                    };

	                    this.ended = function(e) {
	                        ME_STUB.touch          = e;
	                        ME_STUB.touches        = this.touches;
	                        ME_STUB.touchCounter   = this.touchCounter; 
	                        $this.mouseReleased(e.identifier, e); 
	                    };

	                    this.moved = function(e) {
	                        ME_STUB.touch          = e;
	                        ME_STUB.touches        = this.touches;
	                        ME_STUB.touchCounter   = this.touchCounter;
	                        $this.mouseMoved(e.identifier, e);  
	                    };                    
	                }
	            ]);  
	        }
	        else {
	            this.canvas.onmousemove = function(e) { 
	                $this.mouseMoved(1, e);   
	            };
	            
	            this.canvas.onmousedown = function(e) { 
	                $this.mousePressed(1, e, e.button === 0 ? ME.LEFT_BUTTON: (e.button == 2 ? ME.RIGHT_BUTTON : 0)); 
	            };
	            
	            this.canvas.onmouseup = function(e) { 
	                $this.mouseReleased(1, e);
	            };

	            this.canvas.onmouseover = function(e) { 
	                $this.mouseEntered(1, e); 
	            };
	            
	            this.canvas.onmouseout = function(e) { 
	                $this.mouseExited(1, e);  
	            };
	            
	            this.canvas.oncontextmenu = function(e) { e.preventDefault(); };

	            this.canvas.onkeydown     = function(e) { $this.keyPressed(e);   };
	            this.canvas.onkeyup       = function(e) { $this.keyReleased(e);  };
	            this.canvas.onkeypress    = function(e) { $this.keyTyped(e);     };
	            this.canvas.onfocus       = function(e) { $this.focusGained(e);  };
	            this.canvas.onblur        = function(e) { $this.focusLost(e);    };
	        }

	        var addons = pkg.zCanvas.addons;
	        if (addons) {
	            for (var i=0; i<addons.length; i++) (new (Class.forName(addons[i]))()).setup(this);
	        }
	        
	        this.recalcOffset();
	        this.setSize(parseInt(this.canvas.width, 10), parseInt(this.canvas.height, 10));
	        $canvases.push(this);
		},

        _focusGained : function(e){
            if ($focusGainedCounter++ > 0) {
                e.preventDefault();
                return;
            }

            //!!!! removeme
            return;

            //debug("focusGained");

            if (pkg.focusManager.prevFocusOwner != null) {
                var d = pkg.findCanvas(pkg.focusManager.prevFocusOwner);
                if (d == this)  { 
                    pkg.focusManager.requestFocus(pkg.focusManager.prevFocusOwner);
                }
                else {
                    pkg.focusManager.prevFocusOwner = null;
                }
            }
        },

        _focusLost : function(e){
            //!!! sometimes focus lost comes incorrectly
            //    ignore focus lost if canvas still holds focus
            if (document.activeElement == this.canvas) {
                e.preventDefault();
                return;
            }

            if ($focusGainedCounter !== 0) {
                $focusGainedCounter = 0;

                //debug("focusLost");
                if (pkg.focusManager.focusOwner != null || 
                    pkg.findCanvas(pkg.focusManager.focusOwner) == this) 
                {
                    pkg.focusManager.requestFocus(null);
                }
            }
        },

        _keyTyped : function(e){
            if (e.charCode == 0) {
                if ($keyPressedCode != e.keyCode) this.keyPressed(e);
                $keyPressedCode = -1;
                return;
            }

            if (e.charCode > 0) {
                var fo = pkg.focusManager.focusOwner;
                if (fo != null) {
                    //debug("keyTyped: " + e.keyCode + "," + e.charCode + " " + (e.charCode == 0));
                    KE_STUB.reset(fo, KE.TYPED, e.keyCode, String.fromCharCode(e.charCode), km(e));
                    if (EM.performInput(KE_STUB)) e.preventDefault();
                }
            }

            if (e.keyCode < 47) e.preventDefault();
        },

        this.keyPressed = function(e){
            $keyPressedCode  = e.keyCode;
            var code = e.keyCode, m = km(e), b = false;
            for(var i = this.kids.length - 1;i >= 0; i--){
                var l = this.kids[i];
                l.layerKeyPressed(code, m);
                if (l.isLayerActive && l.isLayerActive()) break;
            }

            var focusOwner = pkg.focusManager.focusOwner;
            if (pkg.clipboardTriggerKey > 0 && 
                e.keyCode == pkg.clipboardTriggerKey && 
                focusOwner != null && 
                instanceOf(focusOwner, CopyCutPaste)) 
            {
                $clipboardCanvas = this;  
                $clipboard.style.display = "block";
                this.canvas.onfocus = this.canvas.onblur = null;
                
                // value has to be set, otherwise some browsers (Safari) do not generate 
                // "copy" event
                $clipboard.value="1";

                $clipboard.select();
                $clipboard.focus();                
                return;        
            }

            $keyPressedOwner     = focusOwner;
            $keyPressedModifiers = m;

            if (focusOwner != null) {
                //debug("keyPressed : " + e.keyCode, 1);
                KE_STUB.reset(focusOwner, KPRESSED, code, code < 47 ? KE.CHAR_UNDEFINED : '?', m);
                b = EM.performInput(KE_STUB);

                if (code == KE.ENTER) {
                    //debug("keyTyped keyCode = " + code);
                    KE_STUB.reset(focusOwner, KE.TYPED, code, "\n", m);
                    b = EM.performInput(KE_STUB) || b;
                }
            }

            //!!!! 
            if ((code < 47 && code != 32) || b) { 
                e.preventDefault();
            }
        };

        this.keyReleased = function(e){
            $keyPressedCode = -1;

            var fo = pkg.focusManager.focusOwner;
            if(fo != null) {
                //debug("keyReleased : " + e.keyCode, -1);
                KE_STUB.reset(fo, KE.RELEASED, e.keyCode, KE.CHAR_UNDEFINED, km(e));
                if (EM.performInput(KE_STUB)) e.preventDefault();
            }
        };

        this.mouseEntered = function(id, e) {
            var mp = $mousePressedEvents[id];

            // if a button has not been pressed handle mouse eneterd to detect
            // zebra component the mouse pointer entered and send appropriate
            // mouse entered event to it
            if (mp == null || mp.canvas == null) {
                var x = $meX(e, this), y = $meY(e, this), d = this.getComponentAt(x, y);

                // also corretct current component on taht mouse pointer is located
                if (pkg.$mouseMoveOwner != null && d != pkg.$mouseMoveOwner) {
                    var prev = pkg.$mouseMoveOwner;
                    pkg.$mouseMoveOwner = null;

                    //debug("mouseExited << ", -1);
                    ME_STUB.reset(prev, MEXITED, x, y, -1, 0);
                    EM.performInput(ME_STUB);
                }

                if (d != null && d.isEnabled){
                    //debug("mouseEntered >> ", 1);
                    pkg.$mouseMoveOwner = d;
                    ME_STUB.reset(d, MENTERED, x, y, -1, 0);
                    EM.performInput(ME_STUB);
                }
            }
        };

        this.mouseExited = function (id, e) {
            var mp = $mousePressedEvents[id];

            // if a mouse button has not been pressed and current mouse owner 
            // component is not null, flush current mouse owner and send 
            // mouse exited event to him 
            if ((mp == null || mp.canvas == null) && pkg.$mouseMoveOwner != null){
                var p = pkg.$mouseMoveOwner;
                pkg.$mouseMoveOwner = null;

                ME_STUB.reset(p, MEXITED, $meX(e, this), $meY(e, this), -1, 0);
                EM.performInput(ME_STUB);
            }
        };

        this.mouseMoved = function(id, e){
            // get appropriate mousePressed event by event id
            var mp = $mousePressedEvents[id];
        
            // mouse button has been pressed and pressed target zebra component exists  
            // emulate mouse dragging events if we mouse moved on the canvas where mouse 
            // pressed event occurred
            if (mp != null && mp.canvas != null) {
                // target component exits and mouse cursor moved on the same canvas where mouse pressed occurred
                if (mp.component != null && mp.canvas.canvas == e.target) {
                    var x = $meX(e, this), y = $meY(e, this), m = mp.button;

                    // if dragg events has not been initiated yet generate mouse 
                    // start dragging event
                    if (mp.draggedComponent == null) {

                        // check if zebra mouse moved event has already occurred 
                        // if it is true set mouse dragged target component to the mouse moved target component
                        // otherwise compute the target component basing on mouse moved event location  
                        var xx = $meX(mp, this), 
                            yy = $meY(mp, this),
                            d  = (pkg.$mouseMoveOwner == null) ? this.getComponentAt(xx, yy)
                                                               : pkg.$mouseMoveOwner;
                       
                        // if target component can be detected fire mouse start sragging and 
                        // mouse dragged events to the component  
                        if (d != null && d.isEnabled === true) {
                            mp.draggedComponent = d;

                            ME_STUB.reset(d, ME.DRAGSTARTED, xx, yy, m, 0);
                            EM.performInput(ME_STUB);

                            // if mouse cursor has been moved mouse dragged event has to be generated
                            if (xx != x || yy != y) {
                                ME_STUB.reset(d, MDRAGGED, x, y, m, 0);
                                EM.performInput(ME_STUB);
                            }
                        }
                    }
                    else {
                        // the drag event has already occurred before, just send 
                        // next dragged event to target zebra component 
                        ME_STUB.reset(mp.draggedComponent, MDRAGGED, x, y, m, 0);
                        EM.performInput(ME_STUB);
                    }
                }
            }
            else {
                // if a mouse button has not been pressed handle the normal mouse moved event
                var x = $meX(e, this), y = $meY(e, this), d = this.getComponentAt(x, y); 
                if (pkg.$mouseMoveOwner != null) {
                    if (d != pkg.$mouseMoveOwner) {
                        var old = pkg.$mouseMoveOwner;

                        //debug("mouseExited << ", -1);
                        pkg.$mouseMoveOwner = null;
                        ME_STUB.reset(old, MEXITED, x, y, -1, 0);
                        EM.performInput(ME_STUB);

                        if (d != null && d.isEnabled === true) {
                            //debug("mouseEntered >> " , 1);
                            pkg.$mouseMoveOwner = d;
                            ME_STUB.reset(pkg.$mouseMoveOwner, MENTERED, x, y, -1, 0);
                            EM.performInput(ME_STUB);
                        }
                    }
                    else {
                        if (d != null && d.isEnabled) {
                            ME_STUB.reset(d, MMOVED, x, y, -1, 0);
                            EM.performInput(ME_STUB);
                        }
                    }
                }
                else {
                    if (d != null && d.isEnabled === true) {
                        //debug("mouseEntered >> ", 1);
                        pkg.$mouseMoveOwner = d;
                        ME_STUB.reset(d, MENTERED, x, y, -1, 0);
                        EM.performInput(ME_STUB);
                    }
                }
            }
        };

        this.mouseReleased = function(id, e){
            var mp = $mousePressedEvents[id];

            // handle it only if appropriate mouse pressed has occurred 
            if (mp != null && mp.canvas != null) {   
                var x = $meX(e, this), y = $meY(e, this), po = mp.component;
               
                // if a component has been dragged send end dragged event to him to 
                // complete dragging
                if (mp.draggedComponent != null){
                    ME_STUB.reset(mp.draggedComponent, ME.DRAGENDED, x, y, mp.button, 0);
                    EM.performInput(ME_STUB);
                }

                // mouse pressed has not null target zebra component 
                // send mouse released and mouse clicked (if necessary)
                // to him
                if (po != null) {
                    //debug("mouseReleased ", -1);

                  
                    // generate mouse click if no mouse drag event has been generated
                    if (mp.draggedComponent == null && (e.touch == null || e.touch.group == null)) {
                        ME_STUB.reset(po, ME.CLICKED, x, y, mp.button, mp.clicks);
                        EM.performInput(ME_STUB);
                    }
                    
                    // send mouse released to zebra target component
                    ME_STUB.reset(po, ME.RELEASED, x, y, mp.button, mp.clicks);
                    EM.performInput(ME_STUB);
                }

                // mouse released can happen at new location, so move owner has to be corrected
                // and mouse exited entered event has to be generated. 
                // the correction takes effect if we have just completed dragging or mouse pressed
                // event target doesn't match pkg.$mouseMoveOwner   
                if (zebra.isTouchable === false) {    //!!! mouse entered / exited event cannot be generated for touch screens 
                    var mo = pkg.$mouseMoveOwner;
                    if (mp.draggedComponent != null || (po != null && po != mo)) {
                        var nd = this.getComponentAt(x, y);
                        if (nd != mo) {
                            if (mo != null) {
                                //debug("mouseExited << ", -1);
                                ME_STUB.reset(mo, MEXITED, x, y, -1, 0);
                                EM.performInput(ME_STUB);
                            }

                            if (nd != null && nd.isEnabled === true){
                                pkg.$mouseMoveOwner = nd;

                                //debug("mouseEntered >> ", 1);

                                ME_STUB.reset(nd, MENTERED, x, y, -1, 0);
                                EM.performInput(ME_STUB);
                            }
                        }
                    }
                }

                // release mouse pressed event without removal the event from object
                // keeping event in object is used to handle double click
                $mousePressedEvents[id].canvas = null;
            }
        };

        this.mousePressed = function(id, e, button) {
            // release mouse pressed if it has not happened before but was not released
            var mp = $mousePressedEvents[id];
            if (mp != null && mp.canvas != null) {
                this.mouseReleased(id, mp);
            }

            //debug("mousePressed ", 0);

            // store mouse pressed event 
            var clicks = mp != null && (new Date().getTime() - mp.time) <= pkg.doubleClickDelta ? 2 : 1 ;
            mp = $mousePressedEvents[id] = {
                pageX       : e.pageX,
                pageY       : e.pageY,
                identifier  : id,
                target      : e.target,
                canvas      : this,
                button      : button,
                component   : null,
                mouseDragged: null,
                time        : (new Date()).getTime(),
                clicks      : clicks
            };

            var x = $meX(e, this), y = $meY(e, this);
            mp.x = x;
            mp.y = y;

            // send mouse event to a layer and test if it has been activated
            for(var i = this.kids.length - 1; i >= 0; i--){
                var l = this.kids[i];
                l.layerMousePressed(x, y,button);
                if (l.isLayerActive && l.isLayerActive(x, y)) break;
            }

            var d = this.getComponentAt(x, y);
            if (d != null && d.isEnabled === true){
                mp.component = d;
                ME_STUB.reset(d, ME.PRESSED, x, y, button, clicks);
                EM.performInput(ME_STUB);
            }

            //!!! this prevent DOM elements selection on the page 
            //!!! this code should be still double checked
            //!!!! THIS CODE BRINGS SOME PROBLEM TO IE. IF CURSOR IN ADDRESS TAB PRESSING ON CANVAS
            //!!!! GIVES FOCUS TO CANVAS BUT KEY EVENT GOES TO ADDRESS BAR 
            //e.preventDefault();

            // on mobile devices this force to leave edit component by grabbing focus from 
            // the editor component (input text field)
            if (document.activeElement != this.canvas) {
                this.canvas.focus();  
            }
        };
		paint	: function(g,x1,y1,w,h,d) {
            var x2 = x1 + w - 1, y2 = y1 + h - 1;
            g.setColor(this.brightest);
            g.drawLine(x1, y1, x2, y1);
            g.drawLine(x1, y1, x1, y2);
            g.setColor(this.middle);
            g.drawLine(x2, y1, x2, y2 + 1);
            g.drawLine(x1, y2, x2, y2);
		}
	});
	
	
	return RaisedBorder;
	
});	
