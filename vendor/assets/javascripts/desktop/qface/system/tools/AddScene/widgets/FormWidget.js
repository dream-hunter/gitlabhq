 define([
 	"dojo/_base/declare",
 	"dojo/_base/lang",
 	"dojo/_base/array",
 	"dojo/dom-class",
 	"dojo/dom-style",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-geometry",
	"dojo/_base/fx", // fx.Animation
	"dojo/_base/html",
	"dojo/on",
	"dojo/dnd/Source",
	"dojo/has",
	"dojo/topic",
	"dijit/form/Form",
	"dijit/form/Select",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/form.html",
	"dojo/i18n!../nls/addScene"
	], function(declare,lang,array,domClass,domStyle,domConstruct,domGeom,dojoFx,domHtml,on,dndSource,has,topic,Form,Select,_TemplatedMixin,
		_WidgetsInTemplateMixin,template,nlsScene){
	return declare([Form,_TemplatedMixin,_WidgetsInTemplateMixin],{
		templateString:template,

		postCreate: function(){

			domConstruct.create("label",{innerHTML:"Type"},this.sceneType);
			var typeSelect = this.typeSelect = new Select({name: "sceneType",
				options: [
				{ label: "MultiApp", value: "qface/system/desktop/scene/impl/explorer/MultiAppScene"},
				{ label: "MultiTab", value: "qface/system/desktop/scene/impl/explorer/MultiTabScene"},
				{ label: "SingleApp", value: "qface/system/desktop/scene/impl/explorer/SingleAppScene"},
				{ label: "icons", value: "qface/system/desktop/scene/impl/icons/Scene" }
				]
			}).placeAt(this.sceneType);
			var themeSelect = this.themeSelect = new Select({name: "sceneTheme",
				options: [
				{ label: "soria", value: "soria"},
				{ label: "tsunami", value: "tsunami"},
				{ label: "tundra", value: "tundra"},
				{ label: "mobile", value: "mobile" }
				]
			}).placeAt(this.sceneTheme);

			//  	new Button({
			//  		label:nlsScene.cancel,
			//  		onClick: lang.hitch(this,function(){
			//  			// this.dialog.hide();
			//  		})
			//  	}).placeAt(this.submitNode);
			//  	new Button({
			//  		label:nlsScene.save,
			//  		onClick: function(){
			// 			var name = self.sceneName.value;
			// 			var type = self.select.get("value");
			// 			require([type],function(sceneClass) {
			// 				var scene = new sceneClass({name:name,desktop:self.sceneObj.desktop});
			// 				self.sceneObj.addScene(name,scene)
			// 				// self.dialog.hide();
			// 			});	
			//  		}
			//  	}).placeAt(this.submitNode);
 			topic.subscribe("qface/system/tools/addScene",lang.hitch(this,function(args){
 				var params = ["sceneNaviBar","desktop","win"];
 				array.forEach(params,lang.hitch(this,function(item){
 					if(args[item]) this[item] = args[item];
 				}));
			}));
			on(this.saveButton,"click",lang.hitch(this,function(){

			}));
		},

		onSubmit: function(){
			if(this.validate()){
				var self = this;
				var name = self.sceneName.getValue();
				var type = self.typeSelect.getValue();
				var theme = self.themeSelect.getValue();
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
					scene.init(config);
					self.sceneNaviBar.addScene(name,scene);
					// close the add window
					self.win.close();

					// jump to new scene

				});
			}else{
				alert('Form contains invalid data.  Please correct first');
				return false;
			}
			return true;
		},
		onCancel: function(){
		}
	});
});