/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: lihongwang
 * @Date: 2013/11/28
 */
define([
	"dojo/_base/lang", 
	"dojo/_base/declare", 
	"dojo/_base/array",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom",
	"dojo/topic",
	"dojox/widget/FisheyeList",
	"dojox/widget/FisheyeListItem",
	"qface/utils/html",
	"./Taskbar"
],function(lang,declare,array,domStyle,domClass,domConstruct,dom,topic,FisheyeList,FisheyeListItem,utilHtml,Taskbar) {
	return declare([Taskbar],{
		postCreate: function(){
			domClass.add(this.containerNode,"sceneTaskbarApplet");

			var itemContainer = this.itemContainer = new FisheyeList({
				itemWidth:32,
				itemHeight:32,
				itemMaxWidth:60,
				itemMaxHeight:60,
				orientation:"horizontal",
				effectUnits:2,
				itemPadding:10,
				attachEdge:"center",
				labelEdge:"top"
			});
			this.addChild(itemContainer);
		},

		onNew: function(item){
			var store = this.scene._windowList;
			var itemNode = new FisheyeListItem({
				id:"fisheye" + store.getValue(item,"id"),
				label:store.getValue(item,"label"),
				iconSrc:this.__getAppImage(store.getValue(item, "icon"))
			});
			this.itemContainer.addChild(itemNode);
			itemNode.startup();
			this.itemContainer.startup();


			if(store.getValue(item, "id").indexOf("load") == -1){
		    this._winconnects[store.getValue(item, "id")] = dojo.connect(itemNode.domNode, "onclick", dijit.byId(store.getValue(item, "id")), "_onTaskClick");
	    }
			
			this._buttons[store.getValue(item, "id")] = itemNode.domNode;
			this._labels[store.getValue(item, "id")] = itemNode.lblNode;
			if(this.config.fx > 0){
				// domStyle.set(itemNode.domNode, "opacity", 0);
				dojo.fadeIn({node: itemNode.domNode, duration: this.config.window.animSpeed}).play();
			}
	    
		},
		__getAppImage: function(iconClass){
			var matcher = iconClass.match(/icon-16-apps-(.*)/);
    	var theme = "Soria"
   		var iconUrl = matcher == null ? "/assets/desktop/resources/qfacex/images/default.png" : ("/assets/desktop/resources/qfacex/themes/" + theme + "/icons/32x32/apps/" + matcher[1] + ".png");
			return iconUrl;
		}

	})

})