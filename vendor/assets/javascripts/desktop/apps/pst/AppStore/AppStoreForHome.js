define([
	"dojo/on",
	"dojo/json",
	"dojo/dom-construct",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/query",
	"dojo/hash",
	"dojo/io-query",
	"dojo/topic",
	"dojo/store/Memory",
	"qface/system/app/Application",
	"qfacex/widgets/window/Window",
	"dojo/data/ItemFileWriteStore",
	"dijit/Tree",
	"dijit/tree/ForestStoreModel",
	"qfacex/widgets/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojox/layout/ToggleSplitter",
	"qface/Runtime",
	"dojox/widget/AutoRotator",
	"dojox/widget/rotator/Slide",
	"dojox/widget/rotator/Controller",
	"dojo/text!config/config.json",
	"qface/system/tools/widgets/SearchWidget",
	"qface/system/tools/widgets/SortWidget",
	"qface/system/tools/widgets/PaginateWidget",
	"./widgets/AppInfoWidget",
	"./widgets/AuthorInfoWidget",
	"./widgets/LoginDialog",
	"qface/system/desktop/scene/impl/singleap/Scene",
	"dojo/i18n!./nls/AppStore",
	"./widgets/AppDescWidget",
	"./widgets/TopAppDescWidget",
	"./AppStore"
],function(on,JSON,domConstruct,declare,array,lang,connect,event,domStyle,domClass,query,hash,ioQuery,topic,Memory,_App,Window,
	ItemFileWriteStore,Tree,ForestStoreModel,BorderContainer,ContentPane,ToggleSplitter,qface,AutoRotator,RotatorSlide,RotatorController,
	txtConfig,SearchWidget,SortWidget,PaginateWidget,AppInfoWidget,AuthorInfoWidget,LoginDialog,Scene,nlsApp,AppDesc,TopAppDesc,AppStore){
	return declare([AppStore], {
		needHash: true,
		init: function(args){
      this.inherited(arguments);
		},

		_createBaseLayout: function(){
			var appLayout = this.appLayout = new BorderContainer({
				class:"storeMainContainer",
				region:"leading"
			});

			var topContainer = new ContentPane({
				region:"top",
				class:"topContainer",
				style:"height:180px;width:1000px;"
			});
			var descContainer = domConstruct.create("div",{class:"descContainer"},topContainer.domNode);
			var viewContainer = domConstruct.create("div",{class:"viewContainer"},topContainer.domNode);

			var leftContainer = this.treeContainer = new ContentPane({
				region:"left",
				class:"treeContainer",
				style:"width:230px;"
			});

			// this._getTopApps();

			var centerContainer = this.appItemsContainer = new ContentPane({
				region:"center",
				class:"itemContanier",
				style:"width:750px;height:530px;"
			});

			// var actionContainer = domConstruct.create("div",{class:"actionContainer"},centerContainer.domNode);
			var sortItem = this.sortItem = new SortWidget({
        options: [
          { label: "最新", value: "updated_at" },
          { label: "最热", value: "fav_count"},
          { label: "名称", value: "name", selected: true }
        ]
			});
			topic.publish("qface/sort",this,"_sortApp");
			centerContainer.addChild(sortItem);

			var searchItem = new SearchWidget({class: "search"});
			topic.publish("qface/search",this,"_searchApp");
			centerContainer.addChild(searchItem);
			searchItem.startup();

			appLayout.addChild(topContainer);
			appLayout.addChild(leftContainer);
			appLayout.addChild(centerContainer);
			return appLayout;
		},

		_getTopApps: function(){
			var paneDiv = domConstruct.create("div",{"class":"paneContainer"},this.viewItem.domNode);
			var panes = [];

			array.forEach(this.apps,function(app,index){
				var appWidget = new TopAppWidget(app);
				colorClass = index % 2 === 0 ? "evenPane" : "oddPane";
				panes.push({className: "pane " + colorClass + " pane" + index, innerHTML: appWidget.domNode.innerHTML});
			});
			// var autoItem = new RotatorSlide(
			var autoItem = new AutoRotator({
				transition: "dojox.widget.rotator.slideLeft",
				transitionParams: "quick:true,continuous:true",
				duration: 3500,
				panes: panes
			},paneDiv);
			domConstruct.create("a",{
				href:"javascript:void(0);",
				class:"prevPane",
				innerHTML:'<img src="openstar/apps/AppStore/resources/images/arrow-prev.png" width="24" height="43" alt="Arrow Prev">',
        onclick: function(){
					autoItem.prev();
        }
			}, paneDiv);

			domConstruct.create("a",{
				href:"javascript:void(0);",
				class:"nextPane",
        innerHTML:'<img src="openstar/apps/AppStore/resources/images/arrow-next.png" width="24" height="43" alt="Arrow Prev">',
        onclick: function(){
					autoItem.next();
        }
			}, paneDiv);
		},

    _windowAction: function(win){
			// win maximize
			win.full();
    },

		_createAppContainerPage: function(apps,sortValue){
			sortValue = sortValue || "name";
			store = new Memory({data: apps});
			apps = store.query({},{sort:[{attribute:sortValue,descending:false}]});
			query(".pagination",this.appItemsContainer.domNode).forEach(domConstruct.destroy);
			// domConstruct.empty(this.appItemsContainer.id);
			var self = this;
			var appViewItems = [];
			array.forEach(apps,function(app){
				var appDesc = new AppDesc(app);
				appViewItems.push(appDesc.domNode);
			});
			var appPage = new PaginateWidget({baseData:appViewItems,baseClass:"pagination"});
			this.appItemsContainer.domNode.appendChild(appPage.domNode);
		},

		__addChildCssLink: function(){
			this.__addCss("apps/pst/AppStore/resources/stylesheets/AppDescWidget.css");
      this.__addCss("qface/system/tools/resources/stylesheets/baseWidgets.css");
      // this.__addCss("apps/pst/AppStore/resources/stylesheets/appForHome.css");
		},

		__createBaseTree: function(treeModel){
			var self = this;
			return new Tree({
				model: treeModel,
				showRoot: false,
				style: "width:200px;",
				openOnClick: true,
				region: "left",
				onClick: function(item){
					self._selectTreeRootNode(item,apps);
					if(self.needHash) {
						self.__updateHash("cat",item.label[0]);
						self.__deleteHash("app");
						self.__deleteHash("q");
					}
				}
			});
		}
	});
});

