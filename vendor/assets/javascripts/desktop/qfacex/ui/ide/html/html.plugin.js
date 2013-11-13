define("qfacex/ui/ide/html/html.plugin", [
	'require'
], function(require) {

return {
	id: "davinci.html",
	"davinci.editor": [
		{
			id: "HTMLEditor",
			name: "HTML Editor",
			extensions: "html",
			isDefault: false,
			//TODO implement		 icon: "",
			editorClass: "qfacex/ui/ide/html/ui/HTMLEditor",
			palettePerspective: "davinci.html.htmlEditor",
            expandPalettes: ["left"]
		},
		{
			id: "CSSEditor",
			name: "CSS Editor",
			extensions: "css",
			isDefault: true,
			//TODO implement		 icon: "",
			editorClass: "qfacex/ui/ide/html/ui/CSSEditor",
			palettePerspective: "davinci.html.htmlEditor",
            expandPalettes: ["left"]
		},
		{
			id: "ImageViewer",
			name: "Image Viewer",
			extensions: "jpg,gif,jpeg,png",
			isDefault: true,
			//TODO implement		 icon: "",
			editorClass: "qfacex/ui/ide/html/ui/ImageViewer",
			palettePerspective: "davinci.html.htmlEditor",
            expandPalettes: ["left"]
		}
	],
	"davinci.editorActions": {
		editorContribution: {
			targetID: "davinci.html.CSSEditor",
			actions: [
		      {
                  id: "savecombo",
                  className: "maqLabelButton",
                  showLabel: true,
                  label: "Save",
                  toolbarPath: "save",
                  type:'ComboButton',
                  run: function() {
                    	var workbench = this._workbench;
                  		require("qfacex/ui/ide/ui/Resource").save(workbench);
                  },
                  isEnabled: function(context) {
                      return this._workbench.getOpenEditor();
                  },
                  menu:[
                     {
                          iconClass: 'saveIcon',
                          run: function() {
                          		require("qfacex/ui/ide/ui/Resource").save(this._workbench);
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
                              require("qfacex/ui/ide/ui/Resource").saveAs(this._workbench,'html');
                          },
                          isEnabled: function(context) {
                              return this._workbench.getOpenEditor();
                          },
                          label: "Save As",
                  		keyBinding: {accel: true, shift: true, charOrCode: "s", allowGlobal: true}
                      }
                  ]
              }
			]
		}
	},
	"davinci.preferences": [
		{
			name: "HTML",
			id: "general",
			category: "",
			pageContent: "HTML preferences content here"
		}
	],
	"davinci.fileType": [
		{
			extension: "html",
			iconClass: "htmlFileIcon",
			type: "text"
		},
		{
			extension: "css",
			iconClass: "cssFileIcon",
			type: "text"
		},
		{
			extension: "jpeg",
			iconClass: "imageFileIcon",
			type: "image"
		},
		{
			extension: "jpg",
			iconClass: "imageFileIcon",
			type: "image"
		},
		{
			extension: "png",
			iconClass: "imageFileIcon",
			type: "image"
		},
		{
			extension: "gif",
			iconClass: "imageFileIcon",
			type: "image"
		}
	],
	
	"davinci.perspective": [
        {
            id: "htmlEditor",
            title: "HTML Editor",
            views: [
                {
                    viewID: "davinci.ve.Palette",
                    position: "left",
                    hidden: true
                },
                {
                    viewID: "davinci.ui.outline",
                    position: "left",
                    hidden: true
                },
                {
                    viewID: "davinci.ve.style",
                    position: "right"
                },
                {
                    viewID: "davinci.ve.states",
                    position: "right-bottom",
                    hidden: true
                },
                {
                    viewID: "davinci.ui.navigator",
                    position: "left-bottom",
                    selected: true
                }
            ]
        }
    ]
};

});
