define([
  "dojo/on",
  "dojo/mouse",
  "dojo/dom-class",
  "dojo/query",
  "dojo/dom-construct",
  "dojo/_base/declare",
  "dojo/_base/array",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/Dialog",
  "dijit/form/MultiSelect",
  "dijit/form/Button",
  "dojo/text!./templates/authorInfo.html",
  "dojo/i18n!../nls/AppStore",
  "dojo/dom-style", 
  "dojo/_base/fx",
  "dojo/_base/lang",
  "qface/Runtime"
  ],function(on,mouse,domClass,query,domConstruct,declare,array,WidgetBase,TemplatedMixin,Dialog,MultiSelect,Button,
    template,nlsAppStore,domStyle,baseFx,lang,qface){
    return declare([WidgetBase, TemplatedMixin], {
      nls:"",
      isyou: "这是您本人！",
      icon: "",
      appId:"",
      joinTime:"2014-1-1",
      authorName:"Uncle Zheng",
      projectCount:"0",
      followerCount:"0",
      followingCount:"0",
      description: "",
      defaultIcon:"/assets/desktop/resources/qfacex/images/default.png",
      templateString: template,
      baseClass: "authorInfoWidget",
      width: "500px",
      height: "10px",
      display:"none",
      constructor: function(){
        this.nls = nlsAppStore;
        this.description = "This is the one who is talent!"
      },

      postCreate: function(){
        this.hidden();
      },

      show: function(){
        domStyle.set(this.baseNode,"display","block");
      },

      hidden: function(){
        domStyle.set(this.baseNode,"display","none");
      },

       _setJoinTime: function(joinTime){
        this._set("joinTime",joinTime);
      },

      _setIconAttr: function(icon) {
        var iconUrl;
        if(icon === null){
          iconUrl = this.defaultIcon;
        } else{
          var matcher = icon.match(/icon-32-apps-(.*)/);
          // var theme = this.appStore.scene.get("theme");
          var theme = "Soria";
          iconUrl = matcher === null ? this.defaultIcon : ("assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png");
        }
          this.iconNode.src = iconUrl;
      }
      
    });
  });