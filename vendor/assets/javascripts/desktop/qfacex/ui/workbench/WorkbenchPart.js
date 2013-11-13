define([
	"dojo/_base/declare",
	"dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin"
], function(declare,lang, WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin) {

	var WorkbenchClass;
	
	return declare(null, {
	
	
		constructor: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
			if (params.workbench) {
				this._workbench = params.workbench;
				delete params.workbench;
			}
	    	this.subscriptions=[];
	    	this.publishing = [];
		},

		getWorkbench : function() {
			var workbench = this._workbench;
		
			if (!workbench) {
				if (!WorkbenchClass) {
					 WorkbenchClass = require("qfacex/ui/workbench/Workbench");
				}
				var workbench;
				if (WorkbenchClass) {
					var workbench = this.getParent();
					while (workbench && !workbench.isInstanceOf(WorkbenchClass)) {
						workbench = workbench.getParent();	
					}
				}
				this._workbench = workbench;
			}
			return workbench;
		},
		
		subscribe: function(topic,func) {
			this.subscriptions.push(this._workbench.subscribe(topic,lang.hitch(this,func)));
		},

		publish: function (topic,data) {
			this.publishing[topic]=true;
			try {
				this._workbench.publish(topic,data);
			} catch(ex) {
				console.error("Error publishing topic: "+topic);
				console.error(ex.stack || ex);
			}
			delete this.publishing[topic];
		},	

		
		destroy: function(){
			dojo.forEach(this.subscriptions, dojo.unsubscribe);
			delete this.subscriptions;
		}


	});
});
