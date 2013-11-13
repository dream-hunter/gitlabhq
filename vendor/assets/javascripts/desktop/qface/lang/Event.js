/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/kernel",
	"qface/lang/declare"
],function(kernel,declare) {
	var global = kernel.global;

	var Event = declare(null,{
	
		"-attributes-"	: {
			"name"	: {
				type : String,
				readOnly	: true
			},
			
			//The object that generated an event
			"target"	:	{
				type	:	Object,
				default	:	null,
				readOnly:	true
			},
			
			/**
			 * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
			 * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
	 		 * is generated from childObj, then a listener on parentObj would receive the event with
	 		 * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
	 		 **/
			"currentTarget"	:	{
				type	:	Object,
				default	:	null,
				readOnly:	true
			},
			
			/**
			  * For bubbling events, this indicates the current event phase:<OL>
			  * 	<LI> capture phase: starting from the top parent to the target</LI>
			  * 	<LI> at target phase: currently being dispatched from the target</LI>
			  * 	<LI> bubbling phase: from the target to the top parent</LI>
			  * </OL>
			  */
			"eventPhase"	:	{
				type	:	Number,
				default	:	0,
				readOnly:	true
			},
			
			//indicates whether the event will bubble through the display list
			"bubbles"	:	{
				type	:	Boolean,
				default	:	false,
				readOnly:	true
			},
			
			//Indicates whether the default behaviour of this event can be cancelled
			"cancelable":	{
				type	:	Boolean
				default	:	false,
				readOnly:	true
			},
			
			//The epoch time at which this event was created
			"timeStamp"	:	{
				type	:	Number,
				readOnly:	true
			},
			
			//Indicates if Event/preventDefault has been called  on this event
			"defaultPrevented"	:	{
				type	:	Boolean,
				default	:	false,
				readOnly:	true
			},
			
			//Indicates if Event/stopPropagation or Event/stopImmediatePropagation has been called on this event.
			"propagationStopped"	:	{
				type	:	Boolean,
				default	:	false,
				readOnly:	true
			},
			
			// Indicates if Event/stopImmediatePropagation has been called on this event
			"immediatePropagationStopped"	:	{
				type	:	Boolean,
				default	:	false,
				readOnly:	true
			}
		},
		
		"-methods-"	:	{
		
			/**
			 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true.
			 * Mirrors the DOM event standard.
			 * @method preventDefault
			 **/
			preventDefault : function() {
				this.defaultPrevented = true;
			},

			/**
			 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
			 * Mirrors the DOM event standard.
			 * @method stopPropagation
			 **/
			stopPropagation : function() {
				this.propagationStopped = true;
			},

			/**
			 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
			 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
			 * Mirrors the DOM event standard.
			 * @method stopImmediatePropagation
			 **/
			stopImmediatePropagation : function() {
				this.immediatePropagationStopped = this.propagationStopped = true;
			}
		
		},
		
		constructor	: function(params) {
			this._applyAttributes(params)
		}
	
	});
	
	return global.Event = Event;
	
});	