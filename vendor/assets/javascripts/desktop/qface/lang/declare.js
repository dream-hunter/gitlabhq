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
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/on",
	"dojo/aspect"
],function(kernel,djDeclare,lang,array,on,aspect) {
	var global = kernel.global;
	
	var _classId = 0;
	
	var getClassId = function(){
		return "QfaceClass_"+(++_classId);
	};
	
	var getEventCallBackId = function(/*Class*/ type){
		return "_evt"+type.declaredClass
	};
	
	var AttrsKeyName = "-attributes-",
	    PrivatesKeyName = "-privates-",
	    MethodsKeyName = "-methods-",
	    EventsKeyName = "-events-";

	var _QClass = djDeclare("_QClass",null,{

		destroy: function(/*Boolean*/ preserveDom){
			// summary:
			//		Destroy this class, releasing any resources registered via own().
			this._destroyed = true;
		},

		own: function(){
			// summary:
			//		Track specified handles and remove/destroy them when this instance is destroyed, unless they were
			//		already removed/destroyed manually.
			// tags:
			//		protected
			// returns:
			//		The array of specified handles, so you can do for example:
			//	|		var handle = this.own(on(...))[0];

			array.forEach(arguments, function(handle){
				var destroyMethodName =
					"destroy" in handle ? "destroy" :
					"remove";

				// When this is destroyed, destroy handle.  Since I'm using aspect.before(),
				// the handle will be destroyed before a subclass's destroy() method starts running, before it calls
				// this.inherited() or even if it doesn't call this.inherited() at all.  If that's an issue, make an
				// onDestroy() method and connect to that instead.
				handle._odh = aspect.before(this, "destroy", function(preserveDom){
					handle._odh.remove();
					handle[destroyMethodName](preserveDom);
				});

				// If handle is destroyed manually before this is destroyed, then remove the listener set directly above.
				aspect.after(handle, destroyMethodName, function(){
					handle._odh.remove();
				});
			}, this);

			return arguments;		// handle
		},
	
		emit: function(/*Event?*/ event){
			// summary:
			//		Used by Object to signal that a synthetic event occurred, ex:
			//	|	object.emit("attributeChanged", 
			//					new AttributeChangedEvent({
			//						"attributeName": "value",
			//						"newValue"	:	newValue,
			//						"oldValue"	:	oldValue
			//					})
			//		).
			//
			// tags:
			//		protected

			var ret, 
				ctoc = event.constructor, 
				callbackId = getEventCallBackId(ctoc), 
				callback = this[callbackId];
				
			if(callback){
				ret = callback.apply(this, [event]);
			}

			return ret;
		},

		on: function(/*Class*/ type, /*Function*/ func,/*Object*/ctx){
			// summary:
			//		Call specified function when event occurs, ex: object.on("attributeChanged", listenerFunction,listenerFunctionOwner).
			// type:
			//		Class of event (ex: AttributeChanged) .
			// description:
			//		Call specified function when event `type` occurs, ex: `object.on("attributeChanged",  listenerFunction,listenerFunctionOwner)`.

			var callbackId = this._onMap(type);
			if(callbackId){
				if (ctx) { func = lang.hitch(ctx,func);}
				return this.own(aspect.after(this, callbackId, func, true));
			}
		},

		_onMap: function(/*Class*/ type){
			// summary:
			//		Maps on() type parameter (ex: "mouseMove") to method name (ex: "onMouseMove").
			//		If type is a synthetic event like touch.press then returns undefined.
			
			callbackId = getEventCallBackId(type), 
			if (this[callbackId]) {
				return callbackId;
			}
			var ctor = this.constructor,
				meta = ctor._meta;
				bases = meta.bases,
				pos = 0;
			do{
				var eventsDesc = ctor[EventsKeyName];
				for (var name in eventsDesc) {
					if (eventsDesc[name].type === type) {
						this[callbackId] = Function.Empty;
						return callbackId;
					}
				}	
			}while(ctor = bases[pos++]); // intentional assignment
		},

		_attrDefaultValue	:	function(name){
			// summary:
			// get attribute's default value
			var ctor = this.constructor,
				meta = ctor._meta;
				bases = meta.bases,
				pos = 0;
			do{
				var attrsDesc = ctor[AttrsKeyName];
				if (attrsDesc[name]) {
					return attrsDesc[name].default;
				}
			}while(ctor = bases[pos++]); // intentional assignment		
		},
		
		_cmnAttrGetter	:	function(name){
			return this["_"+name];
		},
		
		_cmnAttrSetter	:	function(name,value){
			this["_"+name]	= value;
		},
				
		_applyAttributes: function(params){
			// summary:
			//		Step during object creation to copy  attributes to the object
			for(var param in params){
				this._set(param, this.params[param]);
			}
		},
		
		_get	:	function(name){
			var	value,
				attrGetterName = "_" + name + "Getter";
				
			if (this[attrGetterName]) {
				value = this[attrGetterName]();
				if (value === undefined) {
					value = this._attrDefaultValue(name);
				}
			} 
			return value;
		},
		_set	:	function(name,value){
			var	value,
				attrSetterName = "_" + name + "Setter";

			if (this[attrSetterName]) {
				this[attrSetterName](value);
			} 
			return this;
		}
	
	};
	

	//	|	var ClassA = declare(SuperClassB, {
	//	|		"-privates-"	: {
	//	|		},
	//	|		"-attributes-"	: {
	//	|			attr1:	 {
	//	|						type	: Number,
	//	|						getter 	: function() {
	//	|						},
	//	|						setter 	: function() {
	//	|						}
	//	|			}
	//	|		},
	//	|		"-methods-"	: {
	//	|			method1: function(){
	//	|				console.log("before calling F.method...");
	//	|				this.inherited(arguments);
	//	|				console.log("...back in A");
	//	|			}
	//	|		},
	//	|		"-events-"	: [
	//	|			"event1": {
	//	|				type	: Event1Event,
	//	|			}
	//	|			
	//	|		],
	//	|		constructor: function(){
	//	|			console.log("A.constructor");
	//	|		},
	//	|	});
	var declare = function(superclass, props) {
		var classId = getClassId();
		if (!superclass) {
			superclass = _QClass;
		}
		var ctor = djDeclare(classId,superclass,props),
		    proto = ctor.prototype,
		    attrsDesc  = proto[AttrsKeyName],
		    privatesDesc = proto[PrivatesKeyName],
		    methodsDesc = proto[MethodsdKeyName],
		    eventsDesc = proto[EventsKeyName];
		    
		if(privatesDesc) {
			ctor[PrivatesKeyName] = privatesDesc;
			delete proto[PrivatesKeyName];
			
			for (name in privatesDesc) {
				proto[name] = privatesDesc[name];
			}
		}	
		
		if(attrsDesc) {
			ctor[AttrsKeyName] = attrsDesc;
			delete proto[AttrsKeyName];
			
			for (name in attrsDesc) {
				var desc =  attrsDesc[name],
				    getterName = "_" + name + "Getter",
				    setterName = "_" + name + "Setter"; 
				
				if (desc.getter) {
					proto[getterName] = desc.getter;
				}
				if (!proto[getterName] ) {
					proto[getterName] = function() {
						return this._cmnAttrGetter(name);
					};
				}

				if (desc.setter) {
					proto[setterName] = desc.setter;
				}

				if ( !proto[setterName]) {
					proto[setterName] = function(value) {
						this._cmnAttrSetter(name,value);
					};
				}

				Object.defineProperty(proto,name,{
					get : function() {
						if (this.get) {
							return this.get(name);
						} else {
							return this._get(name);
						}
					},
					set : desc.readOnly?undefined:function(newValue) {
						if (this.set) {
							return this.set(name,newValue);
						} else {
							return this._set(name,newValue);
						}
					}
				});	
			}
		}
		
		if(methodsDesc) {
			ctor[MethodsKeyName] = methodsDesc;
			delete proto[MethodsKeyName];
			
			for (name in methodsDesc) {
				proto[name] = methodsDesc[name];
			}
		}	

		if(eventsDesc) {
			ctor[EventsKeyName] = methodsDesc;
			delete proto[EventsKeyName];
		}
		
		return ctor;
	};
	
	return global.declare = declare;
	
});	