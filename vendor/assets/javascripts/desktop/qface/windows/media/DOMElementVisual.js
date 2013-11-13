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
	"qface/windows/media/Visual"
],function(declare,Visual) {

	var DOMElementVisual =  declare([Visual],{
		"-privates-" : {
		// private properties:
			/**
			 * @property _oldMtx
			 * @protected
			 */
			_oldMtx : null,
			/**
			 * @method _tick
			 * @protected
			 */
			_tick : function(params) {
				// TODO: figure out how to get around this.
				this.htmlElement.style.visibility = "hidden";
				//this.DisplayObject__tick(params);
				this.inherited(arguments);
			}
		},
		"-attributes-" : {
		// public properties:
			/**
			 * The DOM object to manage.
			 * @property htmlElement
			 * @type HTMLElement
			 */
			htmlElement : null,
		},
		"-methods-" : {
		// public methods:
			/**
			 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
			 * This does not account for whether it would be visible within the boundaries of the stage.
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method isVisible
			 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
			 */
			isVisible : function() {
				return this.htmlElement != null;
			},

			/**
			 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
			 * Returns true if the draw was handled (useful for overriding functionality).
			 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
			 * @method draw
			 * @param {CanvasRenderingContext2D} gctx The canvas 2D context object to draw into.
			 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
			 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
			 * into itself).
			 */
			draw : function(gctx, ignoreCache) {
				if (this.htmlElement == null) { return; }
				var mtx = this.getConcatenatedMatrix(this.matrix);
				
				var o = this.htmlElement;
				var style = o.style;
				
				// this relies on the _tick method because draw isn't called if a parent is not visible.
				if (this.visible) { style.visibility = "visible"; }
				else { return true; }
				
				var oMtx = this._oldMtx||{};
				if (oMtx.alpha != mtx.alpha) { style.opacity = ""+mtx.alpha; oMtx.alpha = mtx.alpha; }
				if (oMtx.tx != mtx.tx || oMtx.ty != mtx.ty || oMtx.a != mtx.a || oMtx.b != mtx.b || oMtx.c != mtx.c || oMtx.d != mtx.d) {
					style.transform = style.WebkitTransform = style.OTransform =  style.msTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,(mtx.tx+0.5|0),(mtx.ty+0.5|0)+")"].join(",");
					style.MozTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,(mtx.tx+0.5|0)+"px",(mtx.ty+0.5|0)+"px)"].join(",");
					this._oldMtx = mtx.clone();
				}
				
				return true;
			},

			/**
			 * Not applicable to DOMElement.
			 * @method cache
			 */
			cache : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method uncache
			 */
			uncache : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method updateCache
			 */
			updateCache : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method hitArea
			 */
			hitTest : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method localToGlobal
			 */
			localToGlobal : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method globalToLocal
			 */
			globalToLocal : function() {},

			/**
			 * Not applicable to DOMElement.
			 * @method localToLocal
			 */
			localToLocal : function() {},

			/**
			 * DOMElement cannot be cloned. Throws an error.
			 * @method clone
			 */
			clone : function() {
				throw("DOMElement cannot be cloned.")
			},

			/**
			 * Returns a string representation of this object.
			 * @method toString
			 * @return {String} a string representation of the instance.
			 */
			toString : function() {
				return "[DOMElement (name="+  this.name +")]";
			}
		},
		
		/**
		 * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b>
		 *
		 * A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
		 * within the DOM as though it is child of the {{#crossLink "Container"}}{{/crossLink}} it is added to. However, it is
		 * not rendered to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
		 * drawn in front of or behind the canvas).
		 *
		 * The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
		 * the DOM Object be added to a div that also contains the canvas so that they share the same position
		 * on the page.
		 *
		 * DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
		 * that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
		 * content.
		 *
		 * <h4>Mouse Interaction</h4>
		 *
		 * DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
		 * events or support methods like hitTest. To get mouse events from a DOMElement, you must instead add handlers to
		 * the htmlElement (note, this does not support EventDispatcher)
		 *
		 *      var domElement = new createjs.DOMElement(htmlElement);
		 *      domElement.htmlElement.onclick = function() {
		 *          console.log("clicked");
		 *      }
		 *
		 * @class DOMElement
		 * @extends DisplayObject
		 * @constructor
		 * @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
		 */
 		constructor : function(htmlElement) {
			if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
			this.mouseEnabled = false;
			this.htmlElement = htmlElement;
			var style = htmlElement.style;
			// this relies on the _tick method because draw isn't called if a parent is not visible.
			style.position = "absolute";
			style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
		
		},

	    
		/**
	     * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
		 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
		 * @event click
		 */
	          
	     /**
	     * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
		 * @event dblClick
		 */
	     
	     /**
	      * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 	  * are not full EaselJS display objects and do not participate in EaselJS mouse events.
		  * @event mousedown
		  */
	     
	     /**
	      * The HTMLElement can listen for the mouseover event, not the DOMElement instance.
	      * Since DOMElement instances are not full EaselJS display objects and do not participate in EaselJS mouse events.
	      * @event mouseover
		  */ 
	     
	     /**
	      * Not applicable to DOMElement.
		  * @event tick
		  */
	     

		

	});



	return DOMElementVisual;
});