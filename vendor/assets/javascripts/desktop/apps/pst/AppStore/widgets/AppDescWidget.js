define([
  "dojo/on",
  "dojo/json",
  "dojo/mouse",
  "dojo/topic",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/_base/event",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/form/MultiSelect",
  "dijit/form/Button",
  "dojo/text!./templates/AppDescWidget.html",
  "dojo/i18n!../nls/AppStore",
  "dojo/dom-style",
  "dojo/_base/fx",
  "dojo/_base/lang",
  "qface/Runtime",
  "qface/system/tools/FontAwesome"
  ],function(on,json,mouse,topic,domClass,domConstruct,declare,array,event,WidgetBase,TemplatedMixin,MultiSelect,Button,
    template,nlsAppStore,domStyle,baseFx,lang,qface,FontAwesome){
    return declare([WidgetBase, TemplatedMixin], {
      app:null,// Object
      appIcon:"", // default app icon
      author:"lihongwang",
      authorAvatar:"/uploads/user/avatar/51/IMG_0137.JPG",
      authorLink:"",
      fav_count:100,
      download_count:100,
      view_count:200,
      created_at: new Date(),
      updated_at: new Date(),
      description: "",
      defaultDescription: "this is a default description\r\na good app\r\ndo you like it?\r\nxxxxx",
      templateString: template,
      baseClass: "appDesc",

      postCreate: function(){
        var self = this;
        var actionList = ["get","like","share"];
        array.forEach(actionList,function(action){
          var aNode = domConstruct.create("a",{
            class:"actionBtn action" + self.__capitaliseFirstLetter(action),
            href:"javascript:void(0);",
            title:nlsAppStore[action],
            onclick: function(){
              if(action == "get"){

              }
              this.lastChild.innerHTML = parseInt(this.lastChild.innerHTML,10) + 1;
            }
          },self.actionNode);
          var iconSpan = domConstruct.create("i",{class:"actionIcon " + FontAwesome[action]},aNode);
          var textSpan = domConstruct.create("i",{class:"actionText",innerHTML:200},aNode);
        });
        domConstruct.create("i",{class:"runIcon " + FontAwesome["run2"]},this.runNode);
        this.runNode.title = nlsAppStore["run"];
        this._actions();
        this.inherited(arguments);
      },

      _actions: function(){
        var self = this;
        on(this.domNode,mouse.enter,function(){
          domStyle.set(self.actionNode,"opacity","1.0");
        });

        on(this.domNode,mouse.leave,function(){
          domStyle.set(self.actionNode,"opacity",".0");
        });

        /*on(this.domNode,"click",function(){
          self.__runApp(self.runNode);
        });*/

        on(this.runNode,mouse.enter,function(e){
          domStyle.set(self.actionNode,"opacity",".0");
        });

        on(this.runNode,mouse.leave,function(e){
          domStyle.set(self.actionNode,"opacity",".0");
        });

        on(this.runNode,"click",function(){
          self.__runApp(this);
        });
      },

      __runApp: function(obj){
        topic.publish("appStore/runApp",this.app);
      },

      _setAppAttr: function(app){
        this.__formatIcon(app.icon);
      },

      __formatIcon:function(icon){
        if(icon !== null){
          var matcher = icon.match(/icon-32-apps-(.*)/);
          // var theme = this.appStore.scene.get("theme");
          var theme = "Soria";
          if(matcher !== null){
            this.appIcon = "assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png";
          }
        }
        this.iconNode.firstChild.src = this.appIcon;
      },

      __capitaliseFirstLetter: function(s){
        return s.charAt(0).toUpperCase() + s.slice(1);
      },
      /*_setAppClassAttr: function(className){
        this._set("appClass", className);
        domClass.add(this.domNode,className);
      },

      _setHeight: function(height){
        this._set("height",height);
        // this.domNode.style.height = height;
      },

      _setWidthAttr: function(width){
        this._set("width",width);
        // this.domNode.style.width = width;

      },

      _chooseBaseNode: function(){
        if(this.hasName) domStyle.set(this.nameNode,"display","block");
        if(this.hasAuthor) domStyle.set(this.authorNode,"display","block");
        if(this.hasAction) domStyle.set(this.actionNode,"display","block");
        if(this.hasTime) domStyle.set(this.timeNode,"display","block");
        if(this.hasIcon) domStyle.set(this.appIconNode,"display","block");
        if(this.hasDescription) domStyle.set(this.descriptionNode,"display","block");
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
      }*/
    });
  });
