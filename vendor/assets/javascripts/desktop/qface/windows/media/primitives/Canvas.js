/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */

define( [
	"qface/lang/declare",
	"qface/lang/extend",
	"qface/lang/Object",
	"dojo/_base/event",
	"dojo/on",
	"dojo/touch",
	"dojo/dom-geometry",
	"qface/windows/input/Mouse",
	"qface/windows/input/Keyboard"
], function(declare,extend,Object,devent,on,touch,geom,Mouse,Keyboard){
	
	var Canvas = delcare(null,{
		dndController: _dndSource,

		
		"-attributes-" : {
		},
		
		"-methods-" : {      
			position : function(visual) {
			},
			
		},
		
		
		consturctor : function(canvas) {
			this._canvas = canvas;
			if(this.dndController){
				if(lang.isString(this.dndController)){
					this.dndController = lang.getObject(this.dndController);
				}
				var params={};
				for(var i=0; i<this.dndParams.length;i++){
					if(this[this.dndParams[i]]){
						params[this.dndParams[i]] = this[this.dndParams[i]];
					}
				}
				this.dndController = new this.dndController(this, params);
			}
			
			
		},
		destroy: function(){
			// summary:
			//		Prepares this object to be garbage-collected


			// this.clearItems();
			this.domNode =  null;
		},
		
	});

	var HostCanvas = {
		create : function(canvas){
			//this.Container_initialize();
			this.canvas = (typeof canvas == "string") ? document.getElementById(canvas) : canvas;
			this._pointerData = {};
			this.enableDOMEvents(true);		
		},

		
	
	};
	returen EventedCanvas;
});
