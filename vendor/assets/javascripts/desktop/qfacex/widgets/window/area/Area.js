/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-geometry",
	"dojo/_base/html",
	"dojo/dom-construct", // domConstruct.create
	"dojo/dom-style",
  "dojo/query",
  "dijit",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_Container"
],function(declare,lang,domGeometry,html,domConstruct,domStyle,query,dijit,_Widget,_TemplatedMixin,_Container) {
	return declare([_Widget, _TemplatedMixin, _Container], {
		//	summary:
		//		the main UI area of the scene. This is where panels, wallpaper, and most other things are drawn.
		templateString:"<div class=\"uiArea\">\n\t<div data-dojo-attach-point=\"widgetNode\" class=\"uiArea uiAreaWidget\"></div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"uiArea uiAreaContainer\" style=\"overflow:hidden;\"></div>\n\t<div data-dojo-attach-point=\"wallpaperNode\" class=\"uiArea wallpaper\"></div>\n</div>\n",
		drawn: false,
		getBox: function(){
			var box =  domGeometry.getContentBox(this.domNode);
			return box;
		},

		resize: function(e){
			var max = this.getBox();
			query("div.win", this.containerNode).forEach(function(win){
				var wid = dijit.byNode(win);
				//if(wid.maximized) wid._onResize(); //TODO will be modified
				wid._onResize();
			}, this);
		},

		updateWallpaper: function(wallpaper){
			//	summary:
			//		Updates the wallpaper based on what's in scene.config. Called when the configuration is applied.
			// dojo.moduleUrl("res.qfacex.themes."+theme, e+".css");
			var image = dojo.moduleUrl(wallpaper.image);
			var matcher = image.match(/(.*)(\/(png|jpg|gif)\/$)/);
			image = matcher[1] + "." + matcher[3];
			this.updateWallpaperBgColor(wallpaper.color);
			this.updateWallpaperImage(image,wallpaper.style);
		},

		updateWallpaperBgColor: function(color){
			domStyle.set(this.wallpaperNode, "backgroundColor", color);
		},

		updateWallpaperImage: function(/*string*/image,/*string*/style){
			if(image === ""){
				if(this.wallpaperImageNode){
					this.wallpaperImageNode.parentNode.removeChild(this.wallpaperImageNode);
					this.wallpaperImageNode = false;
				}
				domStyle.set(this.wallpaperNode, "backgroundImage", "none");
				return;
			}
			if(style == "centered" || style == "tiled"){
				domStyle.set(this.wallpaperNode, "background", "url('"+image+"')");
				if(this.wallpaperImageNode){
					this.wallpaperImageNode.parentNode.removeChild(this.wallpaperImageNode);
					this.wallpaperImageNode = false;
				}
				var repeat = style == "centered" ? "no-repeat" : "repeat";
				domStyle.set(this.wallpaperNode,"backgroundRepeat", repeat);
				domStyle.set(this.wallpaperNode,"backgroundPosition", "center");
			} else {
				// fillscreen
				domStyle.set(this.wallpaperNode, "backgroundImage", "none");
				if(!this.wallpaperImageNode){
					this.wallpaperImageNode = domConstruct.create("img",{style:"width:100%;height:100%"},this.wallpaperNode);
				}
				this.wallpaperImageNode.src = image;
			}
		}
	});
	
});

