define([
  "dojo/on",
  "dojo/mouse",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/dom-construct",
  "dojo/_base/declare",
  "dojo/_base/array",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/dom-style",
  "dojo/_base/fx",
  "dojo/_base/lang",
  "./AppDescWidget"
  ],function(on,mouse,domClass,domStyle,domConstruct,declare,array,WidgetBase,TemplatedMixin,domStyle,baseFx,
    lang,AppDescWidget){
    return declare(AppDescWidget, {
      baseClass:"topDescAppWidget",
      hasName: true,
      hasAuthor: false,
      hasAction: false,
      hasIcon: true,
      postCreate: function(){
        // domStyle.set(this.detailsNode,"display","none");
        domStyle.set(this.authorNode,"display","none");
        this.inherited(arguments);
      }
    });
  });
