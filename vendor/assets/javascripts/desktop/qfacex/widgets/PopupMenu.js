define([
	"dojo/_base/declare",
	"dijit/Menu"
], function(declare, Menu) {

	var PopupMenu = declare(Menu, {

		menuOpened: function (event) {},
		
		_openMyself: function(event){
			this.menuOpened(event);
			var open;
			try{
				// Create a DIV that will overlay entire app and capture events that might go to interior iframes
				var menuOverlayDiv = document.getElementById('menuOverlayDiv');
				if(!menuOverlayDiv){
					menuOverlayDiv = dojo.create('div', {id:'menuOverlayDiv', style:'left:0px; top:0px; width:100%; height:100%; position:absolute; z-index:10;'}, document.body);
				}
				if(this.adjustPosition){
					var offsetPosition=this.adjustPosition(event);
						open = dijit.popup.open;
						dijit.popup.open = function(args){
							args.x += offsetPosition.x;
							args.y += offsetPosition.y;
							open.call(dijit.popup, args);
						};
				}
				this.onClose = function(){
					var menuOverlayDiv = document.getElementById('menuOverlayDiv');
					if(menuOverlayDiv){
						menuOverlayDiv.parentNode.removeChild(menuOverlayDiv);
					}
				}.bind(this);
				this.inherited(arguments);
			}finally{
				if(open){
					dijit.popup.open = open;
				}
			}
		}
	});
	
	return PopupMenu;
});
