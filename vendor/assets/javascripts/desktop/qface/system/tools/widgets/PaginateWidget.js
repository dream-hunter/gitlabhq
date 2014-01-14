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
  "dojo/text!./templates/paginateWidget.html"
],function(dom,on,request,html,domConstruct,domAttr,array,dJson,lang,declare,domStyle,domClass,query,aspect,Memory,WidgetBase,TemplatedMixin,
  _WidgetsInTemplateMixin,nls,template){

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
      domConstruct.empty(this.pageCnt);
      // add page content to this container
      array.forEach(pageItems,lang.hitch(this,function(item){
        this.pageCnt.appendChild(item);
      }));
      /*var ul = domConstruct.create("ul",{},this.pageCnt);
      array.forEach(pageItems,lang.hitch(this,function(item,index){
        var li = domConstruct.create("li",{class: "pageItem"},ul);
        if(this.needEvenClass){
          var colorClass = index % 2 === 0 ? "even" : "odd";
          domClass.add(li,colorClass);
        }
        li.appendChild(item);
      }));*/
    },

    _createPageNavCnt: function(){
      if(this.pageSize <= this.currentPgNum) return;
      var self = this;
      // previous page
      domConstruct.create("a",{
        class:"prevPg pg",
        id:"prevPg",
        href:"javascript:void(0);",
        innerHTML: nls["previousPage"],
        style:"display:none",
        onclick: function(){
          if(self.currentPgNum > 1){
            var numPlaceObj = self.__getShowPagesBeginAndEndNum(self.currentPgNum - 1);
            self.__modifyShowPg(numPlaceObj["beginPgNum"],numPlaceObj["endPgNum"],self.currentPgNum - 1);
          }
        }
      },self.pageNavCnt);

      self._createFirstPage();

      self._createPageNavItem();

      self._createLastPage();

      // next page
      domConstruct.create("a",{
        class:"nextPg pg",
        id:"nextPg",
        innerHTML: nls["nextPage"],
        href:"javascript:void(0);",
        onclick: function(){
          if(self.currentPgNum < self.pageSize){
            var numPlaceObj = self.__getShowPagesBeginAndEndNum(self.currentPgNum + 1);
            self.__modifyShowPg(numPlaceObj["beginPgNum"],numPlaceObj["endPgNum"],self.currentPgNum + 1);
          }
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
            self.goToPage(pgNum);
            self.currentPgNum = pgNum;

            var prevShowStyle = pgNum === 1 ? "none" : "inline";
            domStyle.set(dom.byId("prevPg"),"display",prevShowStyle);

            var nextShowStyle = pgNum === self.pageSize ? "none" : "inline";
            domStyle.set(dom.byId("nextPg"),"display",nextShowStyle);

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

    __addPaginationAfterEvent: function(currentPg){
      var self = this;
      query(".showPg",self.pageNavCnt).forEach(function(aNode,index){
        var pgNum = parseInt(aNode.text);
        // init first page num and page cursor num
        if(index === 0){
          self.firstPgNum = pgNum;
          self.pgCursor = pgNum + self.pgLeftShowCt;
          self.lastPgNum = self.firstPgNum + self.pgShowCt - 1;
        }
      });

      // click cursor after node
      if(currentPg > self.pgCursor){
        var afterLastPgNum = self.pgRightShowCt + currentPg; // 2 + 4 = 6
        if(afterLastPgNum >= self.pageSize) afterLastPgNum = self.pageSize;
        //show first page
        if(self.pgShowCt < self.pageSize)
          query(".firstPg",self.pageNavCnt).style("display","inline-block");
        //show last page
        if(afterLastPgNum < self.pageSize){ //eg: 8 - 2 = 6; 4,5 show
          query(".lastPg",self.pageNavCnt).style("display","inline-block");
        }else{
          query(".lastPg",self.pageNavCnt).style("display","none");
        }
        // show after pages
        for(i=self.pgCursor+self.pgRightShowCt + 1; i<=afterLastPgNum;i++){ // 3 + 2 + 1 begin in 6
          var pgId = "pg" + i;
          domClass.add(pgId,"showPg");
          domStyle.set(dom.byId(pgId),"display","inline-block");
        }
        // hidden before pages
        var beforeFirstPgNum = afterLastPgNum - self.pgShowCt; // 7-5 =2
        for(i=1; i<=beforeFirstPgNum;i++){ // hidden 1 page
          var pgId = "pg" + i;
          domClass.remove(pgId,"showPg");
          domStyle.set(dom.byId(pgId),"display","none");
        }
      } else {
        // show last page
        if(self.pgShowCt < self.pageSize)
          query(".lastPg",self.pageNavCnt).style("display","inline-block");
        if(self.firstPgNum > 1){
          // hidden after pages
          var afterLastPgNum = currentPg + self.pgRightShowCt + 1;
          for(i=afterLastPgNum; i<=self.lastPgNum; i++){
            var pgId = "pg" + i;
            domClass.remove(pgId,"showPg");
            domStyle.set(dom.byId(pgId),"display","none");
          }

          // show before pages
          var beforeFirstPgNum = currentPg - self.pgLeftShowCt;
          // show first page
          if(beforeFirstPgNum > 1)
            query(".firstPg",self.pageNavCnt).style("display","inline-block");
          else
            query(".firstPg",self.pageNavCnt).style("display","none");

          for(i=beforeFirstPgNum; i<self.firstPgNum; i++){
            var pgId = "pg" + i;
            domClass.add(pgId,"showPg");
            domStyle.set(dom.byId(pgId),"display","inline-block");
          }
        } else {
          query(".firstPg",self.pageNavCnt).style("display","none");
        }
      }
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
