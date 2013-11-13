define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-geometry",
    "dijit/_Widget",
	"dijit/_TemplatedMixin",
    "dijit/Dialog",
	"dijit/focus",
], function(declare,lang,domGeom, _Widget,_TemplatedMixin,Dialog,focus) {

	var DialogUnderlay = declare([_Widget, _TemplatedMixin], {
		// summary:
		//		The component that blocks the screen behind a `dijit.Dialog`
		//
		// description:
		//		A component used to block input behind a `dijit.Dialog`. Only a single
		//		instance of this widget is created by `dijit.Dialog`, and saved as
		//		a reference to be shared between all Dialogs as `dijit._underlay`
		//
		//		The underlay itself can be styled based on and id:
		//	|	#myDialog_underlay { background-color:red; }
		//
		//		In the case of `dijit.Dialog`, this id is based on the id of the Dialog,
		//		suffixed with _underlay.

		// Template has two divs; outer div is used for fade-in/fade-out, and also to hold background iframe.
		// Inner div has opacity specified in CSS file.
		templateString: "<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' data-dojo-attach-point='node'></div></div>",

		// Parameters on creation or updatable later

		// dialogId: String
		//		Id of the dialog.... DialogUnderlay's id is based on this id
		dialogId: "",

		// class: String
		//		This class name is used on the DialogUnderlay node, in addition to dijitDialogUnderlay
		"class": "",

		dialogContainer : null,
		
		_setDialogIdAttr: function(id){
			domAttr.set(this.node, "id", id + "_underlay");
			this._set("dialogId", id);
		},

		_setClassAttr: function(clazz){
			this.node.className = "dijitDialogUnderlay " + clazz;
			this._set("class", clazz);
		},

		postCreate: function(){
			// summary:
			//		Append the underlay to the body
			var node = dialogContainer.containerNode ?dialogContainer.containerNode : dialogContainer.domNode;
			node.appendChild(this.domNode);
		},

		layout: function(){
			// summary:
			//		Sets the background to the size of the viewport
			//
			// description:
			//		Sets the background to the size of the viewport (rather than the size
			//		of the document) since we need to cover the whole browser window, even
			//		if the document is only a few lines long.
			// tags:
			//		private

			var is = this.node.style,
				os = this.domNode.style;

			// hide the background temporarily, so that the background itself isn't
			// causing scrollbars to appear (might happen when user shrinks browser
			// window and then we are called to resize)
			os.display = "none";

			// then resize and show
			var node = dialogContainer.containerNode ?dialogContainer.containerNode : dialogContainer.domNode;
			var viewport = domGeom.getContentBox(node);
			os.top = viewport.t + "px";
			os.left = viewport.l + "px";
			is.width = viewport.w + "px";
			is.height = viewport.h + "px";
			os.display = "block";
		},

		show: function(){
			// summary:
			//		Show the dialog underlay
			this.domNode.style.display = "block";
			this.layout();
			this.bgIframe = new BackgroundIframe(this.domNode);
		},

		hide: function(){
			// summary:
			//		Hides the dialog underlay
			this.bgIframe.destroy();
			delete this.bgIframe;
			this.domNode.style.display = "none";
		}
	});
	
	var DialogLevelManager = declare(null, {
		// summary:
		//		Controls the various active "levels" on the page, starting with the
		//		stuff initially visible on the page (at z-index 0), and then having an entry for
		//		each Dialog shown.

		_beginZIndex: 950,

		_dialogStack : null,
		
		_dialogContainer : null,
		
		_underlay : null,

		constructor: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
			this._dialogStack =  [
				{dialog: null, focus: null, underlayAttrs: null}	// entry for stuff at z-index: 0
			];
			this._dialogUnderlay = new DialogUnderlay({_dialogContainer:this._dialogContainer});
		},
		
		show: function(/*dijit/_WidgetBase*/ dialog, /*Object*/ underlayAttrs){
			// summary:
			//		Call right before fade-in animation for new dialog.
			//		Saves current focus, displays/adjusts underlay for new dialog,
			//		and sets the z-index of the dialog itself.
			//
			//		New dialog will be displayed on top of all currently displayed dialogs.
			//
			//		Caller is responsible for setting focus in new dialog after the fade-in
			//		animation completes.

			// Save current focus
			var ds = this._dialogStack;
			
			ds[ds.length-1].focus = focus.curNode;

			// Display the underlay, or if already displayed then adjust for this new dialog
			// TODO: one underlay per document (based on dialog.ownerDocument)
			var underlay = this._dialogUnderlay;

			underlay.set(dialog.underlayAttrs);

			// Set z-index a bit above previous dialog
			var zIndex = ds[ds.length-1].dialog ? ds[ds.length-1].zIndex + 2 : this._beginZIndex;
			if(ds.length == 1){	// first dialog
				underlay.show();
			}
			domStyle.set(underlay.domNode, 'zIndex', zIndex - 1);

			// Dialog
			domStyle.set(dialog.domNode, 'zIndex', zIndex);

			ds.push({dialog: dialog, underlayAttrs: underlayAttrs, zIndex: zIndex});
		},

		hide: function(/*dijit/_WidgetBase*/ dialog){
			// summary:
			//		Called when the specified dialog is hidden/destroyed, after the fade-out
			//		animation ends, in order to reset page focus, fix the underlay, etc.
			//		If the specified dialog isn't open then does nothing.
			//
			//		Caller is responsible for either setting display:none on the dialog domNode,
			//		or calling dijit/popup.hide(), or removing it from the page DOM.

			var ds = this._dialogStack;

			var underlay = this._dialogUnderlay;
			
			if(ds[ds.length-1].dialog == dialog){
				// Removing the top (or only) dialog in the stack, return focus
				// to previous dialog

				ds.pop();

				var pd = ds[ds.length-1];	// the new active dialog (or the base page itself)

				// Adjust underlay, unless the underlay widget has already been destroyed
				// because we are being called during page unload (when all widgets are destroyed)
				if(!underlay._destroyed){
					if(ds.length == 1){
						// Returning to original page.  Hide the underlay.
						underlay.hide();
					}else{
						// Popping back to previous dialog, adjust underlay.
						domStyle.set(underlay.domNode, 'zIndex', pd.zIndex - 1);
						underlay.set(pd.underlayAttrs);
					}
				}

				// Adjust focus
				if(dialog.refocus){
					// If we are returning control to a previous dialog but for some reason
					// that dialog didn't have a focused field, set focus to first focusable item.
					// This situation could happen if two dialogs appeared at nearly the same time,
					// since a dialog doesn't set it's focus until the fade-in is finished.
					var focus = pd.focus;
					if(pd.dialog && (!focus || !dom.isDescendant(focus, pd.dialog.domNode))){
						pd.dialog._getFocusItems(pd.dialog.domNode);
						focus = pd.dialog._firstFocusItem;
					}

					if(focus){
						// Refocus the button that spawned the Dialog.   This will fail in corner cases including
						// page unload on IE, because the dijit/form/Button that launched the Dialog may get destroyed
						// before this code runs.  (#15058)
						try{
							focus.focus();
						}catch(e){}
					}
				}
			}else{
				// Removing a dialog out of order (#9944, #10705).
				// Don't need to mess with underlay or z-index or anything.
				var idx = array.indexOf(array.map(ds, function(elem){return elem.dialog}), dialog);
				if(idx != -1){
					ds.splice(idx, 1);
				}
			}
		},

		isTop: function(/*dijit/_WidgetBase*/ dialog){
			// summary:
			//		Returns true if specified Dialog is the top in the task
			return ds[ds.length-1].dialog == dialog;
		},
		
		destroy : function() {
			this._dialogUnderlay.destroy();
		}
		
	});


	
	return declare(null, {
		_dialogManager : null
	
		constructor: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
		},
		
		showDialog : function() {
		},
		
		hideDialog : function() {
		},
		
		destroy : function() {
			this._dialogManager.destroy();
		}


	});
});
