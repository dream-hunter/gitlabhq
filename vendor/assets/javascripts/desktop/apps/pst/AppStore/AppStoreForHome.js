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
	"dijit/registry",
  "dijit/Dialog",
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
	"qface/system/tools/widgets/SlidesWidget",
	"./widgets/AppInfoWidget",
	"./widgets/AuthorInfoWidget",
	"./widgets/LoginDialog",
	"qface/system/desktop/scene/impl/singleap/Scene",
  "qface/Runtime",
	"dojo/i18n!./nls/AppStore",
	"./widgets/AppDescWidget",
	"./widgets/TopAppDescWidget",
	"./AppStore"
],function(on,JSON,domConstruct,declare,array,lang,connect,event,domStyle,domClass,query,hash,ioQuery,topic,Memory,_App,Window,
	ItemFileWriteStore,registry,Dialog,Tree,ForestStoreModel,BorderContainer,ContentPane,ToggleSplitter,qface,AutoRotator,RotatorSlide,RotatorController,
	txtConfig,SearchWidget,SortWidget,PaginateWidget,SlidesWidget,AppInfoWidget,AuthorInfoWidget,LoginDialog,Scene,qRun,nlsApp,AppDesc,TopAppDesc,AppStore){
	return declare([AppStore], {
		needHash: true,
		init: function(args){
      this.inherited(arguments);
      var self = this;
      topic.subscribe("appStore/runApp",function(appObj){
				runContainer = new Dialog({title:appObj.name,class:"runContainer",style:"width:80%;height:80%;"});
				var scene = this.scene = new Scene();
				scene.init({app:appObj});
				runContainer.containerNode.appendChild(scene.containerNode);
				runContainer.show();
				domStyle.set(runContainer.containerNode,{
					width:"100%",
					height:"580px",
					position:"absolute"
				});
				connect.connect(runContainer,"hide",function(){
					registry.byId(this.id).destroy();
				});
				// fix the bug which run again the window didn't show.
				if(scene.app){
					scene.app.win.shown = false;
					scene.app.win.show();
				}
				/*var path = "apps/"+appObj.sysname.replace(/[.]/g, "/");
				require([path],function(Application){
					var app  = new Application({scene:self.scene});
					app.init();
					runContainer.containerNode.appendChild(app.win.domNode);
					runContainer.show();
				});*/
			});
			this._someIntegrateCss();
		},

		_someIntegrateCss: function(){
			query(".win-bmw",this.win.domNode).addClass("integrateWinBmw");
			query(".win-mc",this.win.domNode).addClass("integrateWinMc");
		},

		_createBaseLayout: function(){
			var appLayout = this.appLayout = new BorderContainer({
				class:"storeMainContainer",
				region:"leading"
			});

			var topContainer = this.topContainer = new ContentPane({
				region:"top",
				class:"topContainer",
				style:"height:180px;width:1000px;overflow:hidden"
			});
			var descContainer = domConstruct.create("div",{
				class:"descContainer",
				innerHTML:"<p><span>UtilHub</span>是一个基于web组件的易分享、可版本控制的开放平台，开发者可以基于自己的想法独自或者从社区中组建“虚拟团队”，来快速的开发、组合组件，从而实现开源或私有的web应用程序。</p>"
			},topContainer.domNode);

			var leftContainer = this.treeContainer = new ContentPane({
				region:"left",
				class:"treeContainer",
				style:"width:230px;"
			});

			var centerContainer = this.appItemsContainer = new ContentPane({
				region:"center",
				class:"itemContanier",
				style:"width:750px;height:530px;"
			});

			var actionsDiv = domConstruct.create("div",{class:"actions"},centerContainer.domNode);
			var sortItem = this.sortItem = new SortWidget({
        options: [
          { label: "最新", value: "updated_at" },
          { label: "最热", value: "fav_count"},
          { label: "名称", value: "name", selected: true }
        ]
			});
			topic.publish("qface/sort",this,"_sortApp");
			actionsDiv.appendChild(sortItem.domNode);
			var searchItem = new SearchWidget({class: "search"});
			topic.publish("qface/search",this,"_searchApp");
			actionsDiv.appendChild(searchItem.domNode);
			// searchItem.startup();

			appLayout.addChild(topContainer);
			appLayout.addChild(leftContainer);
			appLayout.addChild(centerContainer);
			return appLayout;
		},

		_createSlidesContainer: function(){
			var panes = [];
			array.forEach(this.apps,lang.hitch(this,function(app,index){
				if(index <3){
					var appWidget = new TopAppDesc({app:app});
					colorClass = index % 2 === 0 ? "evenPane" : "oddPane";
					var pane = {className: "pane " + colorClass + " pane" + index, innerHTML: appWidget.domNode.innerHTML};
					panes.push(pane);
				}
			}));
			var slidesContainer = this.slidesContainer = new SlidesWidget({panes:panes,duration:5000});
			slidesContainer.init();
			this.topContainer.addChild(slidesContainer);
		},

    _windowAction: function(win){
			// win maximize
			win.expand();
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
				var appDesc = new AppDesc({app:app});
				appViewItems.push(appDesc);
			});
			var appPage = new PaginateWidget({baseData:appViewItems,baseClass:"pagination"});
			this.appItemsContainer.domNode.appendChild(appPage.domNode);
		},

		__addChildCssLink: function(){
			qRun.addDojoCss("apps/pst/AppStore/resources/stylesheets/AppDescWidget.css");
      qRun.addDojoCss("qface/system/tools/resources/stylesheets/baseWidgets.css");
      qRun.addDojoCss("res/qfacex/themes/soria/window.css");
      qRun.addDojoCss("res/qfacex/themes/soria/dijit/Toolbar.css");
      // qRun.addDojoCss("apps/pst/AppStore/resources/stylesheets/appForHome.css");
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

