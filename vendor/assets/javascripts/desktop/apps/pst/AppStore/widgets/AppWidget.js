define([
  "dojo/on",
  "dojo/mouse",
  "dojo/dom-class",
  "dojo/query",
  "dojo/dom-construct",
  "dojo/_base/declare",
  "dojo/_base/array",
  "dojo/dom-style", 
  "dojo/_base/fx", 
  "dojo/_base/lang",
  "qface/Runtime"
  "./AppInfoWidget"
  ],function(on,mouse,domClass,query,domConstruct,declare,array,domStyle,baseFx,lang,qface){
    return declare([WidgetBase, TemplatedMixin], {
      appStore:null,
      name: "No Name",
      appIcon: "",
      icon: "",
      app_id:"",
      author:"",
      fav_count:100,
      download_count:100,
      view_count:200,
      created_at: new Date(),
      updated_at: new Date(),
      description: "",
      defaultDescription: "this is a default description\r\na good app\r\ndo you like it?\r\nxxxxx",
      templateString: template,
      baseClass: "appWidget",
      mouseAnim: null,
      appClass: null,
      width: "500px",
      height: "10px",
      baseBackgroundColor: "#fff",
      mouseBackgroundColor: "#def",
      hasName: true,
      hasAuthor: true,
      hasAction: true,
      hasTime: true,
      hasIcon: true,
      hasDescription: true,
      postCreate: function(){
        // var domNode = this.domNode;
        var self = this;
        var navArr=["navItemProject","navItemAuthor","navItemVersion","navItemUtil"];
        var navDivArr=["navDivItemProject","navDivItemAuthor"];

        navArr.forEach(function(item){
          on(self[item],"click",function(){
            navArr.forEach(function(subItem){
              self[subItem].parentNode.className="";
            });

            self[item].parentNode.className="active";

            navDivArr.forEach(function(item){
                self[item].style.display="none";
            });

            var getIndex=function(){
              for(var j=0;j<navArr.length;j++){
                if(item==navArr[j]){
                  return j;
                }
              }
              return 0;
            }
            var i=getIndex();

            if(i<navDivArr.length){
                self[navDivArr[i]].style.display="block";
            }

          });
        });
        
        // on(self.NAVitems,"click",function(){
        //   query(".cf li").forEach(function(item){   
        //     domClass.remove(item,"active");
        //   }); 
        //   domClass.add(this,"active");
        // });

        // on(self.NAVauthors,"click",function(){
        //   query(".cf li").forEach(function(item){   
        //     domClass.remove(item,"active");
        //   }); 

        //   domClass.add(this,"active");
        // });

        // var actionList = ["add"];
        // // var actionList = [nlsAppStore.like,nlsAppStore.view,nlsAppStore.download];
        // var ulNode = domConstruct.create("ul",{},this.actionNode);
        // array.forEach(actionList,function(action){
        //   var liNode = domConstruct.create("li",{},ulNode);
        //   var aNode = domConstruct.create("a",{
        //     href:"javascript:void(0);",
        //     innerHTML:nlsAppStore[action],
        //     onclick: function(){
        //       self._selectDialog();
        //       // _SceneBase.addApp();
        //     }
        //   },liNode);
        // });
        // this._chooseBaseNode();
        // this.inherited(arguments);
        // on(this.visionNode,"click",function(){

        // })
      }//,

    //   _setIconAttr: function(icon) {
    //     if(icon == null){
    //       iconUrl = this.appIcon;
    //     } else{
    //       var matcher = icon.match(/icon-32-apps-(.*)/);
    //       // postCreate: function(){
    //     // var domNode = this.domNode;
    //     var self = this;
    //     var actionList = ["add"];
    //     // var actionList = [nlsAppStore.like,nlsAppStore.view,nlsAppStore.download];
    //     var ulNode = domConstruct.create("ul",{},this.actionNode);
    //     array.forEach(actionList,function(action){
    //       var liNode = domConstruct.create("li",{},ulNode);
    //       var aNode = domConstruct.create("a",{
    //         href:"javascript:void(0);",
    //         innerHTML:nlsAppStore[action],
    //         onclick: function(){
    //           self._selectDialog();
    //           // _SceneBase.addApp();
    //         }
    //       },liNode);
    //     });
    //     this._chooseBaseNode();
    //     this.inherited(arguments);
    //     on(this.visionNode,"click",function(){
            
    //     })
    //   },

    //   _setIconAttr: function(icon) {
    //     if(icon == null){
    //       iconUrl = this.appIcon;
    //     } else{
    //       var matcher = icon.match(/icon-32-apps-(.*)/);
    //       // var theme = this.appStore.scene.get("theme");
    //       var theme = "Soria"
    //       iconUrl = matcher == null ? this.appIcon : ("assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png");
    //     }
    //     if (icon != "") {
    //       this.appIconNode.lastChild.src = iconUrl;
    //     }
    //   },

    //   _setAppClassAttr: function(className){
    //     this._set("appClass", className);
    //     domClass.add(this.domNode,className);
    //   },

    //   _setHeight: function(height){
    //     this._set("height",height);
    //     // this.domNode.style.height = height;
    //   },

    //   _setWidthAttr: function(width){
    //     this._set("width",width);
    //     // this.domNode.style.width = width;

    //   },

    //   _chooseBaseNode: function(){
    //     if(this.hasName) domStyle.set(this.nameNode,"display","block");
    //     if(this.hasAuthor) domStyle.set(this.authorNode,"display","block");
    //     if(this.hasAction) domStyle.set(this.actionNode,"display","block");
    //     if(this.hasTime) domStyle.set(this.timeNode,"display","block");
    //     if(this.hasIcon) domStyle.set(this.appIconNode,"display","block");
    //     if(this.hasDescription) domStyle.set(this.descriptionNode,"display","block");
    //   },

    //   _selectDialog: function(){
    //     var dialog = new Dialog();
    //     var title = domConstruct.create("h3",{innerHTML:"select witch scene to add this app"},dialog.containerNode);
    //     var select = new MultiSelect({name: "scene"});

    //     var options = [
    //       { label: "MultiApp", value: "explore_multiapp"},
    //       { label: "MultiTab", value: "explore_multitab"},
    //       { label: "SingleApp", value: "explore_singleApp"},
    //       { label: "icons", value: "icons" }
    //     ];
    //     array.forEach(options,function(option){
    //       domConstruct.create("option",{label:option.label,value:option.value},select.domNode);
    //     });
    //     var buttonDiv = domConstruct.create("div",{style:"text-align:right;padding: 0 10px 10px;"});
    //     var okButton = new Button({
    //       type:"submit",
    //       label:"submit",
    //       onClick: lang.hitch(this,function(){
    //         array.forEach(select.get('value'),lang.hitch(this,function(sceneName){
    //           var scene = this.appStore.scene.desktop.findScene(sceneName);
    //           srvConfig = scene.addApp(this,srvConfig); // use srvConfig connect qface framework
    //         }));
    //       })
    //     });

    //     var cancelButton = new Button({
    //       type:"button",
    //       label:"キャンセル",
    //       onClick: lang.hitch(this,function(){
    //         dialog.hide();
    //       })
    //     });

    //     dialog.addChild(select);
    //     buttonDiv.appendChild(okButton.domNode);
    //     buttonDiv.appendChild(cancelButton.domNode);
    //     // domConstruct.place(dialog.containerNode, loadingDiv, "first");
    //     dialog.containerNode.appendChild(buttonDiv);
    //     dialog.show();
    //   }
    // });var theme = this.appStore.scene.get("theme");
    //       var theme = "Soria"
    //       iconUrl = matcher == null ? this.appIcon : ("assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png");
    //     }
    //     if (icon != "") {
    //       this.appIconNode.lastChild.src = iconUrl;
    //     }
    //   },

    //   _setAppClassAttr: function(className){
    //     this._set("appClass", className);
    //     domClass.add(this.domNode,className);
    //   },

    //   _setHeight: function(height){
    //     this._set("height",height);
    //     // this.domNode.style.height = height;
    //   },

    //   _setWidthAttr: function(width){
    //     this._set("width",width);
    //     // this.domNode.style.width = width;

    //   },

    //   _chooseBaseNode: function(){
    //     if(this.hasName) domStyle.set(this.nameNode,"display","block");
    //     if(this.hasAuthor) domStyle.set(this.authorNode,"display","block");
    //     if(this.hasAction) domStyle.set(this.actionNode,"display","block");
    //     if(this.hasTime) domStyle.set(this.timeNode,"display","block");
    //     if(this.hasIcon) domStyle.set(this.appIconNode,"display","block");
    //     if(this.hasDescription) domStyle.set(this.descriptionNode,"display","block");
    //   },

    //   _selectDialog: function(){
    //     var dialog = new Dialog();
    //     var title = domConstruct.create("h3",{innerHTML:"select witch scene to add this app"},dialog.containerNode);
    //     var select = new MultiSelect({name: "scene"});

    //     var options = [
    //       { label: "MultiApp", value: "explore_multiapp"},
    //       { label: "MultiTab", value: "explore_multitab"},
    //       { label: "SingleApp", value: "explore_singleApp"},
    //       { label: "icons", value: "icons" }
    //     ];
    //     array.forEach(options,function(option){
    //       domConstruct.create("option",{label:option.label,value:option.value},select.domNode);
    //     });
    //     var buttonDiv = domConstruct.create("div",{style:"text-align:right;padding: 0 10px 10px;"});
    //     var okButton = new Button({
    //       type:"submit",
    //       label:"submit",
    //       onClick: lang.hitch(this,function(){
    //         array.forEach(select.get('value'),lang.hitch(this,function(sceneName){
    //           var scene = this.appStore.scene.desktop.findScene(sceneName);
    //           srvConfig = scene.addApp(this,srvConfig); // use srvConfig connect qface framework
    //         }));
    //       })
    //     });

    //     var cancelButton = new Button({
    //       type:"button",
    //       label:"キャンセル",
    //       onClick: lang.hitch(this,function(){
    //         dialog.hide();
    //       })
    //     });

    //     dialog.addChild(select);
    //     buttonDiv.appendChild(okButton.domNode);
    //     buttonDiv.appendChild(cancelButton.domNode);
    //     // domConstruct.place(dialog.containerNode, loadingDiv, "first");
    //     dialog.containerNode.appendChild(buttonDiv);
    //     dialog.show();
    //   }
    });
  });