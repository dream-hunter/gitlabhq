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
	"qface/windows/input/_InputEvent"
],function(declare,InputEvent) {
	var DndEvent = declare([InputEvent],{
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
	

	return DndEvent;
	
});	
