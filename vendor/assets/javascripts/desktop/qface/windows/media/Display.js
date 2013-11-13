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
	"qface/windows/media/ContainerVisual",
	"qface/windows/input/InputManager"

], function(declare,extend,Object,devent,on,touch,geom,ContainerVisual){
	var	devicePixelRatio = window.devicePixelRatio || 1, 
		backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1, 
		pixelRatio = devicePixelRatio / backingStoreRatio;

	var DisplayInputManager = Display.InputManager = declare([InputManager],{
	
	});
	
	var Display = declare([ContainerVisual],{
		"-privates-"	:	{
		
			/**
			 * Returns gdi
			 */
			_gdiGetter	:	function()	{
				return this.element.getContext();
			},
			
			/**
			 * Returns CacheCanvas
			 */
			_createCacheCanvas	:	function() {
				var canvas = document.createElement("canvas");
				canvas.gdi = canvas.getContext("2d")
				return canvas; 
			},
			
			
			_widthSetter	: function(width) {
				this._width = width;
				// take into account pixel ratio
				this.element.width = width * pixelRatio;
				this.element.style.width = width + 'px';
			},
			
			_heightSetter : function(height) {
				this._height = height;
				// take into account pixel ratio
				this.element.height = height * pixelRatio;
				this.element.style.height = height + 'px';
			},
			
			_inputManagerGetter	:	function(){
			
			}
		},
		"-attributes-" : {
			width : {
				type	:	Number
			},
		
			height : {
				type	:	Number
			},
			
			inputManger	:	{
			
			}
		},
		
		"-methods-"	:	{
		
	        /**
	         * clear canvas
	         * @name clear
	         * @methodOf Canvas.prototype
	         */
	        clear: function() {
	            var g = this.gdi;
	            var el = this.getElement();
	            g.clearRect(0, 0, el.width, el.height);
	        },

			clearRect : function(/*Number*/ x, /*Number*/ y, /*Number*/ w, /*Number*/ h){
	            var g = this.gdi;
				g.clearRect(x,y,w,h);
				return this;
			},
	        
	        /**
	         * get canvas element
	         * @name getElement
	         * @methodOf Canvas.prototype
	         */
	        getElement: function() {
	            return this.element;
	        },


	        /**
	         * set size
	         * @name setSize
	         * @methodOf Canvas.prototype
	         * @param {Number} width
	         * @param {Number} height
	         */
	        setSize: function(width, height) {
	            this.setWidth(width);
	            this.setHeight(height);
	        },

		    fullScreen	: function() {
		        this.isFullScreen = true;        
		        this.setLocation(0,0);
		        this.setSize(window.innerWidth, window.innerHeight);
		    },

			/**
			 * to data url
			 * @name toDataURL
			 * @methodOf Canvas.prototype
			 * @param {String} mimeType
			 * @param {Number} quality between 0 and 1 for jpg mime types
			 */
	         toDataURL: function(mimeType, quality) {
	            try {
	                // If this call fails (due to browser bug, like in Firefox 3.6),
	                // then revert to previous no-parameter image/png behavior
	                return this.element.toDataURL(mimeType, quality);
	            }
	            catch(e) {
	                try {
	                    return this.element.toDataURL();
	                }
	                catch(e) {
	                    Global.warn('Unable to get data URL. ' + e.message)
	                    return '';
	                }
	            }
	        },
	        
	        toImageData	:	function(){
				var g = this.gdi,
					w = this.width,
					h = this.height;
				return g.getImageData(0,0,w,h);
			}
		},

	    /**
	     * Canvas Renderer constructor
	     * @constructor
	     * @param {Number} width
	     * @param {Number} height
	     */
		constructor : function(params) {
		},
		
        
	});
	
	
	Object.mixin(Display,{
		findDisplay : /*VisualHost*/function(/*Visual*/ v) {
		},
		createDisplay : function() {
		}
	});

	returen Display;
});
