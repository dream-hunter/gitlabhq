define([
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.extend lang.isArray
	"dojo/i18n", // i18n.getLocalization
	"dojo/topic",
	"qface/system/app/Application",
	"qfacex/widgets/window/Window",
	"dojo/i18n!./nls/addScene",
	"./widgets/FormWidget"
],function(array,declare,lang,i18nA,topic,_App,Window,nlsApp,FormWidget) {
	return declare([_App], {
		init: function(){
			var app = nlsApp;
			var win = this.win = new Window({
	      app: this,
				title: app.title,
				width: "300px",
				height: "270px",
				iconClass: "icon-16-apps-accessories-calculator",
				onClose: lang.hitch(this, "kill")
			});
			var form = new FormWidget();
			win.addChild(form);
			win.show();
			win.startup();

			// subscribed by FormWidget
			topic.publish("qface/system/tools/addScene",{win:win});
		},
		
		kill: function(){
			if(!this.win.closed) this.win.close();
		}
	});

});
