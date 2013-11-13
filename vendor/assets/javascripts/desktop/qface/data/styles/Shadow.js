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
	"qface/data/styles/Color"
], function(declare,Color){
	
	var Shadow = delcare(null,{
		"-attributes-" : {
		// public properties:
			/** The color of the shadow.
			 * property color
			 * @type String
			 * @default null
			 */
			"color" : {
				type : Color
			},
			
			/** The x offset of the shadow.
			 * property offsetX
			 * @type Number
			 * @default 0
			 */
			"offsetX" : {
				type : Number,
				default ; 0
			},	
			
			/** The y offset of the shadow.
			 * property offsetY
			 * @type Number
			 * @default 0
			 */
			"offsetY" : {
				type : Number,
				default ; 0
			},	
			
			/** The blur of the shadow.
			 * property blur
			 * @type Number
			 * @default 0
			 */
			"blur" : {
				type : Number,
				default ; 0
			}
		},
		"-methods-" : {
		
		// public methods:
			/**
			 * Returns a string representation of this object.
			 * @method toString
			 * @return {String} a string representation of the instance.
			 **/
			toString : function() {
				return "[Shadow]";
			},
			
			
			/**
			 * Returns a clone of this Shadow instance.
			 * @method clone
			 * @return {Shadow} A clone of the current Shadow instance.
			 **/
			clone : function() {
				return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
			}
			
		},
		/**
		 * This class encapsulates the properties required to define a shadow to apply to a {{#crossLink "DisplayObject"}}{{/crossLink}}
		 * via it's <code>shadow</code> property.
		 *
		 * <h4>Example</h4>
		 *      myImage.shadow = new createjs.Shadow("#000000", 5, 5, 10);
		 *
		 * @class Shadow
		 * @constructor
		 * @param {String} color The color of the shadow.
		 * @param {Number} offsetX The x offset of the shadow in pixels.
		 * @param {Number} offsetY The y offset of the shadow in pixels.
		 * @param {Number} blur The size of the blurring effect.
		 **/
		constructor : function(color, offsetX, offsetY, blur) {
			this.color = Color.from(color);
			this.offsetX = offsetX;
			this.offsetY = offsetY;
			this.blur = blur;
		}		
		
	});
	
	
// static public properties:
	/**
	 * An identity shadow object (all properties are set to 0). Read-only.
	 * @property identity
	 * @type Shadow
	 * @static
	 * @final
	 **/
	
	// this has to be populated after the class is defined:
	Shadow.identity = new Shadow("transparent", 0, 0, 0);
	
	return Shadow;
}());