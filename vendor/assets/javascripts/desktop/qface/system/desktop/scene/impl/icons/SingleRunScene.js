/**
 * qface/system/desktop/scene/impl/icons/Scene
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 *
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
  "dojo/dom-style",
  "dojo/query",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"qface/system/desktop/scene/impl/icons/Area",
	"qface/system/desktop/scene/impl/icons/Scene",
],function(domStyle,query,declare,lang,array,Area,Scene) {
	var Scene = declare([Scene],{

		init: function(config){
			if(this._drawn === true) return;
			this._drawn = true;
			this._config = config;
			this.makeArea();
			// this.makeAreaContainer();
			// this.makePanels();
		},

		makeArea : function() {
			this._area = new Area({
				style:"width:100%;height:100%",
				name :this.name,
				items : this._config.apps,
				scene:this
			});
			this.addChild(this._area);
			// this.updateWallpaper(this._config.wallpaper);
		},

		updateWallpaper: function(wallpaper){
			this._area.updateWallpaper(wallpaper);
		}
	});

	return Scene;

});

