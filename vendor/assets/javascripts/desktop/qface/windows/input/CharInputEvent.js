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
	"qface/lang/Event"
],function(declare,Event) {
        this.MOUSE_UID    = 1;
        this.KEY_UID      = 2;
        this.FOCUS_UID    = 3;
        this.FOCUS_LOST   = 10;
        this.FOCUS_GAINED = 11;

	var InputEvent = declare([Event],{

		constructor	: function(target, id, uid) {
	        this.source = target;
	        this.ID = id;
	        this.UID = uid;
		}
	});
	
        this.TYPED    = 15;
        this.RELEASED = 16;
        this.PRESSED  = 17;

        this.M_CTRL  = 1;
        this.M_SHIFT = 2;
        this.M_ALT   = 4;
        this.M_CMD   = 8;
	
	var KeyEvent = declare([InputEvent],{
		constructor	:  function (param){
            this.source = param.target;
            this.ID     = param.id;
            this.code   = param.code;
            this.mask   = param.mask;
            this.ch     = param.ch;
	    },
	    

        isControlPressed : function(){ 
        	return (this._mask & KE.M_CTRL) > 0; 
        },
        isShiftPressed   function(){ 
        	return (this._mask & KE.M_SHIFT) > 0; 
        },
        isAltPressed  : function(){ 
        	return (this._mask & KE.M_ALT) > 0; 
        },
        isCmdPressed  : function(){ 
        	return (this._mask & KE.M_CMD) > 0; 
        }
	    
	
	});
	
	var KeyDownEvent = declare([KeyEvent],{
		"-attributes-" : {
			keyCode : {
				getter : function(){
					return this._keyCode;
				},
				setter : function(keyCode){
				}
			}
		}
	});

	var KeyPressEvent = declare([KeyEvent],{
		"-attributes-" : {
			keyCode : {
				getter : function(){
					return this._keyCode;
				},
				setter : function(keyCode){
				}
			}
		}
	});
	
	var KeyUpEvent = declare([KeyEvent],{
		"-attributes-" : {
			keyCode : {
				getter : function(){
					return this._keyCode;
				},
				setter : function(keyCode){
				}
			}
		}
	});
	
    this.CLICKED      = 21;
    this.PRESSED      = 22;
    this.RELEASED     = 23;
    this.ENTERED      = 24;
    this.EXITED       = 25;
    this.DRAGGED      = 26;
    this.DRAGSTARTED  = 27;
    this.DRAGENDED    = 28;
    this.MOVED        = 29;

    this.LEFT_BUTTON  = 128;
    this.RIGHT_BUTTON = 512;
	

	var MouseEvent = declare([InputEvent],{
		touchCounter : 1,
		
		constructor	:     function (target,id,ax,ay,mask,clicks){
	        //this.$super(target, id, IE.MOUSE_UID);
	        this.reset(target, id, ax, ay, mask, clicks);
	    },
	    
        reset : function(target,id,ax,ay,mask,clicks){
            this.source = target;
            this.ID     = id;
            this.absX   = ax;
            this.absY   = ay;
            this.mask   = mask;
            this.clicks = clicks;

            var p = L.getTopParent(target);
            while(target != p){
                ax -= target.x;
                ay -= target.y;
                target = target.parent;
            }
            this.x = ax;
            this.y = ay;
        },

        isActionMask : function(){
            return this.mask == ME.LEFT_BUTTON;
        }
	    
	
	});
	
	var MouseMoveEvent = declare([MouseEvent],{
	});
	
	var MouseDownEvent = declare([MouseEvent],{
	});

	var MouseUpEvent = declare([MouseEvent],{
	});
	
	var MouseOverEvent = declare([MouseEvent],{
	});
	

	var MouseOutEvent = declare([MouseEvent],{
	});
	

	return InputEvent;
	
});	