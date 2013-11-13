define("qfacex/ui/ide/ve/ve.plugin", [
    "require"
//  "../Workbench"
], function(require) {

return {
    id: "davinci.ve",
    "davinci.view": [
        {
            id: "Palette",
            title: "Palette",
            viewClass: "qfacex/ui/ide/ve/palette/HtmlWidgets",
            iconClass: "paletteIcon paletteIconWidgets"
        },
        {
            id: "states",
            title: "Scenes",
            viewClass: "qfacex/ui/ide/ve/views/StatesView",
            iconClass: "paletteIcon paletteIconStates"
        },
        /*
         * { id:"datastores", title:"DataStores", viewClass: "qfacex/ui/ide/ve/views/DataStoresView" },
         */
        {
            id: "object",
            title: "Object",
            viewClass: "qfacex/ui/ide/ve/views/ObjectView"
        },

        /* a style view that allows switching between other style views via the toolbar */

        {
            id: "style",
            title: "",	// Tab titles for property tabs are generated programmatically
            viewClass: "qfacex/ui/ide/ve/views/SwitchingStyleView"
        }
    ],

    "davinci.perspective": [
        {
            id: "pageDesign",
            title: "Page Design",
            views: [
                {
                    viewID: "davinci.ve.Palette",
                    position: "left",
                    selected: true
                },
                {
                    viewID: "davinci.ui.outline",
                    position: "left"
                },
                {
                    viewID: "davinci.ve.style",
                    position: "right"
                },
                {
                    viewID: "davinci.ui.navigator",
                    position: "left-bottom",
                    selected: true
                }
            ]
        }
    ],

    "davinci.editor": [
        {
            id: "HTMLPageEditor",
            name: "HTML Visual Editor",
            extensions: ["html","htm", "php"],
            isDefault: true,
            // TODO implement icon : "",
            editorClass: "qfacex/ui/ide/ve/PageEditor",
            palettePerspective: "davinci.ve.pageDesign",
            expandPalettes: ["left"]
        }
    ],
    "davinci.actionSets": [
        {
            id: "cutCopyPaste",
            visible: true,
            actions: [
                {
                    label: "Cut",
                    keySequence: "M1+X",
                    iconClass: "editActionIcon editCutIconSmall",
                    action: "qfacex/ui/ide/ve/actions/CutAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    label: "Copy",
                    keySequence: "M1+C",
                    iconClass: "editActionIcon editCopyIconSmall",
                    action: "qfacex/ui/ide/ve/actions/CopyAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    keySequence: "M1+V",
                    iconClass: "editActionIcon editPasteIconSmall",
                    label: "Paste",
                    action: "qfacex/ui/ide/ve/actions/PasteAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    keySequence: "DEL",
                    iconClass: "editActionIcon editDeleteIconSmall",
                    label: "Delete",
                    action: "qfacex/ui/ide/ve/actions/DeleteAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon selectParentIconSmall",
                    label: "Select parent",
                    action: "qfacex/ui/ide/ve/actions/SelectParentAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon selectAncestorIconSmall",
                    label: "Select ancestor...",
                    action: "qfacex/ui/ide/ve/actions/SelectAncestorAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon unselectAllIconSmall",
                    label: "Unselect all",
                    action: "qfacex/ui/ide/ve/actions/UnselectAllAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon",
                    label: "Surround with &lt;A&gt;",
                    action: "qfacex/ui/ide/ve/actions/SurroundAction",
                    surroundWithTagName:'a',
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon",
                    label: "Surround with &lt;DIV&gt;",
                    action: "qfacex/ui/ide/ve/actions/SurroundAction",
                    surroundWithTagName:'div',
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon",
                    label: "Surround with &lt;SPAN&gt;",
                    action: "qfacex/ui/ide/ve/actions/SurroundAction",
                    surroundWithTagName:'span',
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon moveToFrontIconSmall",
                    label: "Move to front",
                    action: "qfacex/ui/ide/ve/actions/MoveToFrontAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon moveForwardIconSmall",
                    label: "Move forward",
                    action: "qfacex/ui/ide/ve/actions/MoveForwardAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon moveBackwardIconSmall",
                    label: "Move backward",
                    action: "qfacex/ui/ide/ve/actions/MoveBackwardAction",
                    menubarPath: "davinci.edit/cut"
                },
                {
                    iconClass: "editActionIcon moveToBackIconSmall",
                    label: "Move to back",
                    action: "qfacex/ui/ide/ve/actions/MoveToBackAction",
                    menubarPath: "davinci.edit/cut"
                }/*,
                {
                    iconClass: "editActionIcon",
                    label: "Application States...",
                    action: "qfacex/ui/ide/ve/actions/EnableApplicationStates",
                    menubarPath: "davinci.edit/cut"
                }*/
            ]
        },
        {
            id: "datastoreActions",
            visible: true,
            actions: [
                {
                    id: "davinci.ui.generateform",
                    label: "Generate Form",
                    run: function(){
                    	require("qfacex/ui/ide/ve/views/DataStoresView").generateForm();
                    },
                    menubarPath: "newfile"
                },
                {
                    id: "davinci.ui.generateform",
                    label: "Generate Table",
                    run: function(){
                    	require("qfacex/ui/ide/ve/views/DataStoresView").generateTable();
                    },
                    menubarPath: "newfile"
                }
            ]
        }
    ],
    "davinci.viewActions": [
        {
            viewContribution: {
                targetID: "davinci.ve.outline",
                actions: [
                    {
                        id: "design",
                        iconClass: 'designModeIcon editActionIcon',
                        radioGroup: "displayMode",
                        method: "switchDisplayMode",
                        // initialValue : true,
                        label: "Widgets",
                        toolbarPath: "displayMode"
                    },
                    {
                        id: "source",
                        iconClass: 'sourceModeIcon editActionIcon',
                        method: "switchDisplayMode",
                        radioGroup: "displayMode",
                        label: "Source",
                        toolbarPath: "displayMode"
                    }
                ]
            }
        },
        {
            viewContribution: {
                targetID: "davinci.ve.states",
                actions: [
					{
						id: "addState",
						iconClass: 'viewActionIcon addStateIcon',
						action: "qfacex/ui/ide/ve/actions/AddState",
						label: "Add State",
						toolbarPath: "states1"
					},
					{
						id: "removeState",
						iconClass: 'viewActionIcon removeStateIcon',
						action: "qfacex/ui/ide/ve/actions/RemoveState",
						label: "Remove State",
						toolbarPath: "states1"
					},
					{
						id: "modifyState",
						iconClass: 'viewActionIcon modifyStateIcon',
						action: "qfacex/ui/ide/ve/actions/ModifyState",
						label: "Modify State",
						toolbarPath: "states1"
					}

                ]

            }
        }
    ],
    "davinci.actionSetPartAssociations": [
        {
            targetID: "davinci.ve.cutCopyPaste",
            parts: [
                "davinci.ve.visualEditor", "davinci.ve.VisualEditorOutline"
            ]
        }
    ],
    "davinci.editorActions": {
        editorContribution: {
            targetID: "davinci.ve.HTMLPageEditor",
            actions: [
              {
                  id: "savecombo",
                  className: "maqLabelButton",
                  showLabel: true,
                  label: "Save",
                  toolbarPath: "save",
                  type:'ComboButton',
                  run: function() {
                  		require("../ui/Resource").save(this._workbench);
                  },
                  isEnabled: function(context) {
                      return this._workbench.getOpenEditor();
                  },
                  menu:[
                     {
                          iconClass: 'saveIcon',
                          run: function() {
                          		require("../ui/Resource").save(this._workbench);
                          },
                          isEnabled: function(context) {
                              return this._workbench.getOpenEditor();
                          },
                          label: "Save",
                  		keyBinding: {accel: true, charOrCode: "s", allowGlobal: true}
                      },
                      {
                          iconClass: 'saveAsIcon',
                          run: function() {
                              require("../ui/Resource").saveAs(this._workbench,'html');
                          },
                          isEnabled: function(context) {
                              return this._workbench.getOpenEditor();
                          },
                          label: "Save As",
                  		keyBinding: {accel: true, shift: true, charOrCode: "s", allowGlobal: true}
                      },
                      {
                          id: "saveasdijit",
                          iconClass: 'saveAsDijitIcon',
                          run: function(){
                              return require(['qfacex/ui/ide/de/resource'], function(r){
                                	r.createDijiFromNewDialog();
                              })
                          },
                          isEnabled: function(context) {
                              return this._workbench.getOpenEditor();
                           },
                           label: "Save As Widget"
                       },
                  ]
              },
  				{
                	id: "undo",
                    iconClass: 'editActionIcon undoIcon',
                    action: "qfacex/ui/ide/actions/UndoAction",
                    label: "Undo",
                    //showLabel: true,
                    toolbarPath: "undoredo",
                    keyBinding: {accel: true, charOrCode: "z"}
                },
                {
                    id: "redo",
                    iconClass: 'editActionIcon redoIcon',
                    action: "qfacex/ui/ide/actions/RedoAction",
                    //showLabel: true,
                    label: "Redo",
                    toolbarPath: "undoredo",
                    keyBinding: {accel: true, shift: true, charOrCode: "z"}
                },
				{
				    id: "cut",
				    label: "Cut",
				    iconClass: "editActionIcon editCutIcon",
				    action: "qfacex/ui/ide/ve/actions/CutAction",
				    toolbarPath: "cutcopypaste",
				    keyBinding: {accel: true, charOrCode: "x"}
				
				},
				{
				    id: "copy",
				    label: "Copy",
				    iconClass: "editActionIcon editCopyIcon",
				    action: "qfacex/ui/ide/ve/actions/CopyAction",
				    toolbarPath: "cutcopypaste",
				    keyBinding: {accel: true, charOrCode: "c"}
				},
                {
                    label: "Paste",
                    iconClass: "editActionIcon editPasteIcon",
                    action: "qfacex/ui/ide/ve/actions/PasteAction",
                    toolbarPath: "cutcopypaste",
                    keyBinding: {accel: true, charOrCode: "v"}
                },
				{
                    id: "delete",
                    iconClass: "editActionIcon editDeleteIcon",
                    label: "Delete",
                    action: "qfacex/ui/ide/ve/actions/DeleteAction",
                    toolbarPath: "delete",
                    keyBinding: {charOrCode: [dojo.keys.DELETE, dojo.keys.BACKSPACE]}
                },
                {
                    id: "openBrowser",
                    iconClass: 'openBrowserIcon',
                    className: 'davinciFloatRight openBrowser',
                    run: function() {
                        var editor = this._workbench.getOpenEditor();
                        if (editor && editor.resourceFile) {
                            editor.previewInBrowser();
                        } else {
                            console.error("ERROR. Cannot launch browser window. No editor info.");
                        }
                    },
                    label: "Preview in Browser",
                    toolbarPath: "undoredo",
                    keyBinding: {accel: true, charOrCode: "0", allowGlobal: true}
                },
                {
                    id: "documentSettings",
                    iconClass: 'documentSettingsIcon',
                    className: 'documentSettings davinciFloatRight',
                    label: "Document settings",
                    toolbarPath: "undoredo",
                    type:'DropDownButton',
                    menu:[
                       {
                           id: "chooseDevice",
                           iconClass: 'deviceIcon',
                           className: "davinciFloatRight",
                           action: "qfacex/ui/ide/ve/actions/ChooseDeviceAction",
                           label: "Choose device"
                       },
                       {
                           id: "rotateDevice",
                           iconClass: 'rotateIcon',
                           className: "davinciFloatRight",
                           action: "qfacex/ui/ide/ve/actions/RotateDeviceAction",
                           label: "Rotate device"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Select parent",
                           action: "qfacex/ui/ide/ve/actions/SelectParentAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Select ancestor...",
                           action: "qfacex/ui/ide/ve/actions/SelectAncestorAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Unselect all",
                           action: "qfacex/ui/ide/ve/actions/UnselectAllAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Move to front",
                           action: "qfacex/ui/ide/ve/actions/MoveToFrontAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Move forward",
                           action: "qfacex/ui/ide/ve/actions/MoveForwardAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Move backward",
                           action: "qfacex/ui/ide/ve/actions/MoveBackwardAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Move to back",
                           action: "qfacex/ui/ide/ve/actions/MoveToBackAction"
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Surround with &lt;A&gt;",
                           action: "qfacex/ui/ide/ve/actions/SurroundAction",
                           surroundWithTagName:'a'
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Surround with &lt;DIV&gt;",
                           action: "qfacex/ui/ide/ve/actions/SurroundAction",
                           surroundWithTagName:'div'
                       },
                       {
                           iconClass: "editActionIcon",
                           label: "Surround with &lt;SPAN&gt;",
                           action: "qfacex/ui/ide/ve/actions/SurroundAction",
                           surroundWithTagName:'span'
                       }/*,
                       {
                           iconClass: "editActionIcon",
                           label: "Application States...",
                           action: "qfacex/ui/ide/ve/actions/EnableApplicationStates"
                       }*/
                    ]
                },
                {
                    id: "stickynote",
                    iconClass: 'stickynoteIcon',
                    action: "qfacex/ui/ide/actions/StickyNoteAction",
                    label: "Add note",
                    toolbarPath: "stickynote"
                },
                {
                    id: "layout",
                    className: "maqLabelButton davinciFloatRight maqLayoutDropDownButton",
                    showLabel: true,
                    label: "Flow",	// will be updated by code
                    toolbarPath: "undoredo",
                    type:'DropDownButton',
                    menu:[
                        {
                            label: "Flow",
                            iconClass: "flowLayoutIcon",
                            method: "selectLayoutFlow"
                        },
                        {
                            label: "Absolute",
                            iconClass: "absoluteLayoutIcon",
                            method: "selectLayoutAbsolute"
                        }
                   ]
                 },
                {
                    id: "sourcecombo",
                    className: "maqLabelButton davinciFloatRight maqSourceComboButton",
                    showLabel: true,
                    label: "Source",
                    action: "qfacex/ui/ide/ve/actions/ViewSourceAction",
                    toolbarPath: "undoredo",
                    type:'ComboButton',
                    menu:[
                       {
                            keyBinding: {accel: true, charOrCode: "2", allowGlobal: true},
                            iconClass: 'editActionIcon sourceModeIcon sourceMenuIcon',
                            action: "qfacex/ui/ide/ve/actions/ViewSourceMenuAction",
                            label: "Source only"
                        },
                        {
                            keyBinding: {accel: true, charOrCode: "3", allowGlobal: true},
                            iconClass: 'editActionIcon splitVerticalIcon sourceMenuIcon',
                            action: "qfacex/ui/ide/ve/actions/ViewSplitVMenuAction",
                            label: "Split Vertically"
                        },
                        {
                            keyBinding: {accel: true, charOrCode: "4", allowGlobal: true},
                            iconClass: 'editActionIcon splitHorizontalIcon sourceMenuIcon',
                            action: "qfacex/ui/ide/ve/actions/ViewSplitHMenuAction",
                            label: "Split Horizontally"
                        }
                    ]
                },
                {
                    id: "design",
                    //iconClass: 'designModeIcon editActionIcon',
                    showLabel: true,
                    className: 'maqLabelButton davinciFloatRight maqDesignButton',
                    action: "qfacex/ui/ide/ve/actions/ViewDesignAction",
                    label: "Design",
                    toolbarPath: "undoredo",
                    keyBinding: {accel: true, charOrCode: "1", allowGlobal: true}
                },
                {
                    id: "closeactiveeditor",
                    run: function() {
                        require(['../Workbench'], function(workbench) {
                            workbench.closeActiveEditor();
                        });
                    },
                    keyBinding: {accel: true, shift: true, charOrCode: "w", allowGlobal: true}
                },
                {
                    id: "showWidgetsPalette",
                    run: function() {
                    	var tab = dijit.byId("davinci.ve.Palette");
                    	if (tab) {
                    		var tabContainer = tab.getParent();
                    		// Select tab
                    		if (tabContainer) {
                    			tabContainer.selectChild(tab);
                    		}
                    	} 
                    },
                    keyBinding: {meta: true, charOrCode: "p", allowGlobal: true}
                }
            ]
        }
    },
    "davinci.preferences": [
        {
            name: "Visual Editor",
            id: "editorPrefs",
            category: "davinci.html.general",
            pane: "qfacex/ui/ide/ve/prefs/HTMLEditPreferences",
            defaultValues: {
                "flowLayout": true,
                "snap": true,
				"showPossibleParents": false,
                "cssOverrideWarn": true,
                "absoluteWidgetsZindex": 900
            }
        }
    ],
    "davinci.dnd": [
        {
            parts: [
                "davinci.ui.navigator"
            ],
            dragSource: function(object) {
                if (object.elementType == 'File') {
                    return (/gif|jpeg|jpg|png|svg|json/i).test(object.getExtension());
                }
            },
            dragHandler: "qfacex/ui/ide/ve/palette/ImageDragSource"
        }
    ],
    "davinci.fileType": [
        {
            extension: "theme",
            iconClass: "themeFileIcon",
            type: "text"
        }
    ],
    "davinci.defaultEditorActions": {
			editorContribution: {
				actions: [
					{
						id: "save",
						run: function() {
	                    	var workbench = this._workbench;
							workbench.getOpenEditor().save();
						},
						isEnabled: function(context) {
							return true;
						},
		                className: "maqLabelButton",
		                showLabel: true,
						label: "Save",
						toolbarPath: "save",
						keyBinding: {accel: true, charOrCode: "s"}
					},
					{
						id: "undo",
					    iconClass: 'editActionIcon undoIcon',
					    action: "qfacex/ui/ide/actions/UndoAction",
					    label: "Undo",
					    //showLabel: true,
					    toolbarPath: "undoredo",
					    keyBinding: {accel: true, charOrCode: "z"}
					},
					{
					    id: "redo",
					    iconClass: 'editActionIcon redoIcon',
					    action: "qfacex/ui/ide/actions/RedoAction",
					    //showLabel: true,
					    label: "Redo",
					    toolbarPath: "undoredo",
					    keyBinding: {accel: true, shift: true, charOrCode: "z"}
					}
				]
			}
		}
};

});
