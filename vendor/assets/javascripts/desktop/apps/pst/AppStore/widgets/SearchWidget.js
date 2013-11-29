define([
  "dojo/on",
  "dojo/dom-class",
  "dojo/_base/declare",
  "dojo/topic",
  "dojo/dom-style", 
  "dojo/_base/lang",
  "dijit/_WidgetBase", 
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/SearchWidget.html"
  ],function(on,domClass,declare,topic, domStyle,lang,WidgetBase, TemplatedMixin, template){
    return declare([WidgetBase, TemplatedMixin], {
      templateString: template,
      width:"",
      height:"",
      postCreate: function(args){
        var self = this;
        topic.subscribe("qface/search",function(obj,functionName){
          on(self.searchButton,"click",function(){
            lang.hitch(obj,functionName,self.searchValue.value)();
          });
        })
      }
    })
  })