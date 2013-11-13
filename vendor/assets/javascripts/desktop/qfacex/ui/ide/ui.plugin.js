define("qfacex/ui/ide/ui.plugin", [
    "require",
    "qfacex/ui/ide/css!./ui.css"    // load css; no return
], function(require) {

return {
    id: "davinci.ui",
    "davinci.view": [
        {
            id: "navigator",
            title: "Files",
            viewClass: "qfacex/ui/ide/workbench/Explorer",
            iconClass: "paletteIcon paletteIconFiles"
        },
        {
            id: "hierarchy",
            title: "Hierarchy"
        },
        {
            id: "outline",
            title: "Outline",
            viewClass: "qfacex/ui/ide/workbench/OutlineView",
            iconClass: "paletteIcon paletteIconOutline"
        },
        {
            id: "scope",
            title: "Scope"
        },
        {
            id: "properties",
            title: "Properties",
            viewClass: "qfacex/ui/ide/workbench/PropertyEditor"
        },
        {
            id: "problems",
            title: "Problems",
            viewClass: "qfacex/ui/ide/workbench/ProblemsView"
        },
        {
            id: "console",
            title: "Console"
        },
        {
            id: "history",
            title: "History"
        },
        {
            id: "search",
            title: "Search"
        }
    ],
    "davinci.preferences": [
        {
            name: "Project",
            id: "project",
            category: "",
            pageContent: "Project Settings here"
        },
        {
            name: "Project Settings",
            id: "ProjectPrefs",
            category: "davinci.ui.project",

            pane: "qfacex/ui/ide/ui/ProjectPreferences",
            defaultValues: {
                "webContentFolder": "",
                "themeFolder": "themes",
                "widgetFolder": "lib/custom"
            }
        }
    ],
    "davinci.perspective": {
        id: "main",
        title: "AJAX IDE",
        views: [
            {
                viewID: "davinci.ui.navigator",
                position: "left-bottom"
            },
            {
                viewID: "davinci.ui.outline",
                position: "right"
            },
            {
                viewID: "davinci.ui.properties",
                position: "right-bottom"
            }
        ]
    },
    "davinci.actionSets": [
       {
           id: "editorActions",
           visible: true,
           menu: [
               {
                   __mainMenu: true,
                   separator: [
                       "new", false, "open", false
                   ]
               },
               {
                   label: "Create",
                   path: "new",
                   id: "davinci.new",
                   separator: [
                       "newApp", true, "newSketch", true, "newFolder", true, "newTheme", true, "newProject", true, "additions", true
                   ]
               },
               {
                   label: "Open",
                   path: "open",
                   id: "davinci.open",
                   separator: [
                       "openFile", true, "openTheme", true, "openProject", true, "openOrion", true, "additions", false
                   ]
               }
           ],
           actions: [
                 {
                     id: "newHTMLMobile",
                     // icon: 'qfacex/ui/ide/img/add.gif',
                     run: function() {
                     	var workbench = this._workbench;
                         require(['qfacex/ui/ide/ui/Resource'], function(r) {
                             r.newHTMLMobile(workbench);
                         });
                     },
                     iconClass: "newOpenMenuItem newMobileAppMenuItem",
                     label: "Mobile Application...",
                     // toolbarPath: "davinci.toolbar.main/edit",
                     menubarPath: "davinci.new/newApp"
                 },
                 {
                     id: "newHTMLDesktop",
                     // icon: 'qfacex/ui/ide/img/add.gif',
                     run: function() {
                     	var workbench = this._workbench;
                         require(['qfacex/ui/ide/ui/Resource'], function(r) {
                             r.newHTMLDesktop(workbench);
                         });
                     },
                     iconClass: "newOpenMenuItem newDesktopAppMenuItem",
                     label: "Desktop Application...",
                     // toolbarPath: "davinci.toolbar.main/edit",
                     menubarPath: "davinci.new/newApp"
                 },
                 {
                     id: "newHTMLSketchHiFi",
                     // icon: 'qfacex/ui/ide/img/add.gif',
                     run: function() {
                     	var workbench = this._workbench;
                         require(['qfacex/ui/ide/ui/Resource'], function(r) {
                             r.newHTMLSketchHiFi(workbench);
                         });
                     },
                     iconClass: "newOpenMenuItem newSketchHiFiMenuItem",
                     label: "Sketch (high-fidelity)...",
                     // toolbarPath: "davinci.toolbar.main/edit",
                     menubarPath: "davinci.new/newSketch"
                 },
                 {
                     id: "newHTMLSketchLoFi",
                     // icon: 'qfacex/ui/ide/img/add.gif',
                     run: function() {
                     	var workbench = this._workbench;
                         require(['qfacex/ui/ide/ui/Resource'], function(r) {
                             r.newHTMLSketchLoFi(workbench);
                         });
                     },
                     iconClass: "newOpenMenuItem newSketchLoFiMenuItem",
                     label: "Sketch (low-fidelity)...",
                     // toolbarPath: "davinci.toolbar.main/edit",
                     menubarPath: "davinci.new/newSketch"
                 },
                 {
                     id: "newFolder",
                     run: function() {
                     	var workbench = this._workbench;
                     	require(['qfacex/ui/ide/ui/Resource'], function(r) {
                     		r.newFolder(workbench);
                     	});
                     },
                     iconClass: "newOpenMenuItem newFolderMenuItem",
                     label: "Folder...",
                     menubarPath: "davinci.new/newFolder"
                 },
                {
                   id: "newCSS",
                   run: function() {
                     	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/Resource'], function(r) {
	                   		r.newCSS(workbench);
	                   	});
                   },
                   iconClass: "newOpenMenuItem newCSSMenuItem",
                   label: "CSS File...",
                   menubarPath: "davinci.new/newFolder"
               },
               {
                   id: "newJS",
                   run: function() {
                     	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/Resource'], function(r) {
	                   		r.newJS(workbench);
	                   	});
                   },
                   iconClass: "newOpenMenuItem newJSMenuItem",
                   label: "JavaScript File...",
                   menubarPath: "davinci.new/newFolder"
               },
               {
                   id: "newTheme",                                     
                   run: function() {
                        var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/NewTheme'], function(NewTheme){
	                   		workbench.showModal(new NewTheme(), 'New Theme', {width: 300}, null, true);
	                   	});
                   },
                   iconClass: "newOpenMenuItem newThemeMenuItem",
                   label: "Theme...",
                   menubarPath: "davinci.new/newTheme"
               },
               {
                   id: "newProject",
                   run: function() {
                     	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/Resource'], function(r) {
	                   		r.newProject(workbench);
                   	});
                   },
                   iconClass: "newOpenMenuItem newProjectMenuItem",
                   label: "Project...",
                   menubarPath: "davinci.new/newProject"
               },
               {
                   id: "openFile",
                   run: function() {
                     	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/Resource'], function(r) {
	                   		r.openFile(workbench);
	                   	});
                   },
                   iconClass: "newOpenMenuItem openFileMenuItem",
                   label: "File...",
                   toolbarPath: "davinci.toolbar.main/edit",
                   menubarPath: "davinci.open/openFile",
                   keyBinding: {accel: true, charOrCode: "o"}
               },
               {
                   id: "openThemeEditor",
                   run: function() {
                    	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/OpenThemeDialog'], function(Workbench, OpenThemeDialog){
	                   		workbench.showModal(new OpenThemeDialog(), 'Open Theme', {width: 200}, null, true);
	                   	});
                   },
                   iconClass: "newOpenMenuItem openThemeMenuItem",
                   label: "Theme Editor...",
                   menubarPath: "davinci.open/openTheme"
               },
               {
                   id: "openProject",
                   run: function() {
                    	var workbench = this._workbench;
	                   	require(['qfacex/ui/ide/ui/SelectProjectDialog'], function(SelectProjectDialog){
	                   		workbench.showModal(new SelectProjectDialog({workbench:workbench}), 'Open Project', {width: 300}, null, true);
	                   	});
                   },
                   iconClass: "newOpenMenuItem newProjectMenuItem",
                   label: "Project...",
                   menubarPath: "davinci.open/openProject"
               },
               {
                   id: "orionNavigator",
                   run: function() {
                     window.open("/navigate/table.html#", '_blank');
                     window.focus();
                   },
                   iconClass: "newOpenMenuItem orionIcon",
                   label: "Orion Navigator",
                   menubarPath: "davinci.open/openOrion"
               }
           ]
        },
        {
            id: "main",
            visible: true,
            menu: [
                {
                    __mainMenu: true,
                    separator: [
                        "usersettings", false, "settings", false, "additions", false, "help",
                        false
                    ]
                },
                {
                    label: "UserSettings",
                    path: "usersettings",
                    id: "davinci.usersettings",
                    className: 'userSettingsMenu',
                    iconClass: 'userSettingsMenuIcon',
                    showLabel:false,
                    separator: [
                        "username", true, "logout", true, "additions", false
                    ]
                },
                {
                    label: "Settings",
                    path: "settings",
                    id: "davinci.settings",
                    className: 'appSettingsMenu',
                    iconClass: 'appSettingsMenuIcon',
                    showLabel:false,
                    separator: [
                        "settings", true, "additions", false
                    ]
                },
                {
                    label: "Help",
                    path: "help",
                    id: "davinci.help",
                    className: 'helpMenu',
                    iconClass: 'helpMenuIcon',
                    showLabel:false,
                    separator: [
                        "help", true, "about", false, "additions", false
                    ]
                }
            ],
            actions: [
                {
                    id: "editPreferences",
                    run: function() {
                    	var workbench = this._workbench;
                    	require(['qfacex/ui/ide/workbench/Preferences'], function(Preferences) {
                    		Preferences.showPreferencePage(workbench);
                    	});
                    },
                    label: "Preferences...",
                    menubarPath: "davinci.settings/settings"
                },
                {
                    id: "editThemeSets",
                    run: function() {
                    	require(['qfacex/ui/ide/ui/ThemeSetsDialog'], function(ThemeSetsDialog){
                    		ThemeSetsDialog();
                    	});
                    },
                    label: "Theme sets...",
                    menubarPath: "davinci.settings/settings"
                },
                {
                    id: "showHelp",
                    run: function() {
                    	window.open('app/docs/index.html', 'MaqettaDocumentation');
                    },
                    label: "Documentation",
                    menubarPath: "davinci.help/help",
                    keyBinding: {charOrCode: dojo.keys.F1}
                },
                {
                    id: "showTutotials",
                    run: function() {
                    	window.open('app/docs/index.html#tutorials/tutorials', 'MaqettaTutorials');
                    },
                    label: "Tutorials",
                    menubarPath: "davinci.help/help"
                },
                {
                    id: "showVideos",
                    run: function() {
                    	window.open('http://www.youtube.com/user/Maqetta/', 'MaqettaVideos');
                    },
                    label: "Videos",
                    menubarPath: "davinci.help/help"
                },
                {
                    id: "showCheatSheets",
                    run: function() {
                    	window.open('app/docs/index.html#cheatsheets/cheatsheets', 'MaqettaCheatSheets');
                    },
                    label: "Cheat sheets",
                    menubarPath: "davinci.help/help"
                },
                {
                    id: "showHowTo",
                    run: function() {
                    	window.open('https://www.ibm.com/search/csass/search/?sn=dw&en=utf&hpp=20&dws=dw&q=maqetta&Search=Search', 'MaqettaHowTo');
                    },
                    label: "How-to articles",
                    menubarPath: "davinci.help/help"
                },
                {
                    id: "about",
                    run: function() {
                    	require(['qfacex/ui/ide/ui/about'], function(about) {
                    		about.show();
                    	});
                    },
                    label: "About Maqetta",
                    menubarPath: "davinci.help/about"
                },
                {
                    id: "username",
                    action: "qfacex/ui/ide/actions/UserNameAction",
                    run: function() {
                    	// do monthing - purely informational
                    },
                    label: "{user}",	// Filled in programmatically by UserNameAction class
                    menubarPath: "davinci.usersettings/username"
                },
                {
                    id: "logout",
                    action: "qfacex/ui/ide/actions/LogoutAction",
                    label: "Logout",
                    menubarPath: "davinci.usersettings/logout"
                }
            ]
        },
        {
            id: "explorerActions",
            visible: true,
            actions: [
                {
                    id: "davinci.ui.newfile",
                    label: "New folder...",
                    iconClass:"newFolderIcon",
                    run: function() {
                    	var workbench = this._workbench;
                    	require(['qfacex/ui/ide/ui/Resource'], function(r) {
                    		r.newFolder(workbench);
                    	});
                    },
                    isEnabled: function(item) {
                        return require('qfacex/ui/ide/ui/Resource').canModify(item);
                    },
                    menubarPath: "newfolder"
                },
                {
                    id: "davinci.ui.addFiles",
                    label: "Upload files...",
                    iconClass:"uploadIcon",
                    run: function() {
                    	var workbench = this._workbench;
                    	require(['qfacex/ui/ide/ui/Resource'], function(r) {
                    		r.addFiles(workbench);
                    	});
                    },
                    isEnabled: function(item) {
                        return require('qfacex/ui/ide/ui/Resource').canModify(item);
                    },
                    menubarPath: "addFiles"
                },
                {
                    id: "davinci.ui.rename",
                    label: "Rename...",
                    iconClass:"renameIcon",
                    run: function() {
                    	var workbench = this._workbench;
                    	require(['qfacex/ui/ide/ui/Resource'], function(r) {
                    		r.renameAction(workbench);
                    	});
                    },
                    isEnabled: function(item) {
                        return require('qfacex/ui/ide/ui/Resource').canModify(item);
                    },
                    menubarPath: "addFiles"
                },
                {
                    id: "davinci.ui.delete",
                    label: "Delete",
                    iconClass: "deleteIcon",
                    isEnabled: function(item) {
                        return require('qfacex/ui/ide/ui/Resource').canModify(item);
                    },
                    run: function() {
                    	var workbench = this._workbench;
                    	require(['qfacex/ui/ide/ui/Resource'], function(r) {
                    		r.deleteAction(workbench);
                    	});
                    },
                    menubarPath: "delete",
                    keyBinding: {charOrCode: [dojo.keys.DELETE, dojo.keys.BACKSPACE]}
                },
                {
                    id: "davinci.ui.download",
                    label: "Download",
                    iconClass: "downloadSomeIcon",
                    action: "qfacex/ui/ide/actions/DownloadAction",
                    isEnabled: function(item) {
                        return require('qfacex/ui/ide/ui/Resource').canModify(item);
                    },
                    menubarPath: "delete"
                }
                
                
            ]
        }
    ],
    "davinci.actionSetPartAssociations": [
        {
            targetID: "davinci.ui.editorActions",
            parts: [
                "davinci.ui.editorMenuBar"
            ]
        },
        {
            targetID: "davinci.ui.explorerActions",
            parts: [
                "davinci.ui.navigator"
            ]
        }
    ],
    "davinci.viewActions": [
        {
            viewContribution: {
                targetID: "davinci.ui.problems",
                actions: [
                    {
                        id: "Copy2",
                        iconClass: 'copyIcon',
                        run: function() {
                            alert("view toolbar");
                        },
                        label: "Copy",
                        toolbarPath: "davinci.toolbar.main/edit",
                        menubarPath: "davinci.edit/cut"
                    }
                ]
            }
        },

        /* deployment icon in the file explorer toolbar */
        {
            viewContribution: {
                targetID: "workbench.Explorer",
                actions: [
                    {
                        id: "download",
                        iconClass: 'downloadAllIcon',
                        run: function() {
                        	var workbench = this._workbench;
                            require(['./ui/Download'],
                                function( Download) {
                                	workbench.showModal(new Download({workbench:workbench}), "Download", {width: 440});
                                }
                            );
                        },
                        label: "Download Entire Workspace",
                        toolbarPath: "download"
                    },
                    {
                        id: "download",
                        iconClass: 'downloadSomeIcon',
                        run: function() {
                        	var workbench = this._workbench;
                            require(['./ui/DownloadSelected'],
                                function(DownloadSelected) {
                                	workbench.showModal(new DownloadSelected({workbench:workbench}), "Download", {width: 440});
                                }
                            );
                        },
                        label: "Download Selected Files",
                        toolbarPath: "download"
                    },
                    {
                        id: "userlibs",
                        iconClass: 'userLibIcon',
                        run: function() {
                        	var workbench = this._workbench;
                            require([ './ui/UserLibraries'],
                                function( UserLibraries) {
                                    workbench.showModal(new UserLibraries(), "User Libraries", "width: 400px");
                                }
                            );
                        },
                        label: "Modify Libraries",
                        toolbarPath: "download"
                    }
                    
                    
                    
                    
                ]
            }
        }
    ]
};

});
