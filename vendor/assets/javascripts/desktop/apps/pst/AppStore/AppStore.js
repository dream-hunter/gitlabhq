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
	"dijit/form/Select",
	"dojo/data/ItemFileWriteStore",
	"dijit/Tree",
	"dijit/tree/ForestStoreModel",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"qfacex/widgets/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer",
	"dijit/layout/AccordionPane",
	"dijit/layout/TabContainer",
	"dojox/layout/ToggleSplitter",
	"qface/Runtime",
	"dojox/widget/AutoRotator",
	"dojox/widget/rotator/Slide",
	"dojox/widget/rotator/Controller",
	"dojo/text!config/config.json",
	"./widgets/SearchWidget",
	"./widgets/PaginateWidget",
	"./widgets/AppInfoWidget",
	"./widgets/AuthorInfoWidget",
	"./widgets/LoginDialog",
	"qface/system/desktop/scene/impl/singleap/Scene",
	"dojo/i18n!./nls/AppStore"
	],function(on,JSON,domConstruct,declare,array,lang,connect,event,domStyle,domClass,query,hash,ioQuery,topic,Memory,_App,
		Window,Select,ItemFileWriteStore,Tree,ForestStoreModel,Button,Form,TextBox,BorderContainer,ContentPane,AccordionContainer,
		AccordionPane,TabContainer,ToggleSplitter,qface,AutoRotator,RotatorSlide,RotatorController,txtConfig,SearchWidget,
		PaginateWidget,AppInfoWidget,AuthorInfoWidget,LoginDialog,Scene,nlsApp){
	
	return declare(_App, {
		apps: [],
		filterApps: [],
		hasSearch: true,
		hasViewer: true,
		hasLogin: true,
		hasLogo:true,
		hasPagination: true,
		hasCategory: true,
		lastItemName:null, // check if this app tree item visited,if so do noting.

		init: function(args){
			var appNls = this.appNls = nlsApp;
			var win = this.win = new Window({
	      app  : this,
				title: "app store",
				width: "200px",
				height: "270px",
				iconClass: "icon-16-apps-accessories-calculator",
				onClose: lang.hitch(this, "kill")
			});

			var appLayout = this.appLayout = new BorderContainer({region:"center",class:"storeMainContainer",style:"width:99%;height:97%;",region:"center"});

			/////////
			// left
			/////////

			var leftContainer = this.appItem = new BorderContainer({region:"leading",class:"leftContainer",style:"width:200px;",splitter:"true"});

			/////////
			// center
			/////////
			var centerContainer = new BorderContainer({region:"center", class:"centerContainer",splitter:"true"});

			var centerTopItem = new ContentPane({
				region:"top",
				class:"centerTop",
				style:"width:100%;height:40px;"
			});
			var sortItem = this.sortItem = new Select({
        name: "sort",
        class: "sort",
        style:"width:60px;",
        options: [
            { label: "最新", value: "updated_at" },
            { label: "最热", value: "fav_count"},
            { label: "名称", value: "name", selected: true }
        ]
  		});

  		var self = this;
			this.sortItem.on("change",function(){self._sortApp(this.get("value"));});
			domConstruct.create("span",{innerHTML:"sort:",class:"sortLabel"},centerTopItem.domNode);
			centerTopItem.addChild(sortItem);

			var searchItem = new SearchWidget({
				mainObj: this,
				class: "search"
			});
			topic.publish("qface/search",this,"_searchApp");
			centerTopItem.addChild(searchItem);

			centerContainer.addChild(centerTopItem);

			var contentContainer = this.appListItem = new ContentPane({
				class:"centerContent",
				region:"center",
				height:"400px",
				splitter:"true"
			});

			centerContainer.addChild(contentContainer);

			/////////
  	  // right
      /////////
			
			var rightContainer = new BorderContainer({class:"rightContainer", region:"trailing",style:"width:480px;",splitter:"true"});
			var descItem = this.descItem = new ContentPane({
				region:"top",
				style:"height:268px;",
				class: "desc",
				title:"user info",
				splitter:"true"
			});
			var runItem = this.runItem = new ContentPane({
				region:"center",
				class: "run",
				splitter:"true"
			});
			rightContainer.addChild(descItem);
			rightContainer.addChild(runItem);

			appLayout.addChild(leftContainer);
			appLayout.addChild(centerContainer);
			appLayout.addChild(rightContainer);

			win.addChild(appLayout);
			win.show();
			win.startup();
			
			topic.subscribe("appStore/showForHome",function(fName){
				lang.hitch(win,fName);
			});

			this.__addCss("apps/pst/AppStore/resources/stylesheets/AppWidget.css");
			this.__addCss("apps/pst/AppStore/resources/stylesheets/app.css"); 
			this.__addCss("apps/pst/AppStore/resources/stylesheets/paginateWidget.css"); 

			this._readyForTreeData();
			this.addHashEvent();
		},

		kill: function(){
			if(!this.win.closed){
				this.win.close();
			}
		},

    addHashEvent: function(){
			topic.subscribe("/dojo/hashchange", lang.hitch(this,"__hashCallback"));
			this.__hashCallback();
    },

   	_readyForTreeData: function(configFile){
			config = JSON.parse(txtConfig);
			apps = this.apps = config.scenes["icons"].apps;
			var appType = ["app","theme","applet"];
			var self = this;
			var categoryList = ["全部"];
			var formatData = [];
			array.forEach(apps,function(app){
				categoryList.push(app.category);
			});
			var categoryUniqList = this.categoryUniqList = this.__uniqueArray(categoryList);

			array.forEach(appType, function(name, index){
    		var oData = {};
    		oData.label = name;
    		oData.id =  index + 1;
    		oData.type =  'folder';
    		oData.icon = 'category';
    		oData.folders = [];
    		if(name =="app"){
		    	array.forEach(categoryUniqList, function(category, sindex){
						oItem = {};
						oItem.id = (index + 1) * 1000 + sindex;
						oItem.label = category;
						oItem.iconClass = "icon-16-categories-applications-"+category.toLowerCase();
						oItem.icon = "icon-16-categories-applications-"+category.toLowerCase();
						oData.folders.push(oItem);
					});
    		}
				formatData.push(oData);
			});

			var treeData = {
				id: 0,
				identifier: 'id',
				label: 'label',
				items: formatData
			};
			
			var treeStore = this.treeStore = new ItemFileWriteStore({data: treeData});
			var treeModel = new ForestStoreModel({
				store: treeStore,
				region:"leading",
				query: {type:'folder'},
				labelAttr:"label" ,
				label:"application",
				childrenAttrs: ["folders"]
			});

			var appTree = new Tree({
				model: treeModel,
				showRoot: false,
				region:"leading",
				openOnClick: true,
				onClick: function(item){
					self._selectTreeRootNode(item,apps);
					self.__updateHash("cat",item.label[0]);
					self.__deleteHash("app");
					self.__deleteHash("q");

					domConstruct.empty(self.descItem.id);
					domConstruct.empty(self.runItem.id);

				},
				getIconClass: function(item,opened){
					if(!item.root){
						if(!item.folders){
							return item.iconClass;
						} else {
							switch(item.label[0]){
								case 'app':{
									return "icon-16-categories-applications-other";
									break;
								}
								case 'theme':{
									return "icon-16-apps-preferences-desktop-theme";
									break;
								}
								case "applet":{
									return "icon-16-apps-preferences-desktop-theme";
									break;
								}
							}
						}
					}
				}
			});

			this.appItem.addChild(appTree);
			this._createAppContainerPage(apps);

		},

		_selectTreeRootNode: function(item,apps){
			var label = this.treeStore.getValue(item,"label"); 
			if(!label) return;
			// disable double click
			if(this.lastItemName === label) return;
			this.lastItemName = label;
  		this.filterApps = label === "全部" ? apps : array.filter(apps,function(app){return app.category === label});				
  		this._createAppContainerPage(this.filterApps);
		},

		_selectTreeRootNodeByLabel: function(label,apps){
			this.filterApps = label === "全部" ? apps : array.filter(apps,function(app){return app.category === label});				
      this._createAppContainerPage(this.filterApps);
		},

		// method for searchWidget
		_searchApp: function(appName){
			this.__updateHash("q",appName);
			var filterApps = this.filterApps.length === 0 ? this.apps : this.filterApps;
      this.filterApps = array.filter(filterApps,function(app){return app.name === appName});
			this._createAppContainerPage(this.filterApps);
		},

		_sortApp: function(sortValue){
			this.__updateHash("sort",sortValue);
			this.__deleteHash("app");
			this.filterApps = this.filterApps.length === 0 ? this.apps : this.filterApps;
			this._createAppContainerPage(this.filterApps,sortValue);
		},

		_createAppContainerPage: function(apps,sortValue){
			sortValue = sortValue || "name";
			store = new Memory({data: apps}); 
			apps = store.query({},{sort:[{attribute:sortValue,descending:false}]});
			domConstruct.empty(this.appListItem.id);
			var self = this;
			var appViewItems = [];
			// var olNode = domConstruct.create("ol",{},this.appListItem.domNode);
			array.forEach(apps,function(app){
				// var liNode = domConstruct.create("li",{});
				var aNode = domConstruct.create("a",{
					title:app.name,
					href:"javascript:void(0);",
					onclick: function(){
						self.__updateHash("app",app.name);
						// descItem
						self.__createDescContent(app);
						
						// runItem
						self.__createRunContent(app);
					}
				});
				var imageUrl = self.__getAppImage(app);
				var image = domConstruct.create("img",{src:imageUrl},aNode);
				var title = domConstruct.create("span",{innerHTML:app.name,class:"appTitle"},aNode);
				
				appViewItems.push(aNode);
			});
			var appPage = new PaginateWidget({baseData:appViewItems});
			this.appListItem.domNode.appendChild(appPage.domNode);

		},

		__addCss: function(path){
			var cssUrl =  require.toUrl(path);
			var element = document.createElement("link");
			element.rel = "stylesheet";
			element.type = "text/css";
			element.media = "screen";
			element.href = cssUrl;
			document.getElementsByTagName("head")[0].appendChild(element);
		},

		__uniqueArray: function(/*Array*/ arrayList){
			var check = {};
			var result = [];
			array.forEach(arrayList,function(item,index){
				if(!check[item]){
					check[item] = true;
					result.push(item);
				}
			});
			return result;
		},

		__setHash: function(obj){
			hash(ioQuery.objectToQuery(obj));
		},

		__updateHash: function(key,value){
			// var value = hash() === "" ? "sort=name" : hash();
			var obj = ioQuery.queryToObject(hash());
			obj[key] = value;
        hash(decodeURIComponent(ioQuery.objectToQuery(obj)));
		},

		__deleteHash: function(key){
			var obj = ioQuery.queryToObject(hash());
			delete(obj[key]);
      hash(decodeURIComponent(ioQuery.objectToQuery(obj)));
		},

		__hashCallback: function(){
			// var hashValue = hash() === "" ? "sort=name" : hash();
			var obj = ioQuery.queryToObject(hash());
      if(obj.cat){
      	this._selectTreeRootNodeByLabel(obj.cat,this.apps); 
      }

      if(obj.sort){
				this.sortItem.set('value',obj.sort);
				var filterApps = this.filterApps.length === 0 ? this.apps : this.filterApps;
	      this._createAppContainerPage(filterApps,obj.sort);
	    } else{
      	if(!obj.cat && !obj.app){
          this._createAppContainerPage(this.apps);
      	}
      }
      if(obj.app){
      	var apps = array.filter(this.apps,function(app){return app.name === obj.app});
      	if(apps){
        	this.__createDescContent(apps[0]);
        	this.__createRunContent(apps[0]);
        	if(!obj.cat && !obj.sort){
      			this._createAppContainerPage(this.apps);
        	}
      	}
      } else {
      	domConstruct.empty(this.descItem.id);
				domConstruct.empty(this.runItem.id);
      }
		},

		__createDescContent: function(app){
			var self = this;
			domConstruct.empty(this.descItem.id);

			var descCnts = {appInfo:this.appNls.project,authorInfo:this.appNls.author,
			versionsInfo:this.appNls.versions,utilsInfo:this.appNls.utils};

			var nav = domConstruct.create("nav",{class:"navInfo"},this.descItem.domNode);
			var ul = domConstruct.create("ul",{class:"infoUl"},nav);
			for(var i = 0,keys=Object.keys(descCnts),length = keys.length; i<length; i++){
				(function(j){
					var actionName = keys[j];
					var li = domConstruct.create("li",{},ul);
		    	var a = domConstruct.create("a",{
		    		href:"javascript:void(0);",
		    		innerHTML:descCnts[actionName],
		    		onclick: function(){
							query(".itemActive",ul).forEach(function(item){domClass.remove(item,"itemActive")});
							domClass.add(this,"itemActive");
							query(".itemCntActive",self.descItem.domNode).forEach(function(item){domClass.remove(item,"itemCntActive")});
							domClass.add(self[actionName].domNode,"itemCntActive");						
		    		}
		    	},li);
		    	if(i==0){
		    		domClass.add(a,"itemActive");
		    	}
	    	})(i)
		    if(i < length - 1){
		    	domConstruct.create("li",{class:"divider"},ul);
		    }
    	}

    	app.appClass = app.category;
			var appInfo = this.appInfo = new AppInfoWidget(app);
			this.descItem.addChild(appInfo);
			app.likeCount = 200;
			var authorInfo = this.authorInfo = new AuthorInfoWidget(app);
			this.descItem.addChild(authorInfo);
			app.likeCount = 300;
			var versionsInfo = this.versionsInfo = new AppInfoWidget(app);
			this.descItem.addChild(versionsInfo);
			app.likeCount = 400;
			var utilsInfo = this.utilsInfo = new AppInfoWidget(app);
			this.descItem.addChild(utilsInfo);
			domClass.add(appInfo.domNode,"itemCntActive");
		},

		__createRunContent: function(app){
			domConstruct.empty(this.runItem.id);
			var scene = new Scene();
			this.runItem.addChild(scene);
			scene.init({app:app});
		},

		__getAppImage: function(app){
			var matcher = app.icon.match(/icon-32-apps-(.*)/);
          	// var theme = this.appStore.scene.get("theme");
          	var theme = "Soria"
     		var iconUrl = matcher == null ? "/assets/desktop/resources/qfacex/images/default.png" : ("/assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png");
			return iconUrl;
		}

	});
});

