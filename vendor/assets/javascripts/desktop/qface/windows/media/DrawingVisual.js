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
	"qface/windows/media/Visual",
	"qface/windows/media/DrawingContext"
],function(declare,Visual,DrawingContext) {

	var DrawingVisual = declare(Visual,{
		"-privates-" : {
		},
		"-attributes-" : {
			"context" : {
				getter : function() {
					return new DrawingContext(this);
				}
			}
		},
		"-methods-" : {
			/**
			 * Draws the Shape into the specified context ignoring it's visible, alpha, shadow, and transform. Returns true if
			 * the draw was handled (useful for overriding functionality).
			 *
			 * <i>NOTE: This method is mainly for internal use, though it may be useful for advanced uses.</i>
			 * @method draw
			 * @param {CanvasRenderingContext2D} gctx The canvas 2D context object to draw into.
			 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. For example,
			 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
			 **/
			draw : function(gctx, ignoreCache) {
				if (this.inherited(arguments)) { return true; }
				this.context.draw(ctx);
				return true;
			}
		},
		

		constructor : function() {
		}
	});
	
	
	return DrawingVisual;
	
});	
