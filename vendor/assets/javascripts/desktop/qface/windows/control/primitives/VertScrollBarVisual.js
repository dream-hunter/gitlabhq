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
		
	var VIncButton = declare(PanelVisual,{
	});
		
	var VBundle = declare(PanelVisual,{
	});

	var VDecButton = declare(PanelVisual,{
	});

	var VertScrollBarVisual = declare(ScrollBarVisual,{
		"-privates-"	:	{
			"_calcIncBtnSize"	:	function()	{
				var w = this.clientWidth,
					h = this.incBtn.size.height;
				return new Size(w,h);	
			},
			"_calcDecBtnSize"	:	function()	{
				var w = this.clientWidth,
					h = this.decBtn.size.height;
				return new Size(w,h);	
			},
			"_calcIncBtnLocation"	:	function()	{
				var l = 0,
					t = this.clientHeight - this.incBtn.height.;
				return new Location(l,t);
			},
			
			"_calcKnobBtnSize"	:	function(){
				var am = this._amount(),
					r = this.max-this.min,
					p = this.pageSize,
					w = this.clientWidth,
	                    h = ~~((p/(r+p))*am);
				return new Size(w,h);	
			},
			
			"_calcKnobBtnLocation"	:	function(){
				var am = this._amount(),
					r = this.max-this.min,
					p = this.pageSize,
					w = this.clientWidth,
	                    h = ~~((p/(r+p))*am);
				return new Size(w,h);	
			},

			"_amount"	:	function(){
	            var db = this.decBtn, ib = this.incBtn;
	            return ib.top - db.top - db.height;		
			},
			
			"_konbAmount"	: 	function(){
				return this.knobBtn.height;
			},
			
			"_knobBtnMoving"	:	function(ve){
				var range = (this.max - this.min),
					am = this._amount(),
					knobh = this.knobBtn.height,
					knobt = this.knobBtn.top;
					this.position = ~~((knobt / (am - knobh)) * range) + this.min;
			},
			"_clicked"	:	function(ve){
				ve.stopPropagation();
				if (ve.x<this.knobBtn.top){
					this.position = this.position - this.largeChange;
				} else {
					this.position = this.position + this.largeChange;
				}
			}
		},
	
		constructor 	: function() {
			var decBtn = this.decBtn = new VDecButton();
			this.addChild(decBtn);
			decBtn.on(ClickEvent,this._decBtnClick,this);
			var incBtn this.incBtn = new VIncButton();
			this.addChild(incBtn);
			incBtn.on(ClickEvent,this._incBtnClick,this);
z		}
	});

	
	return VertScrollBarVisual;
	
});	
