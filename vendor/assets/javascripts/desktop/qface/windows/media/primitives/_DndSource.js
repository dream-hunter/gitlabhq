define([
	"dojo/_base/array", // array.forEach array.indexOf array.map
	"dojo/_base/connect", // isCopyKey
	"dojo/_base/declare", // declare
	"dojo/dom-class", // domClass.add
	"dojo/dom-geometry", // domGeometry.position
	"dojo/_base/event",	// event.stop
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/on", // subscribe
	"dojo/touch",
	"dojo/topic",
	"dojo/dnd/Manager" // DNDManager.manager
], function(array, connect, declare, domClass, domGeometry,event, lang, on, touch, topic, DNDManager){

// summary:
//		Handles  dom event and drag and drop operations (as a source or a target) for Canvas`


var _createInputEventParam	=	function(e){
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

/*=====
var __Item = {
	// summary:
	//		New item to be added to the Canvas, like:
	// id: Anything
	id: "",
	// name: String
	name: ""
};
=====*/

var _DomEventHandler = declare(null, {
	// summary:
	//		Handles  dom event and drag and drop operations (as a source or a target) for Canvas`

	// isSource: Boolean
	//		Can be used as a DnD source.
	isSource: true,

	// accept: Boolean
	//		Can accept the DnD source
	accept: true,

	// copyOnly: [private] Boolean
	//		Copy items, if true, use a state of Ctrl key otherwise
	copyOnly: false,

	// dragThreshold: Number
	//		The move delay in pixels before detecting a drag; 5 by default
	dragThreshold: 5,

	// betweenThreshold: Integer
	//		Distance from upper/lower edge of node to allow drop to reorder nodes
	betweenThreshold: 0,

	// Flag used by Avatar.js to signal to generate text node when dragging
	generateText: true,

	constructor: function(/*qface/windows/media/_host/Canvas*/ canvas, params){
		// summary:
		//		a constructor of the Canvas DnD Source
		// tags:
		//		private
		if(!params)a{ params = {}; }
		lang.mixin(this, params);

		// class-specific variables
		this.isDragging = false;
		this.isDraggable = false;
		this.mouseDown = false;
		this.accept	= false;
		this.targetAnchor = null;	// corresponding to the currently moused over Drawing Object
		this.targetBox = null;		// coordinates of this.targetAnchor
		this.dropPosition = "";		// whether mouse is over/after/before this.targetAnchor
		this._lastX = 0;
		this._lastY = 0;

		// states
		this.sourceState = "";
		if(this.isSource){
			domClass.add(this.domNode, "dojoDndSource");
		}

		this.targetState = "";
		if(this.accept){
			domClass.add(this.domNode, "dojoDndTarget");
		}

		// set up events
		this.events = [
			// Mouse (or touch) enter/leave on Tree itself
			on(this.domNode, touch.enter, lang.hitch(this, "onOverEvent")),
			on(this.domNode, touch.leave,	lang.hitch(this, "onOutEvent")),
			
			// Mouse (or touch) mousedown/mousemove/mouseup on Tree itself
			on(this.domNode, touch.press, lang.hitch(this,"onMouseDown")),
			on(this.domNode, touch.release, lang.hitch(this,"onMouseUp")),
			on(this.domNode, touch.move, lang.hitch(this,"onMouseMove"))

			// Keyboard keydown/keyup/keypress on Tree itself
			on(this.domNode, "keydown", lang.hitch(this,"onKeyDown")),
			on(this.domNode, "keypress", lang.hitch(this,"onKeyPress")),
			on(this.domNode, "keyup", lang.hitch(this,"onKeyUp"))

			on(canvas, "focus", function(e) {
				self._onMouseEnter(new MouseEnterEvent(e)))
			}),
			on(canvas, "blur", function(e) {
				self._onMouseEnter(new MouseEnterEvent(e)))
			}),

			// cancel text selection and text dragging
			on(this.domNode, "dragstart", lang.hitch(event, "stop")),
			on(this.domNode, "selectstart", lang.hitch(event, "stop"))
		];

		// set up events
		this.topics = [
			topic.subscribe("/dnd/source/over", lang.hitch(this, "onDndSourceOver")),
			topic.subscribe("/dnd/start", lang.hitch(this, "onDndStart")),
			topic.subscribe("/dnd/drop", lang.hitch(this, "onDndDrop")),
			topic.subscribe("/dnd/cancel", lang.hitch(this, "onDndCancel"))
		];
	},

	// methods
	copyState: function(keyPressed){
		// summary:
		//		Returns true, if we need to copy items, false to move.
		//		It is separated to be overwritten dynamically, if needed.
		// keyPressed: Boolean
		//		The "copy" control key was pressed
		// tags:
		//		protected
		return this.copyOnly || keyPressed;	// Boolean
	},
	
	destroy: function(){
		// summary:
		//		Prepares the object to be garbage-collected.
		var h;
		while(h = this.events.pop()){ h.remove(); }

		// this.clearItems();
		this.domNode = this.parent = null;

		while(h = this.topics.pop()){ h.remove(); }
		this.targetAnchor = null;

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
		domClass.replace(this.domNode, prefix + newState, prefix + this[state]);
		this[state] = newState;
	},
	
	// mouse events
	_onDragMouse: function(e, firstTime){
		// summary:
		//		Helper method for processing onmousemove/onmouseover events while drag is in progress.
		//		Keeps track of current drop target.
		// e: HtmlEvent
		//		The mousemove event.
		// firstTime: Boolean?
		//		If this flag is set, this is the first mouse move event of the drag, so call m.canDrop() etc.
		//		even if newTarget == null because the user quickly dragged a node in the Tree to a position
		//		over Tree.containerNode but not over any TreeNode (#7971)

		var m = DNDManager.manager(),
			canvas = this.canvas,
			oldTarget = this.targetAnchor,			// the TreeNode corresponding to TreeNode mouse was previously over
			newTarget = this.current,				// TreeNode corresponding to TreeNode mouse is currently over
			oldDropPosition = this.dropPosition;	// the previous drop position (over/before/after)

		var pos = e.position,
			dragObject = e.dragObject,
			oldTarget = this.targetAnchor,			// the Element corresponding to TreeNode mouse was previously over
			newTarget = this.find(pos);				// Element corresponding to TreeNode mouse is currently over
			
		if (newTarget != oldTarget) {
			
			if (oldTarget) {
				var dragLeaveEventParams = null,
					dragLeaveEvent = new DragDrop.DragLeaveEvent(dragLeaveEventParams);
				this.onInput(dragLeaveEvent);
				this.accept = false;
				this.targetAnchor = null;
			}
			if (newTarget) {
				this.targetAnchor = newTarget;
				var dragEnterEventParams = null,
					dragEnterEvent = new DragDrop.DragLeaveEvent(dragEnterEventParams);
				this.onInput(dragEnterEvent);

				this.accept = dragEnterEvent.canAccept;
				
				if (this.accept) {
					desk.setCurrentCursor(newTarget.getDragCursor());
				} else {
				}
			}
		} else if (newTarget){
			var dragMoveEventParams = null,
				dragMoveEvent = new DragDrop.DragMoveEvent(dragMoveEventParams);
			this.onInput(dragLeaveEvent);
			this.accept = dragMoveEvent.canAccept;
		}
		this.dropPosition = newDropPosition;
		m.canDrop(this.accept);
	},

	onMouseMove: function(e){
		// summary:
		//		Called for any onmousemove/ontouchmove events over the Tree
		// e: Event
		//		onmousemouse/ontouchmove event
		// tags:
		//		private
		
		var inputEventParams = this._createInputEventParam(e),
			inputEvent = new Mouse.MouseMoveEvent(inputEventParams);
		this.onInput(inputEvent);

		if(this.isDragging && this.targetState == "Disabled"){ return; }

		if(this.isDragging){
			this._onDragMouse(e);
		}else if (this.isDraggable){
			var m = DNDManager.manager();
			if (Math.abs(e.pageX-this._lastX)>=this.dragThreshold || Math.abs(e.pageY-this._lastY)>=this.dragThreshold ){
				var dragStarEventParams = null,
					dragStartEvent = new DragDrop.DragStartEvent(dragStarEventParams);
				this.onInput(dragStartEvent);
				
				m.startDrag(this, nodes, this.copyState(connect.isCopyKey(e)));
				this._onDragMouse(e, true);	// because this may be the only mousemove event we get before the drop
			}
		}
	},

	onMouseDown: function(e){
		// summary:
		//		Event processor for onmousedown/ontouchstart
		// e: Event
		//		onmousedown/ontouchend event
		// tags:
		//		private
		this.mouseDown = true;
		this.mouseButton = e.button;
		this._lastX = e.pageX;
		this._lastY = e.pageY;

		var inputEventParams = this._createInputEventParam(e),
			inputEvent = new Mouse.MouseDownEvent(inputEventParams);
		this.onInput(inputEvent);
		
		this.idDraggable = inputEvent.idDraggable;

	},

	onMouseUp: function(e){
		// summary:
		//		Event processor for onmouseup/ontouchend
		// e: Event
		//		onmouseup/ontouchend event
		// tags:
		//		private
		if(this.mouseDown){
			this.mouseDown = false;
			this.draggable = false;
			this.dragging = false;
		}
		var inputEventParams = this._createInputEventParam(e),
			inputEvent = new MouseUpEvent(inputEventParams);
		this.onInput(inputEvent);
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


	// topic event processors
	onDndSourceOver: function(source){
		// summary:
		//		Topic event processor for /dnd/source/over, called when detected a current source.
		// source: Object
		//		The dijit/tree/dndSource / dojo/dnd/Source which has the mouse over it
		// tags:
		//		private
		if(this != source){
			this.mouseDown = false;
			this._unmarkTargetAnchor();
		}else if(this.isDragging){
			var m = DNDManager.manager();
			m.canDrop(false);
		}
	},

	onDndStart: function(source, nodes, copy){
		// summary:
		//		Topic event processor for /dnd/start, called to initiate the DnD operation
		// source: Object
		//		The dijit/tree/dndSource / dojo/dnd/Source which is providing the items
		// nodes: DomNode[]
		//		The list of transferred items, dndTreeNode nodes if dragging from a Tree
		// copy: Boolean
		//		Copy items, if true, move items otherwise
		// tags:
		//		private

		if(this.isSource){
			this._changeState("Source", this == source ? (copy ? "Copied" : "Moved") : "");
		}
		var accepted = this.checkAcceptance(source, nodes);

		this._changeState("Target", accepted ? "" : "Disabled");

		if(this == source){
			DNDManager.manager().overSource(this);
		}

		this.isDragging = true;
	},

	onDndDrop: function(source, nodes, copy){
		// summary:
		//		Topic event processor for /dnd/drop, called to finish the DnD operation.
		// description:
		//		Updates data store items according to where node was dragged from and dropped
		//		to.   The tree will then respond to those data store updates and redraw itself.
		// source: Object
		//		The dijit/tree/dndSource / dojo/dnd/Source which is providing the items
		// nodes: DomNode[]
		//		The list of transferred items, dndTreeNode nodes if dragging from a Tree
		// copy: Boolean
		//		Copy items, if true, move items otherwise
		// tags:
		//		protected
		if(this.containerState == "Over"){
				target = this.targetAnchor;

			this.isDragging = false;

		}
		this.onDndCancel();
	},

	onDndCancel: function(){
		// summary:
		//		Topic event processor for /dnd/cancel, called to cancel the DnD operation
		// tags:
		//		private
		this._unmarkTargetAnchor();
		this.isDragging = false;
		this.mouseDown = false;
		delete this.mouseButton;
		this._changeState("Source", "");
		this._changeState("Target", "");
	},

	// When focus moves in/out of the entire Tree
	onOverEvent: function(){
		// summary:
		//		This method is called when mouse is moved over our container (like onmouseenter)
		// tags:
		//		private
		this._changeState("Container", "Over");
		DNDManager.manager().overSource(this);
	},
	onOutEvent: function(){
		// summary:
		//		This method is called when mouse is moved out of our container (like onmouseleave)
		// tags:
		//		private
		this._unmarkTargetAnchor();
		var m = DNDManager.manager();
		if(this.isDragging){
			m.canDrop(false);
		}
		m.outSource(this);

		this._changeState("Container", "");
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
	},

	_unmarkTargetAnchor: function(){
		// summary:
		//		Removes hover class of the current target anchor
		// tags:
		//		private
		if(!this.targetAnchor){ return; }
		this._removeItemClass(this.targetAnchor.rowNode, this.dropPosition);
		this.targetAnchor = null;
		this.targetBox = null;
		this.dropPosition = null;
	},

	_markDndStatus: function(copy){
		// summary:
		//		Changes source's state based on "copy" status
		this._changeState("Source", copy ? "Copied" : "Moved");
	}
});

/*=====
dndSource.__Item = __Item;
=====*/

return _DomEventHandler;
});
