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
  "dojo/text!./templates/appInfo.html",
  "dojo/i18n!../nls/AppStore",
  "dojo/dom-style",
  "dojo/_base/fx",
  "dojo/_base/lang",
  "qface/Runtime"
  ],function(on,mouse,domClass,query,domConstruct,declare,array,WidgetBase,TemplatedMixin,Dialog,MultiSelect,Button,
    template,nlsAppStore,domStyle,baseFx,lang,qface){
    return declare([WidgetBase, TemplatedMixin], {
      nls:"",
      name: "",
      icon: "",
      appId:"",
      likeCount:100,
      getCount:200,
      description: "",
      defaultIcon:"/assets/desktop/resources/qfacex/images/default.png",
      version:"",
      createdAt: new Date(),
      updatedAt: new Date(),
      templateString: template,
      baseClass: "appInfoWidget",
      width: "500px",
      height: "10px",
      display:"none",
      constructor: function(){
        this.nls = nlsAppStore;
        this.description = "Web applications absolutely require compatible web browsers. If a browser vendor decides not to implement a certain feature";
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
      },

      _setLikeCount: function(likeCount){
        this._set("likeCount",likeCount);
        this.likeCountNode.innerHTML = likeCount;
      },

      _setGetCount: function(getCount){
        this._set("getCount",getCount);
        this.getCountNode.innerHTML = getCount;
      },

      _setHeight: function(height){
        this._set("height",height);
        // this.domNode.style.height = height;
      },

      _setWidthAttr: function(width){
        this._set("width",width);
        // this.domNode.style.width = width;

      },

      _selectDialog: function(){
        var dialog = new Dialog();
        var title = domConstruct.create("h3",{innerHTML:"select witch scene to add this app"},dialog.containerNode);
        var select = new MultiSelect({name: "scene"});

        var options = [
          { label: "MultiApp", value: "explore_multiapp"},
          { label: "MultiTab", value: "explore_multitab"},
          { label: "SingleApp", value: "explore_singleApp"},
          { label: "icons", value: "icons" }
        ];
        array.forEach(options,function(option){
          domConstruct.create("option",{label:option.label,value:option.value},select.domNode);
        });
        var buttonDiv = domConstruct.create("div",{style:"text-align:right;padding: 0 10px 10px;"});
        var okButton = new Button({
          type:"submit",
          label:"submit",
          onClick: lang.hitch(this,function(){
            array.forEach(select.get('value'),lang.hitch(this,function(sceneName){
              var scene = this.appStore.scene.desktop.findScene(sceneName);
              srvConfig = scene.addApp(this,srvConfig); // use srvConfig connect qface framework
            }));
          })
        });

        var cancelButton = new Button({
          type:"button",
          label:"キャンセル",
          onClick: lang.hitch(this,function(){
            dialog.hide();
          })
        });

        dialog.addChild(select);
        buttonDiv.appendChild(okButton.domNode);
        buttonDiv.appendChild(cancelButton.domNode);
        // domConstruct.place(dialog.containerNode, loadingDiv, "first");
        dialog.containerNode.appendChild(buttonDiv);
        dialog.show();
      }
    });
  });