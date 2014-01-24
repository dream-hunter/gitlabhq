define([
  "dojo/dom",
  "dojo/on",
  "dojo/request",
  "dojo/html",
  "dojo/dom-construct",
  "dojo/dom-attr",
  "dojo/_base/array",
  'dojo/_base/json',
  "dojo/_base/lang",
  "dojo/_base/declare",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/query",
  "dojo/aspect",
  "dojo/store/Memory",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/i18n!../nls/widgets",
  "qface/system/tools/FontAwesome",
  "dojo/text!./templates/paginateWidget.html"
],function(dom,on,request,html,domConstruct,domAttr,array,dJson,lang,declare,domStyle,domClass,query,aspect,Memory,WidgetBase,TemplatedMixin,
  _WidgetsInTemplateMixin,nls,FontAwesome,template){

  return declare([WidgetBase, TemplatedMixin,_WidgetsInTemplateMixin], {
    templateString: template,
    baseData: [],
    needEvenClass: false, // add odd or even class for each item
    perPage: 6,
    pgCursor: 4, // when to change page nav num
    pgLeftShowCt: 3, // the count of left pages
    pgRightShowCt: 3, // the count of right pages
    pgShowCt: 7, // the size of nav bar page item
    pageSize: 0, //
    firstPgNum: 1,
    lastPgNum: 7,
    currentPgNum: 1,
    pages: [],
    showPages: [],
    pageANodes: {},
    baseClass: "pagination",

    constructor: function(){
    },

    postCreate: function(){
      this._getPageItems();
      this._createPageCnt(this.pages[0]);
      this._createPageNavCnt();
      this.inherited(arguments);
    },

    _createPageCnt: function(/*array*/ pageItems){
      // first empty page items container
      // domConstruct.empty(this.pageCnt);
      this.pageCnt.innerHTML = "";
      // var pageItems = lang.clone(pageObjs);
      // add page content to this container
      array.forEach(pageItems,lang.hitch(this,function(item){
        if(item.domNode){
          // lang.hitch(item,"_actions")();
          item = item.domNode;
        }
        this.pageCnt.appendChild(item);
      }));
    },

    _createPageNavCnt: function(){
      if(this.pageSize <= this.currentPgNum) return;
      var self = this;
      // previous page
      domConstruct.create("a",{
        class:"prevPg pg " + FontAwesome["prev"],
        id:"prevPg",
        href:"javascript:void(0);",
        title: nls["previousPage"],
        style:"display:none",
        onclick: function(){
          if(self.currentPgNum > 1){
            var numPlaceObj = self.__getShowPagesBeginAndEndNum(self.currentPgNum - 1);
            self.__modifyShowPg(numPlaceObj["beginPgNum"],numPlaceObj["endPgNum"],self.currentPgNum - 1);
          }
          if(self.currentPgNum == 1) domStyle.set(this,"display","none");
          domStyle.set(dom.byId("nextPg"),"display","inline-block");
        }
      },self.pageNavCnt);

      self._createFirstPage();

      self._createPageNavItem();

      self._createLastPage();

      // next page
      domConstruct.create("a",{
        class:"nextPg pg " + FontAwesome["next"],
        id:"nextPg",
        title: nls["nextPage"],
        href:"javascript:void(0);",
        onclick: function(){
          if(self.currentPgNum < self.pageSize){
            var numPlaceObj = self.__getShowPagesBeginAndEndNum(self.currentPgNum + 1);
            self.__modifyShowPg(numPlaceObj["beginPgNum"],numPlaceObj["endPgNum"],self.currentPgNum + 1);
          }
          if(self.currentPgNum == self.pageSize) domStyle.set(this,"display","none");
          domStyle.set(dom.byId("prevPg"),"display","inline-block");
        }
      },self.pageNavCnt);
    },

    _createFirstPage: function(){
      // firstPage
      var self = this;
      var firstPgDiv = domConstruct.create("div",{style:"display:none","class":"firstPg"},self.pageNavCnt);
      domConstruct.create("a",{
        id:"firstPg",
        class:"pg",
        innerHTML: 1,
        href:"javascript:void(0);",
        onclick: function(){
          self.__modifyShowPg(1,self.pgShowCt,1);
          // show last page div
          if(self.pageSize > self.pgShowCt)
            query(".lastPg").set("display","inline-block");
        }
      },firstPgDiv);
      domConstruct.create("span",{"class":"otherPg",innerHTML:"..."},firstPgDiv);
    },

    _createLastPage: function(){
      // lastPage
      var self = this;
      var lastPgDiv = domConstruct.create("div",{style:"display:inline-block","class":"lastPg"},self.pageNavCnt);
      domConstruct.create("span",{"class":"otherPg",innerHTML:"..."},lastPgDiv);
      domConstruct.create("a",{
        id:"lastPg",
        "class":"pg",
        innerHTML: self.pageSize,
        href:"javascript:void(0);",
        onclick: function(){
          var beginPgNum = self.pageSize - self.pgShowCt + 1;
          if(beginPgNum < 1) beginPgNum = 1;
          self.__modifyShowPg(beginPgNum,self.pageSize,self.pageSize);
          domStyle.set(dom.byId("lastPg"),"display","none");
          if(self.pageSize > self.pgShowCt)
            query(".firstPg").style("display","inline-block");
        }
      },lastPgDiv);
      if(self.pageSize <= self.pgShowCt) domStyle.set(lastPgDiv,"display","none");
    },

    _createPageNavItem: function(){
      var self = this,className,aShowStyle;
      // loop and create each page's nav div
      for(var i=1; i<=self.pageSize;i++){
        if(i<=self.pgShowCt){
          // first load page, show those pages [1..pgShowCt]
          className = i === 1 ? "cntPg pg" : "pg";
          aShowStyle = "display:inline-block";
          className += " showPg";
        } else{
          // hidden the other pages
          className = "pg";
          aShowStyle = "display:none";
        }
        // add this item to pageAnodes[]
        self.pageANodes[i] = domConstruct.create("a",{
          class: className,
          id:"pg" + i,
          innerHTML: i,
          style:aShowStyle,
          href:"javascript:void(0);",
          onclick: function(){
            // remve class cntPg add this class to current node
            query(".cntPg",self.pageNavCnt).removeClass("cntPg");
            domClass.add(this,"cntPg");
            var pgNum = parseInt(this.text);

            var numPlaceObj = self.__getShowPagesBeginAndEndNum(pgNum);
            self.__modifyShowPg(numPlaceObj["beginPgNum"],numPlaceObj["endPgNum"],pgNum);
          }
        },self.pageNavCnt);
      }
    },

    // split data to pages
    _getPageItems: function(){
      var pageData = this.baseData;
      var pages = this.pages = [];
      var length = pageData.length;
      var leaveCount = length % this.perPage; // the last page's item size
      var pageSize = this.pageSize = Math.ceil(length / this.perPage);
      array.forEach(pageData,lang.hitch(this,function(data,index){
        // this is a page (index start from 0)
        if((index +1) % this.perPage === 0 ){
          var siglePg = [];
          // each item push in to new array singlePg
          for(i=0;i<this.perPage;i++){
            // the index is last item's num in this page
            siglePg.push(pageData[index-i]);
          }
          pages.push(siglePg);
        }
      }));

      // when data split with per_page,there have remaining items,
      // so put those items in a new page
      if(leaveCount > 0){
        var lastPage = [];
        for(var i = (pageSize-1) * this.perPage; i < length; i++){
          lastPage.push(pageData[i]);
        }
        pages.push(lastPage);
      }
    },

    __getShowPagesBeginAndEndNum: function(currentPgNum){
      var self = this;
      var pgHalfShowCt = (self.pgShowCt - 1) / 2;
      var beginPgNum = currentPgNum - pgHalfShowCt;
      if(beginPgNum < 1) beginPgNum = 1;
      var endPgNum = currentPgNum + pgHalfShowCt;
      if(endPgNum > self.pageSize) endPgNum = self.pageSize;
      return {beginPgNum:beginPgNum,endPgNum:endPgNum};
    },

    __modifyShowPg: function(/*integer*/ beginPgNum,/*integer*/ endPgNum, /*integer*/ currentPgNum){
      // remove all current page class
      query(".cntPg",this.pageNavCnt).removeClass("cntPg");
      // add current page to this
      domClass.add(dom.byId("pg" + currentPgNum),"cntPg");

      // find old show pages and hidden them,
      // then remve the class of showPg from those pages
      query(".showPg",this.pageNavCnt).forEach(function(aNode){
        var pgId = "pg" + parseInt(aNode.text);
        domStyle.set(dom.byId(pgId),"display","none");
        domClass.remove(pgId,"showPg");
      });

      // show new pages and set class of showPg for those pages
      for(i=beginPgNum;i<=endPgNum;i++){
        var pgId = "pg" + i;
        domClass.add(pgId,"showPg");
        domStyle.set(dom.byId(pgId),"display","inline-block");
      }

      // go to current page and set current page value
      this.currentPgNum = currentPgNum;
      this.goToPage(currentPgNum);

      if(beginPgNum > 2){
        query(".firstPg").style("display","inline-block");
        query(".firstPg > span").style("display","inline-block");
      } else if (beginPgNum === 2){
        query(".firstPg").style("display","inline-block");
        query(".firstPg > span").style("display","none");
      } else {
        query(".firstPg").style("display","none");
      }

      if(endPgNum < this.pageSize-1){
        query(".lastPg").style("display","inline-block");
        query(".lastPg > span").style("display","inline-block");
      } else if(endPgNum === this.pageSize-1){
        query(".lastPg").style("display","inline-block");
        query(".lastPg > span").style("display","none");
      } else {
        query(".lastPg").style("display","none");
      }
    },

    // array start from 0 so need to subtract 2
    nextPage: function(){
      var page = this.pages[currentPgNum - 2];
      this._createPageCnt(page);
    },

    previousPage: function(){
      var page = this.pages[currentPgNum];
      this._createPageCnt(page);
    },

    goToPage: function(pageNum){
      var page = this.pages[pageNum-1];
      this._createPageCnt(page);
    }
  });
});
