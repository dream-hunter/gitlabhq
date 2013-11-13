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
	"dojo/Stateful",
	"qface/lang/declare",
	"qface/lang/AttributeChangedEvent"	
],function(kernel,dStateful,declare,AttributeChangedEvent) {
	var global = kernel.global;
	
	var Stateful = declare([dStateful],{
		"-privates-"	:	{
		},
		"-methods-"	:	{
			get	:	function(name){
				return this._get(name);
			},
			set	:	function(name,value){
				var oldValue = this._get(name);
				if (value != oldValue){
					this._set(name,value);
					var event = new AttributeChangedEvent({
						"value"	:	value,
						"oldValue"	:	oldValue
					});
					this.emit(event);
							
				}
				return this;
			}
		},
		"-events-" : {
			"attributeChanged"	: {
				type	: AttributeChangedEvent
			}
		},
		"-methods-"	:	function(){
		},
		
		
		constructor : function() {
		},
		
		//添付アトリビュートを追加する
		addAttetchedAttr : function(name) {
		},
		
		//添付アトリビュートを削除する
		removeAttetchedAttr : function(name) {
		}
	});
		
	return global.Stateful = Stateful;
	
});	