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
      var slidesContainer = this.slidesContainer = new AutoRotator({
        transition: "dojox.widget.rotator.fade",
        duration: this.duration,
        panes:this.panes
      },this.slidesNode);
      this._createThumbCnt();

      on(this.prevNode,"click",lang.hitch(this,function(){
        connect.disconnect(self.rotatorGoHandle);
        // this.rotatorGoHandle.remove();
        slidesContainer.prev();
        var index = this.slidesContainer.idx - 1 >= 0 ? this.slidesContainer.idx - 1 : this.panes.length - 1;
        this.__selectThumb(index);
        this._aspectRotatorGo();
      }));

      on(this.nextNode,"click",lang.hitch(this,function(){
        connect.disconnect(self.rotatorGoHandle);
        // this.rotatorGoHandle.remove();
        slidesContainer.next();
        var index = this.panes.length - this.slidesContainer.idx > 1 ?　this.slidesContainer.idx + 1 : 0;
        this.__selectThumb(index);
        this._aspectRotatorGo();
      }));
      this._aspectRotatorGo();
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
              // .remove();
              topic.publish(self.slidesContainer.id + "/rotator/control",'go',j);
              self.__selectThumb(j);
              self._aspectRotatorGo();
            }
          },ul);
        })(i);
      }
    },

    _aspectRotatorGo: function(){
      // onAfterIn
      this.rotatorGoHandle  = connect.connect(this.slidesContainer,"go",lang.hitch(this,function(){
        var index;
        index = this.panes.length - this.slidesContainer.idx > 1 ?　this.slidesContainer.idx + 1 : 0;
        this.__selectThumb(index);
      }));
    },

    __selectThumb: function(index){
      query(".thumbItem",this.thumbsNode).replaceClass(FontAwesome["pageCircleO"],FontAwesome["pageCircle"]);
      query(".item" + index,this.thumbsNode).replaceClass(FontAwesome["pageCircle"],FontAwesome["pageCircleO"]);
    },

    addPane: function(objPane){
      var html = objPane.domNode ? objPane.domNode.innerHTML : objPane.innerHTML;
      var pane = {className: "pane", innerHTML: html};
      this.slidesContainer.panes.push(pane);
    },

    createPane: function(obj){
      var pane = domConstruct.create("div",{class:"pane"});
      if(obj.imageUrl) domConstruct.create("img",{class:"paneImage",src:obj.imageUrl},pane);
      if(obj.textCnt) domConstruct.create("span",{class:"paneText",innerHTML:obj.textCnt},pane);
      if(obj.actionList){
        var actionNode = domConstruct.create("div",{class:"actions"},pane);
        array.forEach(obj.actionList,function(/*object*/ action){
          var key = Object.keys(action)[0];
          var value = action[key];
          domConstruct.create("i",{class:"actionItem " + value,innerHTML:key},actionNode);
        });
      }
      this.addPane(pane);
    }
  });
});
