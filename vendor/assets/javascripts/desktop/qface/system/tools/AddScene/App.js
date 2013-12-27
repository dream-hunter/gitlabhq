define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.extend lang.isArray
	"dojo/topic",
	"dojo/query",
	"dojo/on",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-style",
	"dijit/layout/TabContainer",
	"dijit/form/Form",
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"dijit/form/RadioButton",
	"qface/system/app/Application",
	"qfacex/widgets/window/Window",
	"dojo/i18n!./nls/addScene",
],function(array,declare,lang,topic,query,on,domConstruct,domStyle,TabContainer,Form,Select,ValidationTextBox,Button,RadioButton,
	_App,Window,nlsAppTool) {
	return declare([_App], {
		constructor: function(){
			var typeOptions = this.typeOptions = [
				{ label: "MultiApp", value: "qface/system/desktop/scene/impl/explorer/MultiAppScene"},
				{ label: "MultiTab", value: "qface/system/desktop/scene/impl/explorer/MultiTabScene"},
				{ label: "SingleApp", value: "qface/system/desktop/scene/impl/explorer/SingleAppScene"},
				{ label: "icons", value: "qface/system/desktop/scene/impl/icons/Scene" }
			];
			var themeOptions = this.themeOptions = [
				{ label: "soria", value: "soria"},
				{ label: "tsunami", value: "tsunami"},
				{ label: "tundra", value: "tundra"},
				{ label: "mobile", value: "mobile" }
			];
			this.inherited(arguments);
		},

		init: function(){
			this.nls = nlsAppTool;
			var win = this.win = new Window({
				app: this,
				title: nlsAppTool.title,
				width: "550px",
				height: "580px",
				iconClass: "icon-16-apps-accessories-calculator",
				onClose: lang.hitch(this, "kill")
			});
			var tab = new TabContainer({style:"height:100%;width:100%;",class:"configuration"});

			tab.addChild(this._createChangeThemeForm());
			tab.addChild(this._createAddSceneForm());
			tab.addChild(this._createAddAppForm());
			win.addChild(tab);
			win.show();
			win.startup();

			// subscribed by FormWidget
			topic.publish("qface/system/tools/addScene",{win:win});
		},

		kill: function(){
			if(!this.win.closed) this.win.close();
		},

		_createAddSceneForm: function(){
			var sceneForm = new Form({title:this.nls["addScene"],class:"form addSceneForm"});

			this.__createLabel(sceneForm,this.nls["formName"]);
			this.__createText(sceneForm,"name",this.nls["formNamePlaceHolder"]);
			this.__createEmptyLine(sceneForm);

			this.__createLabel(sceneForm,this.nls["formType"]);
			this.__createSelect(sceneForm,"type",this.typeOptions);
			this.__createEmptyLine(sceneForm);

			this.__createLabel(sceneForm,this.nls["formTheme"]);
			this.__createSelect(sceneForm,"theme",this.themeOptions);
			this.__createEmptyLine(sceneForm);

			this.__createButton(sceneForm,this.nls,"__SceneCallBack");
			return sceneForm;
		},

		_createAddAppForm: function(){
			var appForm = new Form({title:this.nls["addApp"],class:"form addAppForm"});

			this.__createLabel(appForm,this.nls["formScene"]);
			this.__createSelect(appForm,"scene",this.typeOptions);
			this.__createEmptyLine(appForm);

			this.__createButton(appForm,this.nls,"__AppCallBack");

			return appForm;
		},

		_createChangeThemeForm: function(){
			var self = this;
			var themeForm = new Form({title:this.nls["changeTheme"],class:"form changeThemeForm"});

			this.__createLabel(themeForm,this.nls["formTheme"]);
			var select = new Select({name:"theme",options: this.themeOptions,class:"themeName"});
			on(select,"change",function(){
				self.scene.changeTheme(this.get("value"));
			});
			themeForm.domNode.appendChild(select.domNode);
			this.__createEmptyLine(themeForm);

			this.__createLabel(themeForm,this.nls["background"]);
			var bgColors = [{default:"#f1f1f1"},{classic:"#31363e"},{modern:"#345345"},{gray:"#373737"},{violet:"#547547"}];
			var bgTypes = [{topPane:"updateSystemPanelColor"},{bottomPane:"updatePanelBgcolor"},{wallpaper:"updateWallpaperBgColor"}];
			var themesOptsDiv = domConstruct.create("div",{class:"bgColorOpts"},themeForm.domNode);

			array.forEach(bgTypes,function(item,i){
				var key = Object.keys(item)[0];
				var value = item[key];
				var label = domConstruct.create("label",{class:"bgType"},themesOptsDiv);
				var checkbox = domConstruct.create("input",{
					checked: i===0 ? true : false,
					name: "style",
					type: "checkbox",
					value: i,
					onclick: function(){
						query(".bgType > input").forEach(function(input){input.checked = false});
						this.checked = true;
						var colorNode = query(".bgColor > input:checked")[0];
						var color = colorNode ? colorNode.value : "#f1f1f1";
						lang.hitch(self.scene,value,color)();
					}
				},label);
				domConstruct.create("span",{innerHTML:key},label);
			});

			array.forEach(bgColors,lang.hitch(this,function(item,i){
				var key = Object.keys(item)[0];
				var value = item[key];
				var label = domConstruct.create("label",{class:"bgColor"},themesOptsDiv);
				domConstruct.create("div",{class:"prev " + key,style:"background:" + value},label);
				// var radio = new RadioButton({
				var radio = domConstruct.create("input",{
					checked: i===0 ? true : false,
					type: "radio",
					name:"bgColor",
					value: value,
					onclick: function(){
						query(".bgColor > input").forEach(function(input){input.checked = false});
						this.checked = true;
						var typeNode = query(".bgType > input:checked")[0];
						var typeObj = bgTypes[typeNode.value];
						var typeValue = typeObj[Object.keys(typeObj)];
						lang.hitch(self.scene,typeValue,this.value)();
					}
				},label);

				domConstruct.create("span",{innerHTML:this.nls[key]},label);
			}));
			this.__createEmptyLine(themeForm);

			this.__createLabel(themeForm,this.nls["wallpaper"]);
			var baseUrl = "/assets/desktop/resources/";
			var wallpapers = ["wallpaper1","wallpaper2","wallpaper3","wallpaper4"];
			var wallpaperStyles = ["centered","tiled","fillscreen"];
			var wallpaperOptsDiv = domConstruct.create("div",{class:"wallpaperOpts"},themeForm.domNode);

			array.forEach(wallpaperStyles,function(item,i){
				var label = domConstruct.create("label",{class:"wallpaperStyle"},wallpaperOptsDiv);
				var checkbox = domConstruct.create("input",{
					checked: i===0 ? true : false,
					name: "style",
					type: "checkbox",
					value: item,
					onclick: function(){
						query(".wallpaperStyle > input").forEach(function(input){input.checked = false});
						this.checked = true;
						var imageNode = query(".wallpaperImage > input:checked")[0];
						var image = imageNode ? baseUrl + imageNode.value + ".png" : "";
						self.scene.updateWallpaperImage(image,this.value);
					}
				},label);
				domConstruct.create("span",{innerHTML:item},label);
			});
			
			array.forEach(wallpapers,function(item,i){
				var label = domConstruct.create("label",{class:"wallpaperImage"},wallpaperOptsDiv);
				var imageDiv = domConstruct.create("div",{class:"prev" },label);
				domConstruct.create("img",{src:baseUrl+item + "-small.png",alt:item},imageDiv);
				// var radio = new RadioButton({
				var radio = domConstruct.create("input",{
					checked: i===0 ? true : false,
					type: "radio",
					name:"wallpaper",
					value: item,
					onclick: function(){
						query(".wallpaperImage > input").forEach(function(input){input.checked = false});
						this.checked = true;
						var styleNode = query(".wallpaperStyle > input:checked")[0];
						var style = styleNode ? styleNode.value : "fillscreen";
						var image = baseUrl + this.value + ".png";
						self.scene.updateWallpaperImage(image,style);
					}
				},label);

				// label.appendChild(radio.domNode);
				domConstruct.create("span",{innerHTML:item},label);
			});
			this.__createEmptyLine(themeForm);

			this.__createButton(themeForm,this.nls,"__ThemeCallBack");


			return themeForm;
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

		__createButton: function(/*node*/form,/*obj*/nls,/*function*/callBack){
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
			});
				// onClick: function(){
				// 	lang.hitch(self,callBack,form);
				// }
			form.domNode.appendChild(save.domNode);
			on(save,"click",lang.hitch(self,callBack,form));
		},

		__SceneCallBack: function(/*node*/form){
			var self = this;
			if(form.validate()){
				var value = form.get("value");
				var name = value.name;
				var type = value.type;
				var theme = value.theme;
				require([type],function(sceneClass) {
					// create new scene add to sceneContainer
					var scene = new sceneClass({name:name,theme:theme,desktop:self.scene.desktop});
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
					};
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
		},

		__AppCallBack: function(/*node*/form){
			if(form.validate()){
				var value = form.getValues();
				var name = value.name;
				var type = value.type;
				var theme = value.theme;
			}else{
				alert('Form contains invalid data.  Please correct first');
				return false;
			}
			return true;
		},

		__ThemeCallBack: function(/*node*/form){
			if(form.validate()){
				var value = form.getValues();
				var name = value.name;
				var type = value.type;
				var theme = value.theme;
			}else{
				alert('Form contains invalid data.  Please correct first');
				return false;
			}
			return true;
		}
	});

});
