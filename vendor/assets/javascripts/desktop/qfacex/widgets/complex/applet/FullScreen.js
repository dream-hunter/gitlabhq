/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: lihongwang
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/lang", 
	"dojo/_base/declare", 
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct", 
	"dojo/on",
	"qfacex/widgets/complex/applet/Applet"
],function(lang,declare,domStyle,domClass,domConstruct,on,Applet) {

	return declare([Applet], {
		dispName: "Full Screen",

		postCreate: function(){
			// domStyle.set(this.containerNode,"padding","px");
			
			var div = domConstruct.create('div',{class:"nav appletContent",title : this.dispName}, this.containerNode);
			var i = domConstruct.create("i",{class:"icon-16-actions-view-fullscreen"},div);
			
			on(div,"click",lang.hitch(this,function(){
				this.fullScreen();
				if(domClass.contains(this.div,"icon-16-actions-view-fullscreen")){
					domClass.replace(this.div,"icon-16-actions-view-unfullscreen","icon-16-actions-view-fullscreen");
				} else {
					domClass.replace(this.div,"icon-16-actions-view-fullscreen","icon-16-actions-view-unfullscreen");
				}
			}));

			on(i,"mouseover",function(){
				domClass.add(i,"actived");
			});
		    
			on(i,"mouseout",function(){
				domClass.remove(i,"actived");
			});

		    this.inherited(arguments);
		},


		// html5 fullscreen API
		fullScreen : function() {
			
			var docElm = document.documentElement;
			if (!document.fullscreenElement &&    // alternative standard method
	  		!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				}
				else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				}
				else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				}
			} else{
			if (document.cancelFullScreen) {
		      document.cancelFullScreen();
		    } else if (document.mozCancelFullScreen) {
		      docElm.mozCancelFullScreen();
		    } else if (document.webkitCancelFullScreen) {
		      document.webkitCancelFullScreen();
		    }
			}
		}
	});

});
