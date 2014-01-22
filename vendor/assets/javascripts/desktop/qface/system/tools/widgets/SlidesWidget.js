define([
  "dojo/on",
  "dojo/query",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/_base/declare",
  "dojo/topic",
  "dojo/aspect",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/_base/connect",
  "dojo/_base/event",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojox/widget/AutoRotator",
  "dojox/widget/rotator/Slide",
  "dojox/widget/rotator/Controller",
  "dojox/widget/rotator/Fade",
  "qface/system/tools/FontAwesome",
  "dojo/text!./templates/slidesWidget.html"
],function(on,query,domConstruct,domClass,declare,topic,aspect,domStyle,lang,connect,event,WidgetBase,TemplatedMixin,AutoRotator,
  Slide,RotatorController,RotatorFade,FontAwesome,template){
  return declare([WidgetBase, TemplatedMixin], {
    panes:[],
    rotatorGoHandle:null,
    templateString: template,
    duration: 2500,
    baseClass:"slidesContainer",

    postCreate: function(){
      domClass.add(this.prevNode,FontAwesome["prev3"]);
      domClass.add(this.nextNode,FontAwesome["next3"]);
      this._createThumbCnt();
    },

    init: function(){
      this._createSlides();
      on(this.prevNode,"click",lang.hitch(this,function(){
        connect.disconnect(this.rotatorGoHandle);
        this.slidesContainer.prev();
        var index = this.slidesContainer.idx - 1 >= 0 ? this.slidesContainer.idx - 1 : this.panes.length - 1;
        this.__selectThumb(index);
        this._aspectRotatorGo();
      }));

      on(this.nextNode,"click",lang.hitch(this,function(){
        connect.disconnect(this.rotatorGoHandle);
        this.slidesContainer.next();
        var index = this.panes.length - this.slidesContainer.idx > 1 ?　this.slidesContainer.idx + 1 : 0;
        this.__selectThumb(index);
        this._aspectRotatorGo();
      }));
      this._aspectRotatorGo();
    },

    addPane: function(paneObj){
      var html = paneObj.domNode ? paneObj.domNode.innerHTML : paneObj.innerHTML;
      var pane = {className: "pane", innerHTML: html};
      this.panes.push(pane);
    },

    createPane: function(paneObjs){
      var pane = domConstruct.create("div",{class:"pane"});
      if(paneObjs.imageUrl) domConstruct.create("img",{class:"paneImage",src:paneObjs.imageUrl},pane);
      if(paneObjs.textCnt) domConstruct.create("span",{class:"paneText",innerHTML:paneObjs.textCnt},pane);
      if(paneObjs.actionList){
        var actionNode = domConstruct.create("div",{class:"actions"},pane);
        array.forEach(paneObjs.actionList,function(/*object*/ action){
          var key = Object.keys(action)[0];
          var value = action[key];
          domConstruct.create("i",{class:"actionItem " + value,innerHTML:key},actionNode);
        });
      }
      this.addPane(pane);
    },

    _createSlides: function(){
      this.slidesContainer = new AutoRotator({
        transition: "dojox.widget.rotator.fade",
        duration: this.duration,
        panes:this.panes
      },this.slidesNode);
    },

    _createThumbCnt: function(){
      var self = this;
      var ul = domConstruct.create("ul",{class:"thumbCnt"},this.thumbsNode);
      for(var i=0, length=this.panes.length;i<length;i++){
        (function(j){
          var currentClass = j === 0 ? FontAwesome["pageCircle"] : FontAwesome["pageCircleO"];
          var li = domConstruct.create("li",{
            class:"thumbItem item" + j + " " + currentClass,
            onclick: function(){
              connect.disconnect(self.rotatorGoHandle);
              topic.publish(self.slidesContainer.id + "/rotator/control",'go',j);
              self.__selectThumb(j);
              self._aspectRotatorGo();
            }
          },ul);
        })(i);
      }
    },

    _aspectRotatorGo: function(){
      this.rotatorGoHandle  = connect.connect(this.slidesContainer,"go",lang.hitch(this,function(){
        var index;
        index = this.panes.length - this.slidesContainer.idx > 1 ?　this.slidesContainer.idx + 1 : 0;
        this.__selectThumb(index);
      }));
    },

    __selectThumb: function(index){
      query(".thumbItem",this.thumbsNode).replaceClass(FontAwesome["pageCircleO"],FontAwesome["pageCircle"]);
      query(".item" + index,this.thumbsNode).replaceClass(FontAwesome["pageCircle"],FontAwesome["pageCircleO"]);
    }
  });
});
