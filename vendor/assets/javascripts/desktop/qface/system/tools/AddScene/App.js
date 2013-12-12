define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.extend lang.isArray
	"dojo/topic",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-style",
	"dijit/layout/TabContainer",
	"dijit/form/Form",
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"qface/system/app/Application",
	"qfacex/widgets/window/Window",
	"dojo/i18n!./nls/addScene",
],function(array,declare,lang,topic,domConstruct,domStyle,TabContainer,Form,Select,ValidationTextBox,Button,_App,
	Window,nlsApp) {
	return declare([_App], {
		init: function(){
			var win = this.win = new Window({
	      app: this,
				title: nlsApp.title,
				width: "300px",
				height: "270px",
				iconClass: "icon-16-apps-accessories-calculator",
				onClose: lang.hitch(this, "kill")
			});
			var tab = new TabContainer({style:"height:100%;width:100%;"});

			tab.addChild(this._createAddSceneForm(nlsApp));
			win.addChild(tab);
			win.show();
			win.startup();

			// subscribed by FormWidget
			topic.publish("qface/system/tools/addScene",{win:win});
		},

		_createAddSceneForm: function(nls){
			var form = new Form({title:"add scene",class:"addSceneForm"});

			var typeOptions = [
				{ label: "MultiApp", value: "qface/system/desktop/scene/impl/explorer/MultiAppScene"},
				{ label: "MultiTab", value: "qface/system/desktop/scene/impl/explorer/MultiTabScene"},
				{ label: "SingleApp", value: "qface/system/desktop/scene/impl/explorer/SingleAppScene"},
				{ label: "icons", value: "qface/system/desktop/scene/impl/icons/Scene" }
			];
			var themeOptions = [
				{ label: "soria", value: "soria"},
				{ label: "tsunami", value: "tsunami"},
				{ label: "tundra", value: "tundra"},
				{ label: "mobile", value: "mobile" }
			];

			this.__createLabel(form,nls["form_name"]);
			this.__createText(form,nls["form_name"],nls["form_name_placeHolder"]);
			this.__createEmptyLine(form);

			this.__createLabel(form,nls["form_type"]);
			this.__createSelect(form,nls["form_type"],typeOptions);
			this.__createEmptyLine(form);

			this.__createLabel(form,nls["form_theme"]);
			this.__createSelect(form,nls["form_theme"],themeOptions);
			this.__createEmptyLine(form);

			this.__createButton(form,nls);
			return form;
		},

		_createAddAppForm: function(){

		},

		__createEmptyLine: function(/*ob*/form){
			domConstruct.create("span",{class:"emptyLine"},form.domNode);
		},

		__createSelect: function(/*obj*/form,/*string*/name,/*[{}]*/options,/*string*/className){
			className = className ? className + " formSelect" : "formSelect";
			form.domNode.appendChild((new Select({name:name,options: options,class:className})).domNode);
		},

		__createText: function(/*obj*/form,/*string*/name,/*string*/placeHolder,/*string*/className){
			className = className ? className + " formText" : "formText";
			form.domNode.appendChild((new ValidationTextBox({required:true,name:name,placeHolder:placeHolder,class:className})).domNode);
		},
		
		__createLabel: function(/*obj*/form,/*string*/name){
			var label = domConstruct.create("label",{},form.domNode);
			domConstruct.create("span",{innerHTML:name + ":"},label);
		},

		__createButton: function(/*obj*/form,/*obj*/nls){
			var self = this;
		 	var cancel = new Button({
		 		label:nls["cancel"],
		 		class:"formCancel",
		 		onClick: lang.hitch(this,function(){
		 			this.win.close();
		 		})
		 	});
		 	form.domNode.appendChild(cancel.domNode);

		 	var save = new Button({
		 		label:nls["save"],
		 		class:"formSave",
		 		onClick: function(){
					if(form.validate()){
						var value = form.getValues(); 
						var name = value.name;
						var type = value.type;
						var theme = value.theme;
						require([type],function(sceneClass) {
							// create new scene add to sceneContainer
							var scene = new sceneClass({name:name,theme:theme,desktop:self.desktop});
							var config = {
								"type"  : type,
								"theme" : theme,
								"wallpaper": {
									"image": "./wallpaper1.png",
									"color": "#696969",
									"style": "centered",
									"storedList": []
								},
								"apps":[]
							}
							self.scene.desktop.addScene(scene);
							scene.init(config);

							// close the add window
							self.win.close();

							// jump to new scene
							self.scene.desktop.sceneNaviBar.selectScene(name);

						});
					}else{
						alert('Form contains invalid data.  Please correct first');
						return false;
					}
					return true;
		 		}
		 	});
		 	form.domNode.appendChild(save.domNode);
		},

		kill: function(){
			if(!this.win.closed) this.win.close();
		}
	});

});
