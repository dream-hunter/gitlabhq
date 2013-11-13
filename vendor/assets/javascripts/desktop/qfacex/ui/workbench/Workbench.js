/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/04/28
 */
define([
	"require",
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/on",
	"dojo/Evented",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"qface/lang/Path",
	"qfacex/ui/ide/model/Workspace",
	"qfacex/ui/workbench/ViewPart",
	"qfacex/widgets/PopupMenu",
	"qfacex/ui/workbench/EditorContainer",
	"qface/windows/Dialog",
	"dijit/Toolbar",
	"dijit/ToolbarSeparator",
	"dijit/Menu",
	"dijit/MenuBar",
	"dijit/MenuItem",
	"dijit/MenuSeparator",
	"dijit/PopupMenuBarItem",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/form/ComboButton",
	"dijit/form/ToggleButton",
	"qfacex/widgets/layout/BorderContainer",
	"dijit/layout/StackController",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabController",
	"dijit/layout/TabContainer",
	"dojo/i18n!./nls/webContent",
	"dojo/json",
	"dojo/Deferred",
	"dojo/promise/all",
	"dojo/_base/connect",
	"dojo/_base/xhr",
	"dojo/dnd/Mover",
	"qfacex/util/GeomUtils",
	 "openstar/services/filesystem",
	"dojo/i18n!./nls/workbench",
	"dojo/text!./templates/Workbench.html"	
                          
],function(
		require,
		declare,
		deferred,
		lang,
		topic,
		on,
		Evented,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		Path,
		Workspace,
		ViewPart,
		PopupMenu,
		EditorContainer,
		Dialog,
		Toolbar,
		ToolbarSeparator,
		Menu,
		MenuBar,
		MenuItem,
		MenuSeparator,
		PopupMenuBarItem,
		Button,
		DropDownButton,
		ComboButton,
		ToggleButton,
		BorderContainer,
		StackController,
		StackContainer,
		ContentPane,
		TabController,
		TabContainer,
		webContent,
		JSON,
		Deferred,
		all,
		connect,
		xhr,
		Mover,
		GeomUtils,
		srvFilesystem,
		workbenchStrings,
		tplWorkbench
) {
var paletteTabWidth = 71;	// Width of tabs for left- and right-side palettes
var paletteTabDelta = 20;	// #pixels - if this many or fewer pixels of tab are showing, treat as collapsed
var paletteCache = {};

// Cheap polyfill to approximate bind(), make Safari happy
Function.prototype.bind = Function.prototype.bind || function(that){ return dojo.hitch(that, this);};

// Convert filename path into an ID string
var filename2id = function(fileName) {
	return "editor-" + encodeURIComponent(fileName.replace(/[\/| |\t]/g, "_")).replace(/%/g, ":");
};
// Convert the result from filename2id into a different ID string that replaces "editor" with "shadow"
var editorIdToShadowId = function(editorFileName) {
	return editorFileName.replace(/^editor/, "shadow");
};
//Convert the result from filename2id into a different ID string that replaces "editor" with "shadow"
var shadowIdToEditorId = function(shadowFileName) {
	return shadowFileName.replace(/^shadow/, "editor");
};

	var  Plugin;
	var  Workbench = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		templateString: tplWorkbench,
		
	    
		_DEFAULT_PROJECT: "project1",
/*				
		activePerspective: "",
		actionScope: [],
		hideEditorTabs: true,
		_editorTabClosing: {},
		_shadowTabClosing: {},
		_container : null,
*/		
		
		_hub : null, //new Evented,
		/*
		 * params = {
		 *  registry : null, //Registry		 *  metadata : null, //Metadata
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 * }
		*/
		constructor: function(params, srcNodeRef){
			this.activePerspective = "";
			this.actionScope = [];
			this._editorTabClosing = {};
			this._shadowTabClosing = {};
			this._views = {};
			this._editors = {};
			this._shadows = {};
			this.currentSelection = [];
			this._hub = new Evented();
		},
		

		// summary:
		//		Pubsub hub.
		// example:
		//		| 	subscribe("some/topic", function(event){
		//		|	... do something with event
		//		|	});
		//		|	publish("some/topic", {name:"some event", ...});

		publish: function(topic, event){
			// summary:
			//		Publishes a message to a topic on the pub/sub hub. All arguments after
			//		the first will be passed to the subscribers, so any number of arguments
			//		can be provided (not just event).
			// topic: String
			//		The name of the topic to publish to
			// event: Object
			//		An event to distribute to the topic listeners
			return this._hub.emit.apply(this._hub, arguments);
		},

		subscribe: function(topic, listener){
			// summary:
			//		Subscribes to a topic on the pub/sub hub
			// topic: String
			//		The topic to subscribe to
			// listener: Function
			//		A function to call when a message is published to the given topic
			return this._hub.on.apply(this._hub, arguments);
		},
		
		resize: function() {
			this.davinci_app.resize();
		},

		run: function(/*Registry*/registry,/*Metadata*/ metadata ) { //modified by LWF
//			this._container = container;
//			this.activePerspective = "";
//			this.actionScope = [];
//			this._editorTabClosing = {};
//			this._shadowTabClosing = {};
			
			this.registry = registry;
			this._initKeys();
//			this._baseTitle = dojo.doc.title;

			if (dojo.isMac) {
				dojo.addClass(this.domNode,"isMac"); //moved from Runtime by LWF
			}
			
			// intercept BS key - prompt user before navigating backwards
			dojo.connect(dojo.doc.documentElement, "onkeypress", function(e){
				if(e.charOrCode==8){
					window.davinciBackspaceKeyTime = Date.now();
				}
			});	
			//UserActivityMonitor.setUpInActivityMonitor(dojo.doc);

			// add key press listener
			dojo.connect(dojo.doc.documentElement, "onkeydown", this, "_handleGlobalDocumentKeyEvent");
			
			this.subscribe("/davinci/resource/resourceChanged", lang.hitch(this,
				function (type, changedResource) {
					if (type == 'deleted') {
						var editorId = filename2id(changedResource.getPath());
						var shadowId = editorIdToShadowId(editorId);
						var editorContainer = this._editors[editorId];//dijit.byId(editorId);
						var shadowTab = this._shodows[shadowId];//dijit.byId(shadowId);
						if (editorContainer && !editorContainer._isClosing) {
							var editorsContainer = this.editors_container; //  dijit.byId("editors_container");
							var shadowTabContainer = this.davinci_file_tabs; // dijit.byId("davinci_file_tabs");
							editorsContainer.removeChild(editorContainer);
							editorContainer.destroyRecursive();
							shadowTabContainer.removeChild(shadowTab);
-							shadowTab.destroyRecursive();
						}
					}
				}
			));
			//topic.subscribe('/dojo/io/error', lang.hitch(this,handleIoError)); // /dojo/io/error" is sent whenever an IO request has errored.  //modified by LWF 20130510
			                                                   // requires djConfig.ioPublish be set to true in pagedesigner.html

			this.subscribe("/davinci/states/state/changed",lang.hitch(this,
				function(e) {
					// e:{node:..., newState:..., oldState:...}
					var currentEditor = this.currentEditor; //modified by LWF
					// ignore updates in theme editor and review editor
					if (currentEditor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor"))){
						currentEditor.visualEditor.onContentChange.apply(currentEditor.visualEditor, arguments);
					}
				}
			));
			this.subscribe("/davinci/ui/widgetPropertiesChanges",lang.hitch(this,
				function() {
					var ve = this.currentEditor.visualEditor; //modified by LWF
					ve._objectPropertiesChange.apply(ve, arguments);
				}
			));

			// bind overlay widgets to corresponding davinci states. singleton; no need to unsubscribe
			this.subscribe("/davinci/states/state/changed",lang.hitch(this, function(args) {
				//FIXME: This is page editor-specific logic within Workbench.
				var context = (this.currentEditor && this.currentEditor.isInstanceOf(require("qfacex/ui/ide/ve/PageEditor")) &&   //modified by LWF
						this.currentEditor.visualEditor && this.currentEditor.visualEditor.context);
				if(!context){
					return;
				}
				var prefix = "_show:", widget, dvWidget, helper;
				var thisDijit = context ? context.getDijit() : null;
				var widgetUtils = require("qfacex/ui/ide/ve/widget");
				if (args.newState && !args.newState.indexOf(prefix)) {
					widget = thisDijit.byId(args.newState.substring(6));
					dvWidget = widgetUtils.getWidget(widget.domNode);
					helper = dvWidget.getHelper();
					helper && helper.popup && helper.popup(dvWidget);
				}
				if (args.oldState && !args.oldState.indexOf(prefix)) {
					widget = thisDijit.byId(args.oldState.substring(6));
					dvWidget = widgetUtils.getWidget(widget.domNode);
					helper = dvWidget.getHelper();
					helper && helper.tearDown && helper.tearDown(dvWidget);
				}
			}));

			// bind overlay widgets to corresponding davinci states. singleton; no need to unsubscribe
			this.subscribe("/davinci/ui/repositionFocusContainer", lang.hitch(this,function(args) {
				this._repositionFocusContainer();
			}));
			
			this.subscribe("/davinci/ui/selectionChanged",this._selectionChanged.bind(this)); // moved from runtime by LWF


		
			this._workspace = new Workspace({
				//project : workbench.getProject()
			});

			var perspective = this.initialPerspective || "davinci.ui.main";  //modified by LWF
			this.showPerspective(perspective);
			
			all(this._showViewPromises).then(lang.hitch(this,function(){
				this._updateTitle();
				this.initializeWorkbenchState();			
				
				var loading = dojo.query('.loading');
				if (loading[0]){ // remove the loading div
					loading[0].parentNode.removeChild(loading[0]);
				}
				this._lastAutoSave = Date.now();
				setInterval(dojo.hitch(this,"_autoSave"),30000);
			}));
		},

		unload: function () {
			this._autoSave();
		},

		/**
		 * Creates a toolbar widget out of the definitions in the plugin file(s)
		 * @param {string} toolbarProp  The property name from plugin file that corresponds to this particular toolbar
		 * @param {Element} targetDiv  Container DIV into which this toolbar should be instantiated
		 * @param actionSets  Action sets from plugin file(s)
		 * @param context  Document context FIXME: 95% sure that parameter is obsolete
		 * @returns {Toolbar}  toolbar widget
		 */
		_createToolBar: function (toolbarProp, targetDiv, actionSets, context){
			var _toolbarcache = [];
			if (!actionSets) {
			   actionSets = this.registry.getExtensions('davinci.actionSets');
			}
			for (var i = 0, len = actionSets.length; i < len; i++) {
				var actions = actionSets[i].actions;
				for (var k = 0, len2 = actions.length; k < len2; k++) {
					var action = actions[k],
						toolBarPath = action[toolbarProp];
					if (toolBarPath) {
						if (!_toolbarcache[toolBarPath]) {
							_toolbarcache[toolBarPath] = [];
						}
						_toolbarcache[toolBarPath].push(action);
					}
				}
			}
			
			var workbench = this;
		
			var toolbar1 = new Toolbar({'class':"davinciToolbar"}, targetDiv);   
			var radioGroups = {};
			var firstgroup = true;
			for (var value in _toolbarcache) {
				if (!firstgroup) {
					var separator = new ToolbarSeparator();
					toolbar1.addChild(separator);
				} else {
					firstgroup = false;
				}
				var children;
				var actions = _toolbarcache[value];
				for (var p = 0; p<actions.length; p++) {
					var action = actions[p];
					var id = action.id;
					// dont add dupes
			
					this._loadActionClass(action);
					var parms = {showLabel:false/*, id:(id + "_toolbar")*/};
					['label','showLabel','iconClass'].forEach(function(prop){
						if(action.hasOwnProperty(prop)){
							parms[prop] = action[prop];
						}
					});
					if (action.className) {
						parms['class'] = action.className;
					}
					var dojoAction;
					var dojoActionDeferred = new Deferred();
					if(action.menu && (action.type == 'DropDownButton' || action.type == 'ComboButton')){
						var menu = new Menu({
							style: "display: none;"
						});
						for(var ddIndex=0; ddIndex<action.menu.length; ddIndex++){
							var menuItemObj = action.menu[ddIndex];
							this._loadActionClass(menuItemObj);
							var menuItemParms = {
								onClick: dojo.hitch(this, "_runAction", menuItemObj, context)
							};
							var props = ['label','iconClass'];
							props.forEach(function(prop){
								if(menuItemObj[prop]){
									menuItemParms[prop] = menuItemObj[prop];
								}
							});
							var menuItem = new MenuItem(menuItemParms);
							menuItem._maqAction = menuItemObj;
							menuItem._maqAction._workbench = workbench;
							menu.addChild(menuItem);
						}
						parms.dropDown = menu;
						if(action.type == 'DropDownButton'){
							dojoAction = new DropDownButton(parms);
						}else{
							dojoAction = new ComboButton(parms);
						}
						dojoAction.onClick = dojo.hitch(this, "_runAction", action, context);
						dojoAction._maqAction = action;
						dojoAction._maqAction._workbench = workbench;
						dojoActionDeferred.resolve();
					}else if (action.toggle || action.radioGroup) {
						dojoAction = new ToggleButton(parms);
						dojoAction.item = action;
						dojoAction.set('checked', action.initialValue);
						if (action.radioGroup) {
							var group = radioGroups[action.radioGroup];
							if (!group) {
								group = radioGroups[action.radioGroup]=[];
							}
							group.push(dojoAction);
							dojoAction.onChange = dojo.hitch(this, "_toggleButton", dojoAction, context, group);
						} else {
							dojoAction.onChange = dojo.hitch(this,"_runAction", action, context);
						}
						dojoAction._maqAction = action;
						dojoAction._maqAction._workbench = workbench;
						dojoActionDeferred.resolve();
					}else if(action.type){
						require([action.type], function(ReviewToolBarText) {
							dojoAction = new ReviewToolBarText();
							dojoAction._maqActiond = action;
							dojoAction._maqAction._workbench = workbench;
							dojoActionDeferred.resolve();
						});
					}else{
						dojoAction = new Button(parms);
						dojoAction.onClick = dojo.hitch(this, "_runAction", action, context);
						dojoAction._maqAction = action;
						dojoAction._maqAction._workbench = workbench;
						dojoActionDeferred.resolve();
					}
					if (action.icon) {
						var imageNode = document.createElement('img');
						imageNode.src = action.icon;
						imageNode.height = imageNode.width = 18;
						dojoAction.domNode.appendChild(imageNode);
					}
					dojoActionDeferred.then(function(){
						toolbar1.addChild(dojoAction);
						//FIXME: looks like the parameter to isEnabled is "context",
						//but maybe that should be the current editor instead. Whatever, 
						//targetObjectId just has to be wrong.
						if (action.isEnabled && !action.isEnabled(/*FIXME: targetObjectId*/)) { 
							dojoAction.isEnabled = action.isEnabled;
							dojoAction.set('disabled', true);
						} else {
							dojoAction.set('disabled', false);
						}
					});
				}
			}
			return toolbar1;
		},

		showPerspective: function(perspectiveID) {
			this.activePerspective = perspectiveID;
			var menuTree = this._createMenuTree();	// no params means include "everything else"
			this._updateMainMenubar(this.davinci_main_menu, menuTree);

			var o = this.getActionSets('davinci.ui.editorMenuBar');
			var clonedActionSets = o.clonedActionSets;
			if(clonedActionSets.length){
				menuTree = this._createMenuTree(clonedActionSets);
				this._updateMainMenubar(this.maq_banner_editor_commands, menuTree);
			}

			var mainBody = this.mainBody;
			if (!mainBody.tabs) {
				mainBody.tabs = [];
			}
			
			/* Large border container for the entire page */
			var mainBodyContainer = this.mainBody; // dijit.byId('mainBody');

			var perspective = this.registry.getExtension("davinci.perspective",perspectiveID);

			if (!perspective) {
				this.handleError(dojo.string.substitute(webContent.perspectiveNotFound,[perspectiveID])); //modified by LWF TODO
			}

			perspective = dojo.clone(perspective);	// clone so views aren't added to original definition

			var extensions = this.registry.getExtensions("davinci.perspectiveExtension",
					function (extension) {
						return extension.targetID === perspectiveID;
					});
			dojo.forEach(extensions, function (extension) {
				// TODO: should check if view is already in perspective. filter + concat instead of foreach + push?
				dojo.forEach(extension.views, function (view){ perspective.views.push(view); });
			});

			if (!mainBody.editorsStackContainer) {
				this.editorsStackContainer = mainBody.editorsStackContainer =
					new StackContainer({
						region:'center',
						class: "editorsStackContainer",
						controllerWidget: "dijit.layout.StackController"
					});
			}
			// FIXME: THIS BYPASSES THE PLUGIN SYSTEM.
			// Hardcoding this for now. Need to figure out how to turn change
			// welcome page logic into something that is defined by ve_plugin.js.
			mainBodyContainer.addChild(mainBody.editorsStackContainer);
			if (!mainBody.editorsWelcomePage) {
				this.editorsWelcomePage = mainBody.editorsWelcomePage =
					new ContentPane({
						class: "editorsWelcomePage",
						href: require.toUrl("qfacex/ui/ide/ve/resources/welcome_to_maqetta.html")
					});
			}
			mainBody.editorsStackContainer.addChild(mainBody.editorsWelcomePage);
			if (!mainBody.tabs.editors) {
				this.editorTabs = this.editors_container = mainBody.tabs.editors =
					new (this.hideEditorTabs ? StackContainer : TabContainer)({
						class: "editors_container",
						controllerWidget: (this.hideEditorTabs ? "dijit.layout.StackController" : "dijit.layout.TabController")
					});
				this.editorTabs.setTitle = function(editorContainer, title) { 
					editorContainer.attr('title', title);
					// After letting Dijit put the title onto the ContentPane,
					// force title to null string on the domNode so that the
					// browser doesn't show an annoying tooltip while hovering
					// over an editor.
					editorContainer.domNode.title = '';
					if(!this.hideEditorTabs){
						this.tablist.pane2button[editorContainer.id].attr('label', title);
					}else{
						var editorId = editorContainer.id;
						var shadowId = editorIdToShadowId(editorId);
						var shadowTabContainer = this.davinci_file_tabs; //  dijit.byId("davinci_file_tabs");
						shadowTabContainer.tablist.pane2button[shadowId].attr('label', title);
					}
				};
				
				dojo.connect(mainBody.tabs.editors, "removeChild", this, this._editorTabClosed);
			}
			mainBody.editorsStackContainer.addChild(mainBody.tabs.editors);
			mainBody.editorsStackContainer.selectChild(mainBody.editorsWelcomePage);
			dojo.connect(this.editors_container, "selectChild", lang.hitch(this,function(child) {
				if(!this._processingSelectChild){
					this._processingSelectChild = true;
					var editorId = child.id;
					var shadowId = editorIdToShadowId(editorId);
					var shadowTab = this._shadows[shadowId];//dijit.byId(shadowId);
					var shadowTabContainer = this.davinci_file_tabs ;//  dijit.byId("davinci_file_tabs");
					if(shadowTab && shadowTabContainer){
						shadowTabContainer.selectChild(shadowTab);
					}
					if (child.editor) {
						this._switchEditor(child.editor);
					}
					this._processingSelectChild = false;
				}
			}));
			mainBodyContainer.startup();

			// Put the toolbar and the main window in a border container
			var appBorderContainer = this.davinci_app;

			var topBarPane = this.davinci_top_bar;
				
				var mainStackContainer = this.mainStackContainer = mainBody.editorsStackContainer =
					new StackContainer({
						region:'center',
						class: "mainStackContainer",
						controllerWidget: "dijit.layout.StackController"
					});
				var welcomePage = this.welcomePage = 
					new ContentPane({
						class: "welcomePage",
						href: require.toUrl("davinci/ve/resources/welcome_to_maqetta.html")
					});

				var mainBorderContainer = this.mainBorderContainer = new BorderContainer({
					design: "headline",
					gutters: false,
					class:'mainBorderContainer',
					liveSplitters: false
				});
				
				var shadowTabContainer = this.shadowTabs = this.davinci_file_tabs = new TabContainer({
					class:'davinci_file_tabs',
					closable: true,
					region: "top",
					layoutPriority:1,
					style:'display:none'
				});
				
				this.shadowTabs.setTitle = function(tab, title) { 
					tab.attr('title', title);
					this.tablist.pane2button[tab.id].attr('label', title);
				};
				dojo.connect(shadowTabContainer, "selectChild", this,function(child) {
					var shadowId = child.shadowId;
					var editorId = shadowIdToEditorId(shadowId);
					var editorContainer = this._editors[editorId]; //dijit.byId(editorId);
					var editorsContainer = this.editors_container;
					if (editorsContainer && editorContainer && editorContainer.editor) {
						// This is trigger (indirectly) the selectChild callback function on 
						// the editors_container widget, which will trigger Workbench._switchEditor
						editorsContainer.selectChild(editorContainer);
					}
				});
				dojo.connect(shadowTabContainer, "removeChild", this, this._shadowTabClosed);
				var toolbarPane = this.davinci_toolbar_pane = this.davinci_toolbar_container = new ContentPane({
					class:'davinci_toolbar_pane',
					region: "top",
					layoutPriority:1,
					content:'<div class="davinci_toolbar_container"></div>',
					style:'display:none'
				});
			
				appBorderContainer.addChild(mainStackContainer);
				mainStackContainer.addChild(mainBorderContainer);
				mainStackContainer.selectChild(mainBorderContainer);

				mainBorderContainer.addChild(shadowTabContainer);
				mainBorderContainer.addChild(toolbarPane);
				mainBorderContainer.addChild(mainBodyContainer);
				appBorderContainer.layout();	
				appBorderContainer.startup();
	//			Workbench._originalOnResize = window.onresize; //modified by LWF
	//			window.onresize = Workbench.onResize; //alert("All done");}
				dojo.connect(mainBodyContainer, 'onMouseUp', this, 'onResize');
				
				var shadowTabMenu = this.davinci_file_tabs_tablist_Menu ;//  dijit.byId('davinci_file_tabs_tablist_Menu');
				if(shadowTabMenu){
					shadowTabMenu.addChild(new dijit.MenuItem({
						label:workbenchStrings.closeAllEditors,
						onClick:function(a, b, c){
							this.closeAllEditors();
						}.bind(this)
					}));
				}
			//} modified by LWF
			/* close all of the old views */
			for (var position in mainBody.tabs.perspective) {
				var view = mainBody.tabs.perspective[position];
				if(!view) {
					continue;
				}
				dojo.forEach(view.getChildren(), function(child) {
					view.removeChild(child);
					if (position != 'left' && position != 'right') {
						child.destroyRecursive(false);
					}
				});
				view.destroyRecursive(false);
				delete mainBody.tabs.perspective[position];
			}

			this._showViewPromises = dojo.map(perspective.views, function(view) {
				return this.showView(view.viewID, view.selected, view.hidden);
			}, this);

			//FIXME: This is also ugly - creating a special DIV for visual editor's selection chrome
			//Note sure how best to factor this out, though.
			this.focusContainer = dojo.create('div', {'className':'focusContainer'}, this.domNode);

			// kludge to workaround problem where tabs are sometimes cutoff/shifted to the left in Chrome for Mac
			// would be nice if we had a workbench onload event that we could attach this to instead of relying on a timeout
			setTimeout(function() {
				appBorderContainer.resize();
				this.publish("/davinci/workbench/ready");
			}.bind(this), 3000);
		},

		onResize: function(e){
			var target =e ?( e.explicitOriginalTarget ? e.explicitOriginalTarget : e.srcElement) : null;//modified by LWF
			if (!e || e.type == 'resize' || ((target.id && (target.id.indexOf('dijit_layout__Splitter_')>-1) ||  //modified by LWF
				(target.nextSibling && target.nextSibling.id && target.nextSibling.id.indexOf('dijit_layout__Splitter_')>-1)))) {
				var ed = davinci && this.currentEditor;  //modified by LWF 
				if (davinci && this.currentEditor && this.currentEditor.onResize) {
					this.currentEditor.onResize();
				}
			}
			if (this._originalOnResize) {
				this._originalOnResize();
			}
			this._repositionFocusContainer();
		},

		updateMenubar: function(node, actionSets) {
			var menuTree = this._createMenuTree(actionSets);

			var menuTop = dijit.byId(node.id);
			if (!menuTop) {
				menuTop = new MenuBar({'class': 'dijitInline'}, node);
			}
			this._addItemsToMenubar(menuTree, menuTop);
		},
		
		_updateMainMenubar: function(menuDiv, menuTree) {
			for (var i=0; i<menuTree.length; i++) {
				var menuTreeItem = menuTree[i];
				for (var j=0;j<menuTreeItem.menus.length;j++) {
					var menu = menuTreeItem.menus[j];
					var menuWidget = this._createMenu(menu);
					//menu.id = menu.id.replace(".", "-"); // kludge to work around the fact that '.' is being used for ids, and that's not compatible with CSS
					//var widget = dijit.byId(menu.id + "-dropdown");
					//if(!widget) {
						var params = { label: menu.label, dropDown: menuWidget}; //, id: menu.id + "-dropdown" };
						if(menu.hasOwnProperty('showLabel')){
							params.showLabel = menu.showLabel;
						}
						if(menu.hasOwnProperty('iconClass')){
							params.iconClass = menu.iconClass;
						}
						if(menu.hasOwnProperty('className')){
							params['class'] = menu.className;
						}
						widget = new DropDownButton(params);
						menuDiv.appendChild(widget.domNode);
					//}
				}
			}
		},

		_addItemsToMenubar: function(menuTree, menuTop) {
			dojo.forEach(menuTree, function(m) {
				var menus = m.menus,
					menuLen = menus.length;
				if (menuLen) {
					dojo.forEach (menus, function(menu) {
						//menu.id = menu.id.replace(/\./g, "-"); // kludge to work around the fact that '.' is being used for ids, and that's not compatible with CSS
						var menuWidget = this._createMenu(menu);
						//	widget =  dijit.byId(menu.id + "-dropdown");
						//if (!widget) {
							widget = new PopupMenuBarItem({
								label: menu.label,
								popup: menuWidget
								//id: menu.id + "-dropdown"
							});
						//}
						menuTop.addChild(widget);
					}, this);
				}
			}, this);
		},
		/* returns either the active editor, or the editor with given resource open */
		getOpenEditor: function(resource) {
			
			if(resource!=null){
				var tab = this._editors[filename2id(resource.getPath())]; // dijit.byId(filename2id(resource.getPath()));
				if (tab) {
					return tab.editor;
				}
				return null; // no editor found for given resource
			}
			
			
			var editorsContainer = this.editors_container;// dijit.byId("editors_container"); modified by lwf
			if (editorsContainer && editorsContainer.selectedChildWidget && editorsContainer.selectedChildWidget.editor) {
				return editorsContainer.selectedChildWidget.editor;
			}
			return null;
		},

		closeActiveEditor: function() {
			var editorsContainer = this.editors_container; //dijit.byId("editors_container");
			var shadowTabContainer = this.davinci_file_tabs;// dijit.byId("davinci_file_tabs");

			if (editorsContainer && editorsContainer.selectedChildWidget && editorsContainer.selectedChildWidget.editor) {
				var editorId = selectedChildWidget.id;
				var shadowId = editorIdToShadowId(editorId);
				editorsContainer.closeChild(editorsContainer.selectedChildWidget);
				var shadowTab = this._shadows[shadowId];//dijit.byId(shadowId);
				if(shadowTab){
					shadowTabContainer.closeChild(shadowTab);
				}
			}
		},

		closeAllEditors: function() {
			var editorsContainer = this.editors_container;//dijit.byId("editors_container");

			if (editorsContainer) {
				editorsContainer.getChildren().forEach(function(child){
					editorsContainer.closeChild(child);
				});
			}
		},

		getAllOpenEditorIds: function() {
		},

		showModal: function(content, title, style, callback, submitOnEnter) {
			return Dialog.showModal(content, title, style, callback, submitOnEnter);
		},

		// simple dialog with an automatic OK button that closes it.
		showMessage: function(title, message, style, callback, submitOnEnter) {
			return Dialog.showMessage(title, message, style, callback, submitOnEnter);
		},

		// OK/Cancel dialog with a settable okLabel
		showDialog: function(title, content, style, callback, okLabel, hideCancel, submitOnEnter, focusSubmit) {
			return Dialog.showDialog(title, content, style, callback, okLabel, hideCancel, submitOnEnter);
		},

		_createMenuTree: function(actionSets, pathsOptional) {
			if (!actionSets) {  // only get action sets not associated with part
				actionSets =  this.registry.getExtensions("davinci.actionSets", lang.hitch(this,function (actionSet) {
					var associations = this.registry.getExtensions("davinci.actionSetPartAssociations", function(actionSetPartAssociation) {
						return actionSetPartAssociation.targetID == actionSet.id;
					});	
					return associations.length == 0;
				}));
			}
			var menuTree = [];
			var self = this;
			function findID(m, id) { //ALP: dijit.byId?
				for ( var j = 0, jLen = m.length; j < jLen; j++) {
					for ( var k = 0, kLen = m[j].menus.length; k < kLen; k++) {
						if (id == m[j].menus[k].id) {
							return m[j].menus[k].menus;
						}
					}
				}
			}

			function addItem(item, path,pathsOptional) {
				path = path || "additions";
				path = path.split('/');
				var m = menuTree;

				self._loadActionClass(item);
				
				var sep = path[path.length - 1];
				if (path.length > 1) {
					for ( var i = 0, len = path.length - 1; i < len; i++) {
						var k = findID(m, path[i]);
						if (k) {
							m = k;
						}
					}
				}
				for ( var i = 0, len = m.length; i < len; i++) {
					if (m[i].id == sep) {
						var menus = m[i].menus;
						menus.push(item);
						if (item.separator) { // if menu
							var wasAdditions = false;
							menus = item.menus = [];
							for ( var j = 0; j < item.separator.length; j += 2) {
								var id = item.separator[j];
		
								wasAdditions = id == "additions";
								menus.push( {
									id: id,
									isSeparator: item.separator[j + 1],
									menus: []
								});
							}
							if (!wasAdditions) {
								menus.push({
									id: "additions",
									isSeparator: false,
									menus: []
								});
							}
						}
						return;
					}
				}
				if (pathsOptional) {
					menuTree.push( {
						id: sep,
						isSeparator: false,
						menus: [item]
					});
				}
			}
		
			for ( var actionSetN = 0, len = actionSets.length; actionSetN < len; actionSetN++) {
				var actionSet = actionSets[actionSetN];
				if (actionSet.visible) {
					if (actionSet.menu) {
						for ( var menuN = 0, menuLen = actionSet.menu.length; menuN < menuLen; menuN++) {
							var menu = actionSet.menu[menuN];
							if (menu.__mainMenu) {
								for ( var j = 0; j < menu.separator.length; j += 2) {
									menuTree.push({
										id: menu.separator[j],
										isSeparator: menu.separator[j + 1],
										menus: []
									});
								}
							} else {
								addItem(menu, menu.path,pathsOptional);
								if (menu.populate instanceof Function) {
									var menuItems = menu.populate();
									for (var item in menuItems) {
										addItem(menuItems[item], menuItems[item].menubarPath);
									}
								}
									
							}
						}
					}
				}
			}
			
			for ( var actionSetN = 0, len = actionSets.length; actionSetN < len; actionSetN++) {
				var actionSet = actionSets[actionSetN];
				if (actionSet.visible) {
					for ( var actionN = 0, actionLen = actionSet.actions.length; actionN < actionLen; actionN++) {
						var action = actionSet.actions[actionN];
						if (action.menubarPath) {
							addItem(action, action.menubarPath,pathsOptional);
						}
					}
				}
			}
			return menuTree;
		},

		_loadActionClass: function(item) {
			if (typeof item.action == "string") {
				require([item.action], lang.hitch(this,function(ActionClass){
					item.action = new ActionClass();
					item.action._workbench = this;
					item.action.item = item;
				}));
			}
		},

		_createMenu: function(menu, context) {
			var menuWidget,menus,connectFunction;
			if (menu.menus) {  // creating dropdown
			  menuWidget = new Menu({parentMenu: menu });
			  menus = menu.menus;
			  connectFunction = "onOpen";
			} else {	// creating popup
				menuWidget = new PopupMenu({});
				menus = menu;
				connectFunction="menuOpened";
			}

			menuWidget.domNode.style.display = "none";
			menuWidget.actionContext = context;
			this._rebuildMenu(menuWidget, menus);
			dojo.connect(menuWidget, connectFunction, this, function(evt) {
				if (menuWidget._widgetCallback) { // create popup
					  menuWidget._widgetCallback(evt);
				}
				this._rebuildMenu(menuWidget, menus).focus(); // call focus again, now that we messed with the widget contents
			});
			return menuWidget;
		},
		/*
		 * running in single project mode or multi project mode
		 */
		singleProjectMode: function() {
			return true;
		},
		
		getProject: function() {
			return this.getActiveProject() || this._DEFAULT_PROJECT;
		},
		
		
		loadProject: function(projectName) {
			
			return this.setActiveProject(projectName).then(function(){
				//location.href=".";
				/* make sure the server has maqetta setup for the project */
				//modified by LWF 20130315
				//location.href="/backend/cmd/configProject?configOnly=true&project=" + projectName;   //modified by LWF DEL
			});
			
			// if the project was set via URL parameter, clear it off.  
			
		
		},
		
		location: function() {
			return  document.location.href.split("?")[0];//Runtime.location();
		},
		
		queryParams: function() {
			// reloads the browser with the current project.
			var fullPath = document.location.href;
			var split = fullPath.split("?");
			var searchString = split.length>1? split[1] : "";
			// remove the ? from the front of the query string 
			return dojo.queryToObject(searchString);
		},
		
		getSelectedResource : function() {
			var selection=this.getSelection();
			if (selection[0]&&selection[0].resource) {
				return selection[0].resource;
			}
		},
		
		_rebuildMenu: function (menuWidget, menus) {
			dojo.forEach(menuWidget.getChildren(), function(child){
				menuWidget.removeChild(child);
				child.destroy();
			});
			menuWidget.focusedChild = null; // TODO: dijit.Menu bug?  Removing a focused child should probably reset focusedChild for us

			var addSeparator, menuAdded;
			menus.forEach(function(menu, i){
				if (menu.menus.length) {
					if (menu.isSeparator && i>0) {
						addSeparator=true;
					}
					menu.menus.forEach(function(item){
						if (addSeparator && menuAdded) {
							menuWidget.addChild(new MenuSeparator({}));
							addSeparator=false;
						}
						menuAdded = true;
						var label = item.label;
						if (item.action && item.action.getName) {
							label = item.action.getName();
						}
						if (item.separator) {
							var subMenu = this._createMenu(item);
							var popupParent = new MenuItem({
								label: label,
								popup: subMenu
								//id: subMenu.id + "item"
							});
							popupParent.actionContext = menuWidget.actionContext;
							menuWidget.addChild(popupParent);
						} else {
							var enabled = true;
							if (item.isEnabled) {
								var resource = this.getSelectedResource();
								enabled = resource ? item.isEnabled(resource) : false;
							}

							if (item.action) {
								if (item.action.shouldShow && !item.action.shouldShow(menuWidget.actionContext, {menu: menuWidget})) {
									return;
								}
								//FIXME: study this code for bugs.
								//menuWidget.actionContext: is that always the current context?
								//There were other bugs where framework objects pointed to wrong context/doc
								enabled = item.action.isEnabled && item.action.isEnabled(menuWidget.actionContext);
							}

							var menuArgs = {
									label: label,
									//id: item.id,
									disabled: !enabled,
									onClick: dojo.hitch(this, "_runAction", item, menuWidget.actionContext)
							};
							if (item.iconClass) {
								menuArgs.iconClass = item.iconClass;
							}

							menuWidget.addChild(new MenuItem(menuArgs));
						}
					}, this);
				}
			}, this);

			return menuWidget;
		},
		
		_toggleButton: function(button, context, group, arg) {
			if (!button.checked) {
				return;
			}
			group.forEach(function(item) {
				if (item != button) {
					item.set('checked', false);
				}
			});
			this._runAction(button.item,context,button.item.id);
		},

		//FIXME: "context" is really an editor, isn't it? Like davinci.ve.PageEditor?
		_runAction: function(item, context, arg) {
			//FIXME: Not sure this code is correct, but sometimes this routine is passed
			//a context object that is not associated with the current document
			if(context && this.currentEditor){
				context = this.currentEditor;
			}
			if (item.run) {
				item._workbench = this; // add by LWF
				item.run();
			} else if (item.action) {
				if (dojo.isString(item.action)) {
					this._loadActionClass(item);
				}
				item.action.run(context);
			} else if (item.method && context && context[item.method] instanceof Function) {
				context[item.method](arg);
			} else if (item.commandID) {
				this.executeCommand(item.commandID);
			}
		},

		showView: function(viewId, shouldFocus, hidden){
			var d = new Deferred();
			
			try {
				var mainBodyContainer = this.mainBody,//dijit.byId('mainBody'),
					view = this.registry.getExtension("davinci.view", viewId),
					mainBody = mainBodyContainer.domNode,//dojo.byId('mainBody'),
					perspectiveId = this.activePerspective,
					perspective = this.registry.getExtension("davinci.perspective", perspectiveId),
					position = 'left',
					cp1 = null,
					created = false,
					pxHeight = mainBodyContainer._borderBox.h -5; //dijit.byId('mainBody')._borderBox.h - 5;
				
				dojo.some(perspective.views, function(view){
					if(view.viewID ==  viewId){
						position = view.position;
						return true;
					}	
				});
				
				mainBody.tabs = mainBody.tabs || {};				
				mainBody.tabs.perspective = mainBody.tabs.perspective || {};
		
				// NOTE: Left-side and right-side palettes start up with 71px width
				// which happens to be the exact pixel size of the palette tabs.
				// This 71px setting prevents the user from seeing an initial flash
				// of temporarily opened left-side and right-side palettes.
				if (position == 'right' && !mainBody.tabs.perspective.right) {
					mainBodyContainer.addChild(mainBody.tabs.perspective.right = 
						new BorderContainer({'class':'davinciPaletteContainer right_mainBody', 
							style: 'width: '+paletteTabWidth+'px;',// id:"right_mainBody", 
							minSize:paletteTabWidth,	// prevent user from dragging splitter too far towards edge
							region:'right', gutters: false, splitter:true}));
					mainBody.tabs.perspective.right.startup();
					// expandToSize is what expandPaletteContainer() uses as the
					// width of the palette when it is in expanded state.
					paletteCache["right_mainBody"] = {
						expandToSize:340,
						initialExpandToSize:340
					};
				}
		
				if (position == 'left' && !mainBody.tabs.perspective.left) {
					mainBodyContainer.addChild(mainBody.tabs.perspective.left = 
						new BorderContainer({'class':'davinciPaletteContainer left_mainBody', 
							style: 'width: '+paletteTabWidth+'px;', //id:"left_mainBody", 
							minSize:paletteTabWidth,	// prevent user from dragging splitter too far towards edge
							region:'left', gutters: false, splitter:true}));
					mainBody.tabs.perspective.left.startup();
					// expandToSize is what expandPaletteContainer() uses as the
					// width of the palette when it is in expanded state.
					paletteCache["left_mainBody"] = {
						expandToSize:300,
						initialExpandToSize:300
					};
				}
		
				if (position === 'left' || position === 'right') {
					position += "-top";
				}
				var positionSplit = position;
		
				if (!mainBody.tabs.perspective[position]) {
					positionSplit = position.split('-');
		
					var region = positionSplit[0],
						parent = mainBodyContainer,
						clazz = 'davinciPalette ',
						style = '';
					if (positionSplit[1] && (region == 'left' || region == 'right')) {
						parent = mainBody.tabs.perspective[region];
						region = positionSplit[1];
						if (positionSplit[1] == "top") {
							region = "center";
							clazz += "davinciTopPalette";
						} else {
							style = 'height:30%;';
							clazz += "davinciBottomPalette";
						}
					} else if(region == 'bottom') {
						style = 'height:80px;';
						clazz += "davinciBottomPalette";
					}
					cp1 = mainBody.tabs.perspective[position] = new TabContainer({
						region: region,
						//id:'palette-tabcontainer-'+position,
						tabPosition:positionSplit[0]+'-h',
						tabStrip:false,
						'class': clazz,
						style: style,
						splitter: region != "center",
						controllerWidget: "dijit.layout.TabController"
					});
					parent.addChild(cp1);
					dojo.connect(cp1, 'selectChild', this, function(tab){
						if(tab && tab.domNode){
							var tc = tab.getParent();
							// Don't mess with which tab is selected or do any collapse/expand
							// if selectChild is called in response to adding the first child
							// of a TabContainer, which causes an implicit selectFirst(),
							// or other programmatic selectChild() event (in particular, 
							// SwitchingStyleView.js puts _maqDontExpandCollapse on tabcontainer)
							if(!this._showViewAddChildInProcess && !tc._maqDontExpandCollapse){
								if(tc._maqLastSelectedChild == tab){
									this._expandCollapsePaletteContainer(tab);						
								}else{
									this.expandPaletteContainer(tab.domNode);						
								}
							}
							tc._maqLastSelectedChild = tab;
						}
					}.bind(this));
				} else {
					cp1 = mainBody.tabs.perspective[position];
				}
		
				if (dojo.some(cp1.getChildren(), function(child){ return child.id == view.id; })) {
					return;
				}
				

				this.instantiateView(view).then(function(tab) {
					this._showViewAddChildInProcess = true;
					if (!hidden) {
						cp1.addChild(tab);
					}
					this._showViewAddChildInProcess = false;
					// Put a tooltip on the tab button. Note that native TabContainer
					// doesn't offer a tooltip capability for its tabs
					var controlButton = tab.controlButton;
					if(controlButton && controlButton.domNode){
						controlButton.domNode.title = view.title + ' ' +  workbenchStrings.palette;
					}
					if(shouldFocus) {
						cp1.selectChild(tab);
					}
					
					d.resolve(tab);
				}.bind(this));
			  } catch (ex) {
				  console.error("Error loading view: "+view.id);
				  console.error(ex.stack || ex);
			  }
			  
			  return d;
		},

		instantiateView: function(view) {
			var d = new Deferred(),
				tab = this._views[view.id]; //dijit.byId(view.id);
			
			if (tab) {
				d.resolve(tab);
			} else {
				require([view.viewClass], lang.hitch(this,function(viewCtor){
					var params = { title: view.title,
							closable: false, view: view,workbench:this };
					if(view.iconClass){
						params.iconClass = view.iconClass;
					}
					tab = this._views[view.id] = new (viewCtor || ViewPart)(params) ;
					d.resolve(tab);
				}));
			}
			return d;
		},

		hideView: function(viewId){
			for (var position in mainBody.tabs.perspective) {
				if(position=='left' || position == 'right'){
					position+='-top';
				}
				if(!mainBody.tabs.perspective[position]){
					continue;
				}
				var children = mainBody.tabs.perspective[position].getChildren();
				var found = false;
				for (var i = 0; i < children.length && !found; i++) {
					if (children[i].id == viewId) {
						mainBody.tabs.perspective[position].removeChild(children[i]);
						children[i].destroyRecursive(false);
					}
				}									
			}
		},

		toggleView: function(viewId) {
			var found = this._views[viewId]; //dojo.byId(viewId);
			if(found) {
				this.hideView(viewId);
			} else{
				this.showView(viewId, true);
			}
		},

		openEditor: function (keywordArgs, newHtmlParams) {
			try{
				var fileName=keywordArgs.fileName,
					content=keywordArgs.content,
					fileExtension,
					file;
				if (typeof fileName=='string') {
					 fileExtension=fileName.substr(fileName.lastIndexOf('.')+1);
				} else {
					file=fileName;
					fileExtension=fileName.getExtension();
					fileName=fileName.getPath();
				}
		
				var editorContainer = this._editors[filename2id(fileName)]; // dijit.byId(filename2id(fileName)),
					editorsContainer = this.editors_container;// dijit.byId("editors_container");
		
				if (editorContainer) {
					// already open
					editorsContainer.selectChild(editorContainer);
					var editor=editorContainer.editor;
					if (keywordArgs.startOffset) {
						editor.select(keywordArgs);
					}
					return;
				}
				var editorCreateCallback=keywordArgs.editorCreateCallback;
				
				var editorExtensions=this.registry.getExtensions("davinci.editor", function (extension){
					 if (typeof extension.extensions =="string") {
						 extension.extensions=extension.extensions.split(',');
					 }
					 return dojo.some(extension.extensions, function(e){
						 return e.toLowerCase() == fileExtension.toLowerCase();
					 });
				});
		
				var editorExtension = editorExtensions[0];
				if (editorExtensions.length>1){
					dojo.some(editorExtensions, function(extension){
						editorExtension = extension;
						return extension.isDefault;
					});
				}
		
				this._createEditor(editorExtension, fileName, keywordArgs, newHtmlParams).then(function(editor) {
					if(editorCreateCallback){
						editorCreateCallback.call(window, editor);
					}
		
					if(!keywordArgs.noSelect) {
						 this.currentEditor = editor;  // modified by LWF
					}			
				}, function(error) {
					console.error("Error opening editor for filename: " + fileName, error);
					console.error(error.stack || error);
				});
			} catch (ex) {
				console.error("Exception opening editor for filename: "+ keywordArgs && keywordArgs.fileName);
				console.error(ex.stack || ex);
			}

		},
		
		_createEditor: function(editorExtension, fileName, keywordArgs, newHtmlParams) {
			
			var d = new Deferred();
			var nodeName = fileName.split('/').pop();
			var extension = keywordArgs && keywordArgs.fileName && keywordArgs.fileName.extension ? 
					"." + keywordArgs.fileName.extension : "";
			nodeName = nodeName + (extension == ".rev" ? extension : "");

			var loading = dojo.query('.loading');
			if (loading[0]) {
				loading[0].parentNode.removeChild(loading[0]);
			}

			var editorsStackContainer = this.editorsStackContainer;// dijit.byId('editorsStackContainer'),
				editors_container = this.editors_container;// dijit.byId('editors_container');
			if (editorsStackContainer && editors_container) {
				editorsStackContainer.selectChild(editors_container);
				this.mainStackContainer.selectChild(this.mainBorderContainer);
			}
			var workbench = this;
			var content = keywordArgs.content,
				editorContainer = this._editors[filename2id(fileName)]; //dijit.byId(filename2id(fileName)),
				editorsContainer = this.editors_container; // dijit.byId("editors_container"),
				shadowTabContainer = this.davinci_file_tabs; // dijit.byId("davinci_file_tabs"),
				editorCreated = false,
				shadowTab = null;
			if (!editorContainer) {
				editorCreated = true;
				var editorId = filename2id(fileName);
				var shadowId = editorIdToShadowId(editorId);
				editorContainer = this._editors[editorId] = new EditorContainer({
					title: nodeName,
   					closable: true,
    				editorId: editorId, 
					'class': "EditorContainer",
					isDirty: keywordArgs.isDirty,
					workbench : this
				});
				shadowTab = this._shadows[shadowId]=new ContentPane({
					title:nodeName,
					closable: true,
					shadowId:shadowId
				});
				shadowTab.onClose = function(tc, tab){
					
					var shadowId = tab.shadowId;
					var editorId = shadowIdToEditorId(shadowId);
					var editorContainer = workbench._editors[editorId]; //dijit.byId(editorId);
					var editorsContainer = workbench.editors_container;// dijit.byId("editors_container");
					function okToClose(){
						editorContainer._skipDirtyCheck = true;
						//editorContainer.onClose.apply(editorContainer, [editorsContainer, editorContainer]);
						tc.removeChild(tab);
						tab.destroyRecursive();
					}
					if(editorsContainer && editorContainer){
						if (editorContainer.editor.isDirty){
							//Give editor a chance to give us a more specific message
							var message = editorContainer.editor.getOnUnloadWarningMessage();
							if (!message) {
								//No editor-specific message, so use our canned one
								message = dojo.string.substitute(workbenchStrings.fileHasUnsavedChanges, [editorContainer._getTitle()]);
							}
							workbench.showDialog(editorContainer._getTitle(), message, {width: 300}, dojo.hitch(this,okToClose), null, null, true);
						} else {
							okToClose();
						}
					}
				};
				
				editorContainer.onClose = function(tc, tab){
					
					var editorId = tab.editorId;
					//var shadowId = editorIdToShadowId(shadowId);
					var editorContainer = workbench._editors[editorId]; //dijit.byId(editorId);
					//var shadowTabContainer = workbench.davinci_file_tabs;
					function okToClose(){
						editorContainer._skipDirtyCheck = true;
						//editorContainer.onClose.apply(editorContainer, [editorsContainer, editorContainer]);
						tc.removeChild(tab);
						tab.destroyRecursive();
					}
					if(editorsContainer && editorContainer){
						if (editorContainer.editor.isDirty){
							//Give editor a chance to give us a more specific message
							var message = editorContainer.editor.getOnUnloadWarningMessage();
							if (!message) {
								//No editor-specific message, so use our canned one
								message = dojo.string.substitute(workbenchStrings.fileHasUnsavedChanges, [editorContainer._getTitle()]);
							}
							workbench.showDialog(editorContainer._getTitle(), message, {width: 300}, dojo.hitch(this,okToClose), null, null, true);
						} else {
							okToClose();
						}
					}
				}
			}
			
			if (!editorExtension) {
				editorExtension = {
					editorClass: 'davinci/ui/TextEditor',
					id: 'davinci.ui.TextEditor'
				};
			}

			if (editorCreated) {
				editorsContainer.addChild(editorContainer);
				shadowTabContainer.addChild(shadowTab);
			}

			// add loading spinner
			//---if(!this.hideEditorTabs){
			//---	var loadIcon = dojo.query('.dijitTabButtonIcon',editorContainer.controlButton.domNode);
			//---	dojo.addClass(loadIcon[0],'tabButtonLoadingIcon');
			//---	dojo.removeClass(loadIcon[0],'dijitNoIcon');
			//---}
			
			if (!keywordArgs.noSelect) {
				editorsContainer.selectChild(editorContainer);
			}
			
			var workbench = this;
			editorContainer.setEditor(editorExtension, fileName, content, keywordArgs.fileName, editorContainer.domNode, newHtmlParams).then(function(editor) {
				if (keywordArgs.startLine) {
					editorContainer.editor.select(keywordArgs);
				}
				
				if (!keywordArgs.noSelect) {
		            if (workbench._state.editors.indexOf(fileName) === -1) {
		            	workbench._state.editors.push(fileName);
		            }
					workbench._switchEditor(editorContainer.editor, keywordArgs.startup);
				}

				//----if(!workbench.hideEditorTabs){
				//----	dojo.removeClass(loadIcon[0],'tabButtonLoadingIcon');
				//----	dojo.addClass(loadIcon[0],'dijitNoIcon');
				//----}

				setTimeout(function() {
					editorContainer.resize(); //kludge, forces editor to correct size, delayed to force contents to redraw
				}, 100);
				d.resolve(editorContainer.editor);
			}, function(error) {
				//if(!this.hideEditorTabs){
				//	dojo.removeClass(loadIcon[0],'tabButtonLoadingIcon');
				//	dojo.addClass(loadIcon[0],'tabButtonErrorIcon');
				//}

				d.reject(error);
			});
			return d;
		},

		createPopup: function(args) {
			var partID = args.partID, domNode=args.domNode, 
				context=args.context,
				widgetCallback=args.openCallback;
			
			var o = this.getActionSets(partID);
			var clonedActionSets = o.clonedActionSets;
			var actionSets = o.actionSets;
			if(clonedActionSets.length > 0){
				var menuTree=this._createMenuTree(clonedActionSets,true);
				this._initActionsKeys(actionSets, args);
				var popup=this._createMenu(menuTree,context);
				if (popup && domNode) {
					popup.bindDomNode(domNode);
				}
				popup._widgetCallback=widgetCallback;
				popup._partID = partID;
				return popup;
			}
		},

		getActionSets: function(partID){
			var actionSetIDs = [];
			var editorExtensions=this.registry.getExtension("davinci.actionSetPartAssociations",
				function (extension) {
					return extension.parts.some(function(part) {
						if (part == partID) {
							actionSetIDs.push(extension.targetID);
							return true;
						}
					});
				});
			
			var actionSets;
			var clonedActionSets = [];
			if (actionSetIDs.length) {
			   actionSets = this.registry.getExtensions("davinci.actionSets", function (extension) {
					return actionSetIDs.some(function(setID) { return setID == extension.id; });
				});
			   if (actionSets.length) {
				   // Determine if any widget libraries have indicated they want to augment the actions in
				   // the action set
				   actionSets.forEach(lang.hitch(this,function(actionSet) {
					   var libraryActions = this.registry.metadata.getLibraryActions(actionSet.id);
					   if (libraryActions.length) {
						   // We want to augment the action list, so let's copy the
						   // action set before pushing new items onto the end of the
						   // array.
						   actionSet = lang.mixin({}, actionSet); // shallow obj copy
						   actionSet.actions = actionSet.actions.concat(libraryActions); // copy array, add libraryActions
					   }
					   clonedActionSets.push(actionSet);
				   }));
				}
			}
			return { actionSets: actionSets, clonedActionSets: clonedActionSets};
		},

		_initActionsKeys: function(actionSets, args) {
			var keysDomNode = args.keysDomNode || args.domNode,
				keys = {},
				wasKey;
			dojo.forEach(actionSets, function(actionSet){
				dojo.forEach(actionSet.actions, function(action){
					if (action.keySequence) {
						keys[action.keySequence]=action;
						wasKey=true;
					}
				});
			});
			if (wasKey) {
				var context=args.context;
	          dojo.connect(keysDomNode, "onkeydown", lang.hitch(this,function (e){
					var seq = this._keySequence(e),
						actionItem = keys[seq];
					if (actionItem) {
						if (actionItem.action.shouldShow && !actionItem.action.shouldShow(context)) {
							return;
						}
						if (actionItem.action.isEnabled(context)) {
							this._runAction(actionItem,context);
						}
	        	  }
	          }));
			}
		},
		
		_initKeys: function () {
			var keys={all: []};
			var keyExtensions=this.registry.getExtensions("davinci.keyBindings");
			dojo.forEach(keyExtensions, function(keyExt){
				var contextID= keyExt.contextID || "all";
				var keyContext=keys[contextID];
				if (!keyContext) {
				  keyContext=keys[contextID]=[];
				}
				
				keyContext[keyExt.sequence]=keyExt.commandID;
			});

			this.keyBindings=keys;
		},

		handleKey: function (e) {
			if (!this.keyBindings) {
				return;
			}
			var seq=this._keySequence(e);
			var cmd;
			if (this.currentContext && this.keyBindings[this.currentContext]) {
				cmd=this.keyBindings[this.currentContext][seq];
			}
			if (!cmd) {
				cmd=this.keyBindings.all[seq];
			}
			if (cmd) {
				this.executeCommand(cmd);
				return true;
			}
		},
		
		_keySequence: function (e) {
			var seq=[];
			if (window.event) 
			{
				if (window.event.ctrlKey) {
					seq.push("M1");
				}
				if (window.event.shiftKey) {
					seq.push("M2");
				}
				if (window.event.altKey) {
					seq.push("M3");
				}
			}
			else 
			{
				if (e.ctrlKey || (e.modifiers==2) || (e.modifiers==3) || (e.modifiers>5)) {
					seq.push("M1");
				}
				if (e.shiftKey || (e.modifiers>3)) {
					seq.push("M2");
				}
				if(e.modifiers) {
					if (e.altKey || (e.modifiers % 2)) {
						seq.push("M3");
					}
				}
				else {
					if (e.altKey) {
						seq.push("M3");
					}
				}
			}
			
			var letter=String.fromCharCode(e.keyCode);
			if (/[A-Z0-9]/.test(letter)) {
				//letter=e.keyChar;
			} else {
				var keyTable = {
					46: "del",
					114: "f3"
				};

				letter = keyTable[e.keyCode] || "xxxxxxxxxx";
			}
			letter=letter.toUpperCase();
			if (letter==' ') {
				letter="' '";
			}
					
			seq.push(letter);
			return seq.join("+");
		},

		setActionScope: function(scopeID,scope) {
			this.actionScope[scopeID]=scope;
		},
		
		findView: function (viewID) {
			var domNode=this._views[viewID]; //dijit.byId(viewID);
			if (domNode) {
				return domNode;
			}
		},

		_switchEditor: function(newEditor, startup) {
			var oldEditor = this.currentEditor;
			this.currentEditor = newEditor;
			this._showEditorTopPanes();
			try {
				this.publish("/davinci/ui/editorSelected", {
					editor: newEditor,
					oldEditor: oldEditor
				});
			} catch (ex) {
				console.error(ex.stack || ex);
			}
			this._updateTitle(newEditor);
		
			this._state.activeEditor=newEditor ? newEditor.fileName : null;
			
			setTimeout(function(){
				// kludge: if there is a visualeditor and it is already populated, resize to make Dijit visualEditor contents resize
				// If editor is still starting up, there is code on completion to do a resize
				// seems necessary due to combination of 100%x100% layouts and extraneous width/height measurements serialized in markup
				if (newEditor && newEditor.visualEditor && newEditor.visualEditor.context && newEditor.visualEditor.context.isActive()) {
					newEditor.visualEditor.context.getTopWidgets().forEach(function (widget) { if (widget.resize) { widget.resize(); } });
				}
				
				this._repositionFocusContainer();
			}.bind(this), 1000);
			
			all(this._showViewPromises).then(function() {
				if(newEditor && newEditor.focus) { 
					newEditor.focus(); 
				}

				//Rearrange palettes based on new editor
				this._rearrangePalettes(newEditor);
				
				//Collapse/expand the left and right-side palettes
				//depending on "expandPalettes" properties
				this._expandCollapsePaletteContainers(newEditor);
			}.bind(this));

			if(!startup) {
				this._updateWorkbenchState();
			}
		},

		_rearrangePalettes: function(newEditor) {
			var palettePerspectiveId,
				newEditorRightPaletteExpanded,
				newEditorLeftPaletteExpanded;
			
			//Determine what perspective to get palette info out of based on whether we have an editor or not
			if (newEditor) {
				// First, we will get the metadata for the extension and get its list of 
				// palettes to bring to the top
				var editorExtensions=this.registry.getExtensions("davinci.editor", function (extension){
					return (newEditor ? (extension.id === newEditor.editorID) : false);
				});
				if (editorExtensions && editorExtensions.length > 0) {
					var editorExtension = editorExtensions[0];
					palettePerspectiveId = editorExtension.palettePerspective;
				}
				
				//Remember if palettes had been expanded because as we add/remove/select tabs these values will be 
				//altered and we'll want to restore them
				newEditorRightPaletteExpanded = newEditor._rightPaletteExpanded;
				newEditorLeftPaletteExpanded= newEditor._leftPaletteExpanded;
			} else {
				//No editor, so use the initital perspective
				palettePerspectiveId = this.initialPerspective || "davinci.ui.main";
			}
				
			if (palettePerspectiveId) {
				var palettePerspective = this.registry.getExtension("davinci.perspective", palettePerspectiveId);
				if (!palettePerspective) {
					this.handleError(dojo.string.substitute(webContent.perspectiveNotFound,[editorExtension.palettePerspective]));
				}
				var paletteDefs = palettePerspective.views;

				// Loop through palette ids and select appropriate palettes
				dojo.forEach(paletteDefs, function(paletteDef) {
					// Look up the tab for the palette and get its 
					// parent to find the right TabContainer
					var paletteId = paletteDef.viewID;
					var position = paletteDef.position;
					if (position.indexOf("bottom") < 0) {
						position += "-top";
					}
					var tab = this._views[paletteId];//dijit.byId(paletteId);
					if (tab) {
						var tabContainer = tab.getParent();
						var desiredTabContainer = mainBody.tabs.perspective[position];
						
						//Move tab
						if (tabContainer != desiredTabContainer) {
							if (tabContainer) {
								//Need to remove from the old tabbed container
								tabContainer.removeChild(tab);
							}
							if (!paletteDef.hidden) {
								desiredTabContainer.addChild(tab);
								tabContainer = desiredTabContainer;
							}
						}

						// Select/hide tab
						if (tabContainer) {
							if (paletteDef.hidden) {
								tabContainer.removeChild(tab);
							} else {
								if (paletteDef.selected) {
									// This flag prevents Workbench.js logic from triggering expand/collapse
									// logic based on selectChild() event
									tabContainer._maqDontExpandCollapse = true;
									tabContainer.selectChild(tab);
									delete tabContainer._maqDontExpandCollapse;
								}
							}
						}
					}
				});
			}
			
			//Restore left/right palette expanded states that were saved earlier
			if (newEditor) {
				if (newEditor.hasOwnProperty("_rightPaletteExpanded")) {
					newEditor._rightPaletteExpanded = newEditorRightPaletteExpanded;
				}
				if (newEditor.hasOwnProperty("_leftPaletteExpanded")) {
					newEditor._leftPaletteExpanded = newEditorLeftPaletteExpanded;
				}
			}
		},
		
		_nearlyCollapsed: function(paletteContainerNode){
			// Check actual width of palette area. If actual width is smaller than the
			// size of the tabs plus a small delta, then treat as if the palettes are collapsed
			var width = dojo.style(paletteContainerNode, 'width');
			if(typeof width == 'string'){
				width = parseInt(width);
			}
			return width < (paletteTabWidth + paletteTabDelta);
		},

		_expandCollapsePaletteContainer: function(tab) {
			if(!tab || !tab.domNode){
				return;
			}
			var paletteContainerNode = this.findPaletteContainerNode(tab.domNode);
			var pcName;
			if (dojo.hasClass(paletteContainerNode,"left_mainBody")) {
				pcName = "left_mainBody";
			}
			if (dojo.hasClass(paletteContainerNode,"right_mainBody")) {
				pcName = "right_mainBody";
			}
			if (!pcName) {
				return;
			}	
			var expanded = paletteContainerNode._maqExpanded;
			var expandToSize; 
			if(this._nearlyCollapsed(paletteContainerNode)){
				expanded = false;
				expandToSize = (paletteCache[pcName].expandToSize >= (paletteTabWidth + paletteTabDelta)) ?
						paletteCache[pcName].expandToSize : paletteCache[pcName].initialExpandToSize;
			}
			if(expanded){
				this.collapsePaletteContainer(paletteContainerNode);
			}else{
				this.expandPaletteContainer(paletteContainerNode, {expandToSize:expandToSize});
			}
		},

		_expandCollapsePaletteContainers: function(newEditor, params) {
			var leftBC = this.left_mainBody;// dijit.byId('left_mainBody');
			var rightBC = this.right_mainBody;// dijit.byId('right_mainBody');
			if(!newEditor){
				if(leftBC){
					this.collapsePaletteContainer(leftBC.domNode, params);
				}
				if(rightBC){
					this.collapsePaletteContainer(rightBC.domNode, params);
				}			
			}else{
				// First, we will get the metadata for the extension and get its list of 
				// palettes to bring to the top
				var editorExtensions=this.registry.getExtensions("davinci.editor", function (extension){
					return extension.id === newEditor.editorID;
				});
				if (editorExtensions && editorExtensions.length > 0) {
					var expandPalettes = editorExtensions[0].expandPalettes;
					var expand;
					if(leftBC){
						if(newEditor && newEditor.hasOwnProperty("_leftPaletteExpanded")){
							expand = newEditor._leftPaletteExpanded;
						}else{
							expand = (expandPalettes && expandPalettes.indexOf('left')>=0);
						}
						if(expand){
							this.expandPaletteContainer(leftBC.domNode, params);
						}else{
							this.collapsePaletteContainer(leftBC.domNode, params);
						}
					}
					if(rightBC){
						if(newEditor && newEditor.hasOwnProperty("_rightPaletteExpanded")){
							expand = newEditor._rightPaletteExpanded;
						}else{
							expand = (expandPalettes && expandPalettes.indexOf('right')>=0);
						}
						if(expand){
							this.expandPaletteContainer(rightBC.domNode, params);
						}else{
							this.collapsePaletteContainer(rightBC.domNode, params);
						}
					}
				}
				
			}
		},

		_updateTitle: function(currentEditor) {
			var newTitle=this._baseTitle;
			if (currentEditor) {
				newTitle = newTitle + " - ";
				if (currentEditor.isDirty) {
					newTitle=newTitle+"*";
				}
				newTitle=newTitle+currentEditor.fileName;
			}
			dojo.doc.title=newTitle;
		},

		/**
		 * With standard TabContainer setup, this callback is invoked 
		 * whenever an editor tab is closed via user action.
		 * But if we are using the "shadow" approach where there is a shadow
		 * TabContainer that shows tabs for the open files, and a StackContainer
		 * to hold the actual editors, then this callback is invoked indirectly
		 * via a removeChild() call in routine _shadowTabClosed() below.
		 * @param page  The child widget that is being closed.
		 */
		_editorTabClosed: function(page) {
			if(!this._editorTabClosing[page.editorId]){
				this._editorTabClosing[page.editorId] = true;
				if (page && page.editor && page.editor.fileName) {
					var editorId = page.editorId;
					var shadowId = editorIdToShadowId(editorId);
					var shadowTabContainer = this.davinci_file_tabs; // dijit.byId("davinci_file_tabs");
					var shadowTab = this._shadows[shadowId];//dijit.byId(shadowId);
					var i = this._state.editors.indexOf(page.editor.fileName);
		            if (i != -1) {
		            	this._state.editors.splice(i, 1);
		            }
					this._updateWorkbenchState();
					if(!this._shadowTabClosing[shadowId]){
						shadowTabContainer.removeChild(shadowTab);
						shadowTab.destroyRecursive();
					}
				}
				var editors= this.editors_container.getChildren();  // dijit.byId("editors_container").getChildren();
				if (!editors.length) {
					this._switchEditor(null);
					this._expandCollapsePaletteContainers(null);
					var editorsStackContainer = this.editorsStackContainer; //  dijit.byId('editorsStackContainer');
					var editorsWelcomePage = this.editorsWelcomePage; // dijit.byId('editorsWelcomePage');
					if (editorsStackContainer && editorsWelcomePage){
						editorsStackContainer.selectChild(editorsWelcomePage);
					}
					this._hideEditorTopPanes();
				}
				delete this._editorTabClosing[page.editorId];
				delete  this._editors[editorId];
			}
		},

		/**
		 * When using the "shadow" approach where there is a shadow
		 * TabContainer that shows tabs for the open files, and a StackContainer
		 * to hold the actual editors, then this callback is invoked when a user clicks
		 * on the tab of the shadow TabContainer. This routine then calls
		 * removeChild() on the StackContainer to remove to corresponding editor.
		 * @param page  The child widget that is being closed.
		 */
		_shadowTabClosed: function(page) {
			if(!this._shadowTabClosing[page.shadowId]){
				this._shadowTabClosing[page.shadowId] = true;
				var shadowId = page.shadowId;
				var editorId = shadowIdToEditorId(shadowId);
				if(!this._editorTabClosing[editorId]){
					var editorContainer = this._editors[editorId]; //dijit.byId(editorId);
					var editorsContainer = this.editors_container; //  dijit.byId("editors_container");
					if(editorsContainer && editorContainer){
						editorsContainer.removeChild(editorContainer);
						editorContainer.destroyRecursive();
					}
				}
				delete this._shadowTabClosing[page.shadowId];
				delete  this._shadows[shadowId];
			}
		},

		getActiveProject: function() {
			/* need to check if there is a project in the URL.  if so, it takes precidence
			 * to the workbench setting
			 */
			
			if (!this._state) {
				//modified by LWF 20130315
				//this._state=Runtime.serverJSONRequest({url:"/backend/cmd/getWorkbenchState", handleAs:"json", sync:true}); //modified by LWF DEL
				var path = this.getUserWorkspaceUrl()+"WorkbenchState.json";
			    srvFilesystem.readFileContents(path, lang.hitch(this, function(content){
			    	var response = JSON.parse(content);
					this._state = response;
		        }),null,null,true);
			}
			
			//var urlProject = dojo.queryToObject(dojo.doc.location.search.substr((dojo.doc.location.search[0] === "?" ? 1 : 0))).project;
			
			//if(urlProject){
			//	Workbench.loadProject(urlProject);
			//}
			
			if (this._state.hasOwnProperty("project")) {
				return this._state.project;
			}

			return this._DEFAULT_PROJECT;
		},
		
		setActiveProject: function(project){
			if(!this._state){
				this._state = {};
			}
			this._state.project = project;
			this._workspace.setCurrentProject(project);
			return this._updateWorkbenchState();
		},
		
		/**
		 * Retrieves a custom property from current workbench state
		 * @param {string} propName  Name of custom property
		 * @return {any} propValue  Any JavaScript value.
		 */
		workbenchStateCustomPropGet: function(propName){
			if(typeof propName == 'string'){
				return this._state[propName];
			}
		},
		
		/**
		 * Assign a custom property to current workbench state and persist new workbench state to server
		 * @param {string} propName  Name of custom property
		 * @param {any} propValue  Any JavaScript value. If undefined, then remove given propName from current workbench state.
		 */
		workbenchStateCustomPropSet: function(propName, propValue){
			if(typeof propName == 'string'){
				if(typeof propValue == 'undefined'){
					delete this._state[propName];
				}else{
					this._state[propName] = propValue;
				}
				this._updateWorkbenchState();
			}
		},
		
		clearWorkbenchState : function(){
			this._state = {};
			return this._updateWorkbenchState();
		},
		
		_updateWorkbenchState: function(){
			
			if(!this._updateWorkbench){
				this._updateWorkbench = new Deferred();
				this._updateWorkbench.resolve();
			}
			
			this._updateWorkbench.then(dojo.hitch(this,function(){
				//modified by LWF 20130315
				/*
				this._updateWorkbench = dojo.xhrPut({
					url: "/backend/cmd/setWorkbenchState", //modified by LWF DEL
					putData: dojo.toJson(this._state),
					handleAs:"text",
					sync:false
				});
				*/
				
				var path = this.getUserWorkspaceUrl()+"WorkbenchState.json";
			    //this._updateWorkbench = srvFilesystem.writeFileContents(path);//modified by LWF TODO
				
				
			}));
			
			return this._updateWorkbench;
		},

		_autoSave: function(){
			var lastSave = this._lastAutoSave;
			var anyErrors = false;
			function saveDirty(editor){
				if (editor.isReadOnly || !editor.isDirty) {
					return;
				}
				
				var modified = editor.lastModifiedTime;
				if (modified && modified>lastSave){
					try {
						editor.save(true);
					}catch(ex){
						console.error("Error while autosaving file:" + ex);
	  					console.error(ex.stack || ex);
						anyErrors = true;
					}
				}
			}
			if(this.editorTabs){
				dojo.forEach(this.editorTabs.getChildren(),	saveDirty,this);
			}
			if(!anyErrors){
				this._lastAutoSave = Date.now();
			}		              
		},

		setupGlobalKeyboardHandler: function() {
			var actionSets = this.registry.getExtensions('davinci.actionSets');

			dojo.forEach(actionSets, function(actionSet) {
				if (actionSet.id == "davinci.ui.main" || actionSet.id == "davinci.ui.editorActions") {
					dojo.forEach(actionSet.actions, function(action) {
						if (action.keyBinding) {
							this.registerKeyBinding(action.keyBinding, action);
						}
					},this);
				}
			},this);
		},
		
		/**
		 * Look for the "palette container node" from node or one of its descendants,
		 * where the palette container node id identified by its
		 * having class 'davinciPaletteContainer'
		 * @param {Element} node  reference node
		 * @returns {Element|undefined}  the palette container node, if found
		 */
		findPaletteContainerNode: function(node){
			var paletteContainerNode;
			var n = node;
			while(n && n.tagName != 'BODY'){
				if(dojo.hasClass(n, 'davinciPaletteContainer')){
					paletteContainerNode = n;
					break;
				}
				n = n.parentNode;
			}
			return paletteContainerNode;
		},
		
		/**
		 * In response to clicking on palette's collapse button,
		 * collapse all palettes within the given palette container node to just show tabs.
		 * @param {Element} node  A descendant node of the palette container node.
		 * 		In practice, the node for the collapse icon (that the user has clicked).
		 * @params {object} params
		 *      params.dontPreserveWidth says to not cache current palette width
		 */
		collapsePaletteContainer: function(node, params){
			var paletteContainerNode = this.findPaletteContainerNode(node);
			if(paletteContainerNode){
				var pcName;
				if (dojo.hasClass(paletteContainerNode,"left_mainBody")) {
					pcName = "left_mainBody";
				}
				if (dojo.hasClass(paletteContainerNode,"right_mainBody")) {
					pcName = "right_mainBody";
				}
				if (!pcName) {
					return;
				}	
				var paletteContainerNodeWidth = dojo.style(paletteContainerNode, 'width');
				var paletteContainerWidget = dijit.byNode(paletteContainerNode);
				var tablistNodes = dojo.query('[role=tablist]', paletteContainerNode);
				if(paletteContainerWidget && tablistNodes.length > 0){
					var tablistNode = tablistNodes[0];
					var tablistNodeSize = dojo.marginBox(tablistNode);
					var parentWidget = paletteContainerWidget.getParent();
					if(parentWidget && parentWidget.resize && tablistNodeSize && tablistNodeSize.w){
						if(!this._nearlyCollapsed(paletteContainerNode) && (!params || !params.dontPreserveWidth)){
							paletteCache[pcName].expandToSize = paletteContainerNodeWidth; // Note: just a number, no 'px' at end
						}
						paletteContainerNode.style.width = tablistNodeSize.w + 'px';
						parentWidget.resize();
						paletteContainerWidget._isCollapsed = true;
					}
				}
				dojo.removeClass(paletteContainerNode, 'maqPaletteExpanded');
				paletteContainerNode._maqExpanded = false;
				this._repositionFocusContainer();
				var currentEditor = this.currentEditor;
				if(currentEditor){
					if(dojo.hasClass(paletteContainerNode, 'left_mainBody')){
						currentEditor._leftPaletteExpanded = false;
					}else if(dojo.hasClass(paletteContainerNode, 'right_mainBody')){
						currentEditor._rightPaletteExpanded = false;
					}
				}
			}
		},
		
		/**
		 * In response to user clicking on one of the palette tabs,
		 * see if the parent palette container node is collapsed.
		 * If so, expand it.
		 * @param {Element} node  A descendant node of the palette container node.
		 * 		In practice, the node for the collapse icon (that the user has clicked).
		 * @param {object} params  A descendant node of the palette container node.
		 * 		params.expandToSize {number}  Desired width upon expansion
		 */
		expandPaletteContainer: function(node, params){
			var expandToSize = params && params.expandToSize;
			var paletteContainerNode = this.findPaletteContainerNode(node);
			if(paletteContainerNode){
				var pcName;
				if (dojo.hasClass(paletteContainerNode,"left_mainBody")) {
					pcName = "left_mainBody";
				}
				if (dojo.hasClass(paletteContainerNode,"right_mainBody")) {
					pcName = "right_mainBody";
				}
				if (!pcName) {
					return;
				}	
				var paletteContainerWidget = dijit.byNode(paletteContainerNode);
				if(expandToSize){
					paletteCache[pcName].expandToSize = expandToSize;
				}
				if(paletteContainerWidget && paletteCache[pcName].expandToSize){
					var parentWidget = paletteContainerWidget.getParent();
					if(parentWidget && parentWidget.resize){
						paletteContainerNode.style.width = paletteCache[pcName].expandToSize + 'px';
						parentWidget.resize();
						delete paletteContainerWidget._isCollapsed;
					}
				}
				dojo.addClass(paletteContainerNode, 'maqPaletteExpanded');
				paletteContainerNode._maqExpanded = true;
				this._repositionFocusContainer();
				var currentEditor = this.currentEditor;
				if(currentEditor){
					if(dojo.hasClass(paletteContainerNode,'left_mainBody')){
						currentEditor._leftPaletteExpanded = true;
					}else if(dojo.hasClass(paletteContainerNode, 'right_mainBody')){
						currentEditor._rightPaletteExpanded = true;
					}
				}
			}
		},

		/**
		 * Reposition the focusContainer node to align exactly with the position of editors_container node
		 */
		_repositionFocusContainer: function(){
			var editors_container = this.editors_container.domNode; // dojo.byId('editors_container');
			var focusContainer = this.focusContainer;
			if(editors_container && focusContainer){
				var currentEditor = this.currentEditor;
				var box;
				if(currentEditor && currentEditor.getFocusContainerBounds){
					box = currentEditor.getFocusContainerBounds();
				}else{
					box = GeomUtils.getBorderBoxPageCoords(editors_container);
				}
				if(box){
					var wkbox = GeomUtils.getBorderBoxPageCoords(this.domNode);
					
					focusContainer.style.left = (box.l-wkbox.l) + 'px';
					focusContainer.style.top = (box.t-wkbox.t) + 'px';
					focusContainer.style.width = box.w + 'px';
					focusContainer.style.height = box.h + 'px';
					if(currentEditor && currentEditor.getContext){
						var context = currentEditor.getContext();
						if(context && context.updateFocusAll){
							context.updateFocusAll();
						}
					}
				}
			}
		},
		
		_hideShowEditorTopPanes: function(displayPropValue){
			var davinci_app = this.davinci_app; //  dijit.byId('davinci_app');
			//----var davinci_file_tabs = this.davinci_file_tabs; // dijit.byId('davinci_file_tabs');
			var davinci_toolbar_pane = this.davinci_toolbar_pane; // dijit.byId('davinci_toolbar_pane');
			//----davinci_file_tabs.domNode.style.display = displayPropValue;
			davinci_toolbar_pane.domNode.style.display = displayPropValue;
			davinci_app.resize();
		},
		_hideEditorTopPanes: function(){
			this._hideShowEditorTopPanes('none');
		},
		_showEditorTopPanes: function(){
			this._hideShowEditorTopPanes('block');
		},

		handleError: function(error) {
			var redirectUrl = "welcome";
//			if(Runtime.singleUserMode()){
//				redirectUrl = ".";
//			}
			
//			window.document.body.innerHTML = dojo.string.substitute(webContent.serverConnectError, {redirectUrl:redirectUrl, error: error});
		},

		executeCommand: function(cmdID) {
			var cmd=this.registry.getExtension("davinci.commands", cmdID);
			if (cmd && cmd.run) {
				cmd.run();
			}
		},

		_selectionChanged: function(selection) {
			this.currentSelection=selection;
		},
		
		getSelection: function() {
			return this.currentSelection;
		},

		
		// deprecated.  will fail for async.  use dojo/_base/xhr directly
		serverJSONRequest: function (ioArgs) {
			var resultObj;
			var args = {handleAs: "json"};
			dojo.mixin(args, ioArgs);

			dojo.xhrGet(args).then(function(result) {
				if (result) {
					resultObj=result;
				}
			});

			return resultObj;
		},

		registerKeyBinding: function(keyBinding, pluginAction) {
			if (!this._globalKeyBindings) {
				this._globalKeyBindings = [];
			}

			this._globalKeyBindings.push({keyBinding: keyBinding, action: pluginAction});
		},

		/* called by any widgets that pass in events from other documents, so iframes from editors */
		handleKeyEvent: function(e) {
			this._handleKeyEvent(e, true);
		},

		/* called when events are trigged on the main document */
		_handleGlobalDocumentKeyEvent: function(e) {
			this._handleKeyEvent(e);
		},

		_handleKeyEvent: function(e, isFromSubDocument) {
			if (!this._globalKeyBindings) {
				return;
			}

			var stopEvent = false;

			stopEvent = dojo.some(this._globalKeyBindings, dojo.hitch(this, function(globalBinding) {
				if (this.isKeyEqualToEvent(globalBinding.keyBinding, e)) {
					this._runAction(globalBinding.action);
					return true;
				}
			}));

			if (stopEvent) {
				dojo.stopEvent(e);
			} else if (!isFromSubDocument) {
				// if not from sub document, let the active editor take a stab
				if (this.currentEditor && this.currentEditor.handleKeyEvent) {
					// pass in true to tell it its a global event
					this.currentEditor.handleKeyEvent(e, true);
				}
			}
		},

		// compares keybinding to event
		isKeyEqualToEvent: function(keybinding, e) {
			var equal = true;

			var hasAccel = ((e.ctrlKey && !dojo.isMac) || (dojo.isMac && e.metaKey))
			var hasMeta = ((e.altKey && !dojo.isMac) || (dojo.isMac && e.ctrlKey))


			if (!!keybinding.accel !== hasAccel) {
				equal = false;
			}

			if (!!keybinding.meta !== hasMeta) {
				equal = false;
			}

			if (!!keybinding.shift !== e.shiftKey) {
				equal = false;
			}

			if (equal && keybinding.charOrCode && e.which) {
				if (dojo.isArray(keybinding.charOrCode)) {
					equal = dojo.some(keybinding.charOrCode, dojo.hitch(this, function(charOrCode) {
						return this._comparecharOrCode(charOrCode, e);
					}));
				} else {
					equal = this._comparecharOrCode(keybinding.charOrCode, e);
				}
			}

			return equal;
		},

		_comparecharOrCode: function(charOrCode, e) {
			var equal;

			if (dojo.isString(charOrCode)) {
				// if we have a string, use fromCharCode
				equal = (charOrCode.toLowerCase() === String.fromCharCode(e.which).toLowerCase());
			} else {
				equal = (charOrCode === e.which);
			}

			return equal;
		},
		
		getUserWorkspaceUrl: function(){
			
			var workspaceUrl = "file://_AppData/QfaceIDE/ws/";
			return workspaceUrl;
		},		
		
		getUserWorkspace : function() {
			return this._workspace;
		},
		
		initializeWorkbenchState : function(){	
			// The _expandCollapsePaletteContainers() call  below collapses the 
			// left-side and right-side palettes before
			// we open any of the editors (and then subsequently potentially expand
			// the left-side and/or right-side palettes as required by that editor).
			// The dontPreserveWidth parameter bubbles down to collapsePaletteContainer()
			// and tells it to *not* cache the current palette width (which it normally does)
			this._expandCollapsePaletteContainers(null, {dontPreserveWidth:true});

			var isReview = function (resPath) {
				return resPath.indexOf(".review") > -1;
			};

			var getReviewVersion = function (resPath) {
				return new Path(resPath).segment(2);
			};
			
			var getReviewResource = function (resPath) {
				return new Path(resPath).removeFirstSegments(3);
			};

			var workbench = this;
			
			var init = function (state) {
				// The following event triggers palettes such as SwitchingStyleViews.js to know
				// that workbench has completed initialization of the initial perspective
				// and associated views. Put after the xhr.get to allow execution parallelism.
				workbench.publish("/davinci/ui/initialPerspectiveReady");

				if (state.project) {
					workbench.setActiveProject(state.project);
				}
				if (state.editors) {
					state.version = davinci.version;
					
					var project = null;
					var singleProject = workbench.singleProjectMode();
				
					if (singleProject) {
						var p = workbench.getProject();
						project = new Path(p);
					}
				
					state.editors.forEach(function(editor){
						var isReviewRes = isReview(editor);
						if(!isReviewRes && singleProject){
							// open all reviews and if running in single user mode, only load editors 
							// open for specific projects
							if (!new Path(editor).startsWith(project)) {
								return;
							}
						}
						
						var handleResource = function(resource) {
							// check if activeEditor is part of the current project or not
							var isActiveEditorInProject = true;
				
							if (singleProject) {
								var path = new Path(state.activeEditor);
								if (!path.startsWith(project)) {
									isActiveEditorInProject = false;
								}
							}
							
							var noSelect = editor != state.activeEditor;
				
							if (noSelect && !isActiveEditorInProject) {
								// if the active editor is not in our project, force selection
								noSelect = false;
								state.activeEditor = editor; // this is now the active editor
							}
				
							if (resource) {
		//						resource.getContent().then(function(content){						
									workbench.openEditor({
										fileName: resource,
										content: resource.getContentSync(),
										noSelect: noSelect,
										isDirty: resource.isDirty(),
										startup: false
									});
		//						});
							}
						};
						
						if(isReviewRes){
							var version = getReviewVersion(editor);
							var resPath = getReviewResource(editor).toString();
							 reviewResource.findFile(version, resPath).then(function(resource) {
								 handleResource(resource);
							 });
						}else{
							//handleResource(sysResource.findResource(editor)); //ToDo will be modified
						}
						
						
					});
				} else {
					state.editors = [];
				}
			};

			if (!workbench._state || !workbench._state.hasOwnProperty("editors")) { //TODO: is this conditional necessary?  could state have been set prior to initialization?
				/* mofified by LWF 20130315
				xhr.get({
					url: "/backend/cmd/getWorkbenchState", //modified by LWF DEL
					handleAs: "json"
				}).then(function(response){
					init((workbench._state = response));
					workbench.setupGlobalKeyboardHandler();
				});
				*/

				var path = workbench.getUserWorkspaceUrl()+"WorkbenchState.json";
			    srvFilesystem.readFileContents(path, lang.hitch(this, function(content){
			    	var response = JSON.parse(content);
					init((workbench._state = response));
					workbench.setupGlobalKeyboardHandler();
		        }),null,null,true);

			} else {                              
				init(workbench._state);
				workbench.setupGlobalKeyboardHandler();
			}
		},
		
		
		getResourceIcon: function(item, opened){
			var isReadOnly = item.readOnly();

			if (item.elementType == "Folder"){
				if (isReadOnly) {
					return opened ? "dijitFolderOpened maqettaReadonlyFolderOpened" : "dijitFolderClosed maqettaReadonlyFolderClosed";
				} else {
					return opened ? "dijitFolderOpened" : "dijitFolderClosed";
				}
			}

			if (item.elementType=="File"){
				var icon,extension,
					fileType=item.getExtension();
					extension=this.registry.getExtension("davinci.fileType", function (extension){
						return extension.extension==fileType;
					});
				if (extension){
					icon=extension.iconClass;

					if (isReadOnly) {
						icon += "ReadOnly"
					}
				}

				if (!icon) {
					icon = "dijitLeaf";

					if (isReadOnly) {
						icon += " maqettaReadonlyFile";
					}
				}
				return icon;
			}
			return this.prototype.getIconClass(item, opened);
		},

		getResourceClass: function(item) {
			if (item.readOnly()) {
				return "readOnlyResource";
			}
		},
		
		_XX_last_member: true	// dummy with no trailing ','
			
		
	});

	return Workbench;
});
