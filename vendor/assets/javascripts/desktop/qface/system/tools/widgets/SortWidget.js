define([
  "dojo/on",
  "dojo/dom-class",
  "dojo/_base/declare",
  "dojo/topic",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dijit/form/Select",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/i18n!../nls/widgets",
  "dojo/text!./templates/SortWidget.html"
],function(on,domClass,declare,topic, domStyle,lang,Select,WidgetBase,TemplatedMixin,nls,template){
  return declare([WidgetBase, TemplatedMixin], {
    templateString: template,
    sortLabel:"",
    baseClass:"sort",
    constructor: function(){
      this.sortLabel = nls["sort"];
    },
    
    postCreate: function(args){
      var select = this.select = new Select({
        options:this.options
      });
      this.selectNode.appendChild(select.domNode);
      var self = this;
      topic.subscribe("qface/sort",function(obj,functionName){
        on(self.select,"change",function(){
          lang.hitch(obj,functionName,self.select.get("value"))();
        });
      });
      this.inherited(arguments);
    },

    _setOptionsAttr: function(/*Array*/ options){
      this._isLoaded = false;
      this._set('options', options);
    }
  });
});