/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare",
	"qface/windows/layout/Region"
	"qface/windows/layout/BorderLayout",
	"qface/windows/control/primitives/ScrollBarView"
],function(declare,Region,BorderLayout,ScrollBarView) {
	var HIncButton = declare(PanelVisual,{
	});

	var HBundle = declare(PanelVisual,{
	});

	var HDecButton = declare(PanelVisual,{
	});
	
	
	var HorzScrollBarVisual = declare(ScrollBarVisual,{
		"-privates-"	:	{
			"_calcIncBtnSize"	:	function()	{
				var w = this.incBtn.width,
					h = this.clientHeight;
				return new Size(w,h);	
			},
			
			"_calcDecBtnSize"	:	function()	{
				var w = this.decBtn.width,
					h = this.clientHeight;
				return new Size(w,h);	
			},
			
			"_calcIncBtnLocation"	:	function()	{
				var l = this.clientWidth - this.incBtn.width,
					t = 0;
				return new Location(l,t);
			},
		
			"_amount"	:	function(){
	            var db = this.decBtn, ib = this.incBtn;
	            return ib.left - db.left - db.width;
			},

			"_knobBtnMoving"	:	function(ve){
				var range = (this.max - this.min),
					am = this._amount(),
					knobw = this.knobBtn.width,
					knobl = this.knobBtn.left;
					this.position = ~~((knobl / (am - knobw)) * range) + this.min;
			},
			"_clicked"	:	function(ve){
				ve.stopPropagation();
				if (ve.x<this.knobBtn.left){
					this.position = this.position - this.largeChange;
				} else {
					this.position = this.position + this.largeChange;
				}
			}
			
		},
	
		constrctor 	: function() {
			var decBtn = this.decBtn = new HDecButton();
			this.addChild(decBtn);
			decBtn.on(ClickEvent,this._decBtnClick,this);
			var incBtn this.incBtn = new HIncButton();
			this.addChild(incBtn);
			incBtn.on(ClickEvent,this._incBtnClick,this);
		}
	});
	
	return HorzScrollBarVisual;
	
});	
