define( [
	"dojo/aspect",	// aspect.after
	"dojo/_base/declare", // declare
	"dojo/dom-class", // domClass.add domClass.remove domClass.replace
	"dojo/dom-geometry", // domGeometry.position
	"dojo/_base/event",	// event.stop
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/on",
	"dojo/touch",
	"qface/data/geom/Position",
	"qface/windows/input/Mouse",
	"qface/windows/input/Keyboard"
	
], function(aspect, declare,domClass, domGeometry,event, lang, on, touch,Position,Mouse,Keybord){

	// module:
	//		dijit/tree/_dndContainer

	/*=====
	 var __Args = {
		 // summary:
		 //		A dict of parameters for Tree source configuration.
		 // isSource: Boolean?
		 //		Can be used as a DnD source. Defaults to true.
		 // accept: String[]
		 //		List of accepted types (text strings) for a target; defaults to
		 //		["text", "treeNode"]
		 // copyOnly: Boolean?
		 //		Copy items, if true, use a state of Ctrl key otherwise,
		 // dragThreshold: Number
		 //		The move delay in pixels before detecting a drag; 0 by default
		 // betweenThreshold: Integer
		 //		Distance from upper/lower edge of node to allow drop to reorder nodes
	 };
	 =====*/

	return declare(null, {

		// summary:
		//		This is a base class for `qface/windows/media/_base/_dndSelector`, and isn't meant to be used directly.
		//		It's modeled after `dojo/dnd/Container`.
		// tags:
		//		protected

		/*=====
		// current: Visual
		//		The currently hovered TreeNode.rowNode (which is the DOM node
		//		associated w/a given node in the tree, excluding it's descendants)
		current: null,
		=====*/
		
		_createInputEventParam	:	function(e){
			var params = {};
		    var type = e.type;
			params.type = type;
			params.ctrlKey = e.ctrlKey;
			params.shiftKey = e.shiftKey;
			params.altKey = e.altKey;
			if (type.indexOf("mouse" > -1) {
				params.leftButton = (e.button & 0x1) == 0x1;
				params.middleButton = (e.button & 0x2) == 0x2;
				params.rightButton = (e.button & 0x4) == 0x4;
				var p = domGeometry.position(this.domNode);
				var x = e.pageX - p.x,y = e.pageY-p.y;
				params.position = new Point(x,y);
			
			} else if (type.indexOf("key")>-1) {
				params.keyCode = e.keyCode;
				params.charCode = e.charCode;
			}
			
			return params;
		
		
		};

		constructor: function(canvas, params){
			// summary:
			//		A constructor of the Container
			// canvas: Canvas
			//		Node or node's id to build the container on
			// params: __Args
			//		A dict of parameters, which gets mixed into the object
			// tags:
			//		private
			this.canvas = canvas;
			this.domNode = canvas.domNode;	
			lang.mixin(this, params);

			// class-specific variables
			this.current = null;	// current Visual Element

			// states
			this.containerState = "";
			domClass.add(this.domNode, "dojoDndContainer");

			// set up events
			this.events = [
				// Mouse (or touch) enter/leave on Tree itself
				on(this.domNode, touch.enter, lang.hitch(this, "onOverEvent")),
				on(this.domNode, touch.leave,	lang.hitch(this, "onOutEvent")),
				on(this.domNode, touch.press, lang.hitch(this,"onMouseDown")),
				on(this.domNode, touch.release, lang.hitch(this,"onMouseUp")),
				on(this.domNode, touch.move, lang.hitch(this,"onMouseMove"))

				// cancel text selection and text dragging
				on(this.domNode, "dragstart", lang.hitch(event, "stop")),
				on(this.domNode, "selectstart", lang.hitch(event, "stop"))
			];
		},

		destroy: function(){
			// summary:
			//		Prepares this object to be garbage-collected

			var h;
			while(h = this.events.pop()){ h.remove(); }

			// this.clearItems();
			this.domNode = this.parent = null;
		},

		

		_changeState: function(type, newState){
			// summary:
			//		Changes a named state to new state value
			// type: String
			//		A name of the state to change
			// newState: String
			//		new state
			var prefix = "dojoDnd" + type;
			var state = type.toLowerCase() + "State";
			//domClass.replace(this.domNode, prefix + newState, prefix + this[state]);
			domClass.replace(this.domNode, prefix + newState, prefix + this[state]);
			this[state] = newState;
		},

		_addItemClass: function(node, type){
			// summary:
			//		Adds a class with prefix "dojoDndItem"
			// node: Node
			//		A node
			// type: String
			//		A variable suffix for a class name
			domClass.add(node, "dojoDndItem" + type);
		},

		_removeItemClass: function(node, type){
			// summary:
			//		Removes a class with prefix "dojoDndItem"
			// node: Node
			//		A node
			// type: String
			//		A variable suffix for a class name
			domClass.remove(node, "dojoDndItem" + type);
		},

		onOverEvent: function(){
			// summary:
			//		This function is called once, when mouse is over our container
			// tags:
			//		protected
			this._changeState("Container", "Over");
		},

		onOutEvent: function(){
			// summary:
			//		This function is called once, when mouse is out of our container
			// tags:
			//		protected
			this._changeState("Container", "");
		}

		// mouse events
		onMouseDown: function(e){
			// summary:
			//		Event processor for onmousedown/ontouchstart
			// e: HtmlEvent
			//		onmousedown/ontouchstart event
			// tags:
			//		protected
			
			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new Mouse.MouseDownEvent(inputEventParams);
			this.onInput(inputEvent);

			// ignore right-click
			if(e.type != "touchstart" && !mouse.isLeft(e)){ return; }

			e.preventDefault();

			var visual = this.current,
			  copy = connect.isCopyKey(e), id = visual.id;

			// if shift key is not pressed, and the node is already in the selection,
			// delay deselection until onmouseup so in the case of DND, deselection
			// will be canceled by onmousemove.
			if(!this.singular && !e.shiftKey && this.selection[id]){
				this._doDeselect = true;
				return;
			}else{
				this._doDeselect = false;
			}
			this.userSelect(visual, copy, e.shiftKey);
		},

		onMouseUp: function(e){
			// summary:
			//		Event processor for onmouseup/ontouchend
			// e: HtmlEvent
			//		onmouseup/ontouchend event
			// tags:
			//		protected

			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new MouseUpEvent(inputEventParams);
			this.onInput(inputEvent);

			// _doDeselect is the flag to indicate that the user wants to either ctrl+click on
			// a already selected item (to deselect the item), or click on a not-yet selected item
			// (which should remove all current selection, and add the clicked item). This can not
			// be done in onMouseDown, because the user may start a drag after mousedown. By moving
			// the deselection logic here, the user can drags an already selected item.
			if(!this._doDeselect){ return; }
			this._doDeselect = false;
			this.userSelect(this.current, connect.isCopyKey(e), e.shiftKey);
		},
		onMouseMove: function(/*===== e =====*/){
			// summary:
			//		event processor for onmousemove/ontouchmove
			// e: HtmlEvent
			//		onmousemove/ontouchmove event
			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new Mouse.MouseMoveEvent(inputEventParams);
			this.onInput(inputEvent);

			this._doDeselect = false;
		},

		_compareNodes: function(n1, n2){
			if(n1 === n2){
				return 0;
			}

			if('sourceIndex' in document.documentElement){ //IE
				//TODO: does not yet work if n1 and/or n2 is a text node
				return n1.sourceIndex - n2.sourceIndex;
			}else if('compareDocumentPosition' in document.documentElement){ //FF, Opera
				return n1.compareDocumentPosition(n2) & 2 ? 1: -1;
			}else if(document.createRange){ //Webkit
				var r1 = doc.createRange();
				r1.setStartBefore(n1);

				var r2 = doc.createRange();
				r2.setStartBefore(n2);

				return r1.compareBoundaryPoints(r1.END_TO_END, r2);
			}else{
				throw Error("dijit.tree._compareNodes don't know how to compare two different nodes in this browser");
			}
		},

		//key events
		onKeyDown	:	function(e){
			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new Keyboard.KeyDownEvent(inputEventParams);
			this.onInput(inputEvent);
		},
		
		onKeyUp		:	function(e){
			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new Keyboard.KeyUpEvent(inputEventParams);
			this.onInput(inputEvent);
		},
		
		onKeyPress	:	function(e){
			var inputEventParams = this._createInputEventParam(e),
				inputEvent = new Keyboard.KeyPressEvent(inputEventParams);
			this.onInput(inputEvent);
		}
	});
});
