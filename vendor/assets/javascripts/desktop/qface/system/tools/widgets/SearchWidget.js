define([
  "dojo/on",
  "dojo/dom-class",
  "dojo/_base/declare",
  "dojo/topic",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/_base/connect",
  "dojo/_base/event",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/i18n!../nls/widgets",
  "dojo/text!./templates/SearchWidget.html"
],function(on,domClass,declare,topic,domStyle,lang,connect,event,WidgetBase,TemplatedMixin,nls,template){
  return declare([WidgetBase, TemplatedMixin], {
    templateString: template,
    searchLabel:"",
    baseClass:"search",
    constructor: function(){
      this.searchLabel = nls["search"];
    },
    
    postCreate: function(args){
      var self = this;
      topic.subscribe("qface/search",function(obj,functionName){
        connect.connect(self.baseNode, "onsubmit", function(e){
          event.stop(e);
          lang.hitch(obj,functionName,self.searchValue.value)();
        });
        on(self.searchButton,"click",function(e){
          event.stop(e);
          lang.hitch(obj,functionName,self.searchValue.value)();
        });
      });
    }
  });
});