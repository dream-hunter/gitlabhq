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
	"dojo/i18n!./nls/AppStore",
	"dijit/layout/ContentPane",
	"dojox/widget/AutoRotator",
	"dojox/widget/rotator/Fade",
	"qfacex/widgets/layout/BorderContainer",
	"./widgets/TopAppWidget",
	"./AppStore"
],function(on,JSON,domConstruct,declare,array,lang,connect,event,domStyle,domClass,query,hash,ioQuery,topic,nlsApp,
	ContentPane,AutoRotator,RotatorFade,BorderContainer,TopAppWidget,AppStore){
	return declare([AppStore], {
		needHash: true,
		init: function(args){
      this.inherited(arguments);
		},

		_createBaseLayout: function(){
			var appLayout = this.appLayout = new BorderContainer({
				class:"storeMainContainer",
				style:"width:99%;height:97%;",
				region:"leading"
			});
			var centerContainer = new BorderContainer({
				region:"center",
				class:"centerContainer",
			});
			var centerTopItem = this.viewItem = new ContentPane({
				region:"top",
				class:"centerTop",
				style:"width:100%;height:240px;background:#ccc"
			});
			this._getTopApps();

			var contentContainer = this.appListItem = new ContentPane({
				class:"centerContent",
				region:"center",
				height:"400px",
				style:"height:400px;background:gray;"
			});
			var leftContainer = this.appItem = new BorderContainer({
				region:"left",
				class:"leftContainer",
				style:"width:200px;background:green"
			});
			centerContainer.addChild(centerTopItem);
			centerContainer.addChild(contentContainer);
			appLayout.addChild(leftContainer);
			appLayout.addChild(centerContainer);
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

		_addChildCssLink: function(){
			this.__addCss("apps/pst/AppStore/resources/stylesheets/AppWidget.css");
      this.__addCss("apps/pst/AppStore/resources/stylesheets/appForHome.css");
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
					domConstruct.empty(self.descItem.id);
					domConstruct.empty(self.runItem.id);
				}
			});
		}
	});
});

