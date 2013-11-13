//>>built
require({cache:{"url:gridx/templates/PaginationBar.html":"<div class='gridxPager' role=\"navigation\" aria-label='${id} ${pagerWai}'\n\t><table class='gridxPagerInner' cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\"\n\t\t><tr\n\t\t\t><td class=\"gridxPagerDescriptionTD\"\n\t\t\t\t><div class=\"gridxPagerDescription\"\n\t\t\t\t\tdata-dojo-attach-point=\"_descContainer\"\n\t\t\t\t></div\n\t\t\t></td\n\t\t\t><td class=\"gridxPagerStepperTD\"\n\t\t\t\t><div class=\"gridxPagerStepper\"\n\t\t\t\t\trole=\"toolbar\"\n\t\t\t\t\tdata-dojo-attach-point=\"_pageStepperContainer\"\n\t\t\t\t\t><span class='gridxPagerStepperBtn gridxPagerPrevPage'\n\t\t\t\t\t\ttabindex='${_tabIndex}'\n\t\t\t\t\t\ttitle='${prevPageTitle}'\n\t\t\t\t\t\taria-label='${prevPageTitle}'\n\t\t\t\t\t\trole=\"button\"\n\t\t\t\t\t\tpageindex='Prev'\n\t\t\t\t\t\tdata-dojo-attach-point='_prevPageBtn'\n\t\t\t\t\t\tdata-dojo-attach-event='onclick: _gotoPrevPage'\n\t\t\t\t\t\t><span class='gridxPagerA11yInner'>&nbsp;&lt;</span\n\t\t\t\t\t></span\n\t\t\t\t\t><span class='gridxPagerPages'\n\t\t\t\t\t\tdata-dojo-attach-point='_pageBtnContainer'\n\t\t\t\t\t\tdata-dojo-attach-event='onclick: _gotoPage, onmouseover: _onHoverPageBtn, onmouseout: _onHoverPageBtn'\n\t\t\t\t\t></span\n\t\t\t\t\t><span class='gridxPagerStepperBtn gridxPagerNextPage'\n\t\t\t\t\t\ttabindex='${_tabIndex}'\n\t\t\t\t\t\ttitle='${nextPageTitle}'\n\t\t\t\t\t\taria-label='${nextPageTitle}'\n\t\t\t\t\t\tpageindex='Next'\n\t\t\t\t\t\tdata-dojo-attach-point='_nextPageBtn'\n\t\t\t\t\t\tdata-dojo-attach-event='onclick: _gotoNextPage'\n\t\t\t\t\t\t><span class='gridxPagerA11yInner'>&nbsp;&gt;</span\n\t\t\t\t\t></span\n\t\t\t\t></div\n\t\t\t></td\n\t\t\t><td class=\"gridxPagerSizeSwitchTD\"\n\t\t\t\t><div class=\"gridxPagerSizeSwitch\"\n\t\t\t\t\trole=\"toolbar\"\n\t\t\t\t\tdata-dojo-attach-point='_sizeSwitchContainer'\n\t\t\t\t\tdata-dojo-attach-event='onclick: _switchPageSize, onmouseover: _onHoverSizeBtn, onmouseout: _onHoverSizeBtn'\n\t\t\t\t></div\n\t\t\t></td\n\t\t\t><td class='gridxPagerGoto'\n\t\t\t\t><span class='gridxPagerGotoBtn'\n\t\t\t\t\ttabindex='${_tabIndex}'\n\t\t\t\t\ttitle='${gotoBtnTitle}'\n\t\t\t\t\trole='button'\n\t\t\t\t\taria-label='${gotoBtnTitle}'\n\t\t\t\t\tdata-dojo-attach-point='_gotoBtn'\n\t\t\t\t\tdata-dojo-attach-event='onclick: _showGotoDialog'\n\t\t\t\t\t><span class='gridxPagerA11yInner'>&#9650;</span\n\t\t\t\t></span\n\t\t\t></td\n\t\t></tr\n\t></table\n></div>\n"}});
define("gridx/modules/pagination/LinkPager",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/sniff","dojo/_base/query","dojo/_base/event","dojo/dom-class","dojo/string","dojo/keys","../../util","./_PagerBase","dojo/text!../../templates/PaginationBar.html"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c){
var _d=_7.contains,_e=_7.toggle,_f=_8.substitute;
function _10(evt,_11,_12){
var n=evt.target;
while(!_d(n,_11)){
if(_d(n,_12)){
return null;
}
n=n.parentNode;
}
return n;
};
function _13(evt,_14,_15,_16){
var n=_10(evt,_14,_15);
if(n){
_e(n,_16,evt.type=="mouseover");
}
};
function _17(_18,_19,_1a,_1b,_1c){
var dir=_1b?-1:1,i=_19?_2.indexOf(_18,_19)+(_1a?dir:0):(_1b?_18.length-1:0),_1d=function(i,dir){
while(_18[i]&&!_1c(_18[i])){
i+=dir;
}
return _18[i];
};
_19=_1d(i,dir)||_1d(i-dir,-dir);
if(_19){
_19.focus();
}
return _19;
};
return _1(_b,{templateString:_c,_tabIndex:-1,postMixInProperties:function(){
if(_4("ie")){
var _1e=this.module.grid.domNode.getAttribute("tabindex");
this._tabIndex=_1e>0?_1e:0;
}
},refresh:function(){
var t=this;
t._createDescription();
t._createPageStepper();
t._createPageSizeSwitch();
t._createGotoButton();
},_onSwitchPage:function(){
this._createPageStepper();
this.module.grid.vLayout.reLayout();
},_onSizeChange:function(){
this._createDescription();
this._onSwitchPage();
},_focusArea:function(){
var _1f=this.module.grid.focus;
return _1f&&_1f.currentArea();
},_onChangePageSize:function(_20,_21){
var t=this,n=_5("[pagesize=\""+_20+"\"]",t._sizeSwitchContainer)[0];
if(n){
_7.add(n,"gridxPagerSizeSwitchBtnActive");
}
n=_5("[pagesize=\""+_21+"\"]",t._sizeSwitchContainer)[0];
if(n){
_7.remove(n,"gridxPagerSizeSwitchBtnActive");
}
if(t._focusArea()==t.position+"PageSizeSwitch"){
t._findNextPageSizeSwitch();
}
t._createPageStepper();
t.module.grid.vLayout.reLayout();
},_createPageStepper:function(){
var t=this,mod=t.module;
if(t._toggleNode("gridxPagerStepper",mod._exist(t.position,"stepper"))){
var p=t.pagination,_22=p.pageCount(),_23=p.currentPage(),_24=mod.arg("visibleSteppers"),sb=[],_25=t._tabIndex,_26=false,_27=false,_28=[mod.arg("pageIndexTitleTemplate",t.pageIndexTitle),mod.arg("pageIndexWaiTemplate",t.pageIndexTitle),mod.arg("pageIndexTemplate",t.pageIndex)],_29="<span class=\"gridxPagerStepperEllipsis\">&hellip;</span>",_2a=function(_2b){
return ["<span class=\"gridxPagerStepperBtn gridxPagerPage ",_23==_2b?"gridxPagerStepperBtnActive":"","\" aria-pressed=\"",_23==_2b?"true":"false","\" pageindex=\"",_2b,"\" title=\"",_f(_28[0],[_2b+1]),"\" aria-label=\"",_f(_28[1],[_2b+1]),"\" role=\"button\" tabindex=\"",_25,"\">",_f(_28[2],[_2b+1]),"</span>"].join("");
};
if(_22){
var _2c=_23-Math.floor((_24-1)/2),_2d=_2c+_24-1;
if(_2c<1){
_2c=1;
_2d=_24-1;
}else{
if(_22>_24&&_2c>=_22-_24){
_2c=_22-_24;
}
}
if(_2d>=_22-1){
_2d=_22-2;
}
sb.push(_2a(0));
if(_22>2){
if(_2c>1){
sb.push(_29);
}
for(var i=_2c;i<=_2d;++i){
sb.push(_2a(i));
}
if(_2d<_22-2){
sb.push(_29);
}
}
if(_22>1){
sb.push(_2a(_22-1));
}
}
t._pageBtnContainer.innerHTML=sb.join("");
if(!_23||_23===_22-1){
_27=!_23||_22<=1;
_26=_23||_22<=1;
}
_e(t._nextPageBtn,"gridxPagerStepperBtnDisable gridxPagerNextPageDisable",_26);
_e(t._prevPageBtn,"gridxPagerStepperBtnDisable gridxPagerPrevPageDisable",_27);
t._nextPageBtn.setAttribute("aria-disabled",_26);
t._prevPageBtn.setAttribute("aria-disabled",_27);
if(t._focusArea()==t.position+"PageStepper"){
t._findNextPageStepperBtn();
}
}
},_gotoPrevPage:function(){
this._focusPageIndex="Prev";
var p=this.pagination;
p.gotoPage(p.currentPage()-1);
},_gotoNextPage:function(){
this._focusPageIndex="Next";
var p=this.pagination;
p.gotoPage(p.currentPage()+1);
},_gotoPage:function(evt){
var n=_10(evt,"gridxPagerStepperBtn","gridxPagerPages");
if(n){
var _2e=this._focusPageIndex=n.getAttribute("pageindex");
this.pagination.gotoPage(parseInt(_2e,10));
}
},_onHoverPageBtn:function(evt){
_13(evt,"gridxPagerStepperBtn","gridxPagerPages","gridxPagerStepperBtnHover");
},_onHoverSizeBtn:function(evt){
_13(evt,"gridxPagerSizeSwitchBtn","gridxPagerSizeSwitch","gridxPagerSizeSwitchBtnHover");
},_createPageSizeSwitch:function(){
var t=this,mod=t.module;
if(t._toggleNode("gridxPagerSizeSwitch",mod._exist(t.position,"sizeSwitch"))){
var sb=[],_2f=t._tabIndex,_30=mod.arg("sizeSeparator"),_31=t.pagination.pageSize(),_32=[mod.arg("pageSizeTitleTemplate",t.pageSizeTitle),mod.arg("pageSizeWaiTemplate",t.pageSizeTitle),mod.arg("pageSizeTemplate",t.pageSize),mod.arg("pageSizeAllTitleText",t.pageSizeAllTitle),mod.arg("pageSizeAllWaiText",t.pageSizeAllTitle),mod.arg("pageSizeAllText",t.pageSizeAll)];
_2.forEach(mod.arg("sizes"),function(_33){
var _34=false;
if(!(_33>0)){
_33=0;
_34=true;
}
sb.push("<span class=\"gridxPagerSizeSwitchBtn ",_31===_33?"gridxPagerSizeSwitchBtnActive":"","\" aria-pressed=\"",_31===_33?"true":"false","\" pagesize=\"",_33,"\" title=\"",_34?_32[3]:_f(_32[0],[_33]),"\" aria-label=\"",_34?_32[4]:_f(_32[1],[_33]),"\" role=\"button\" tabindex=\"",_2f,"\">",_34?_32[5]:_f(_32[2],[_33]),"</span>","<span class=\"gridxPagerSizeSwitchSeparator\">"+_30+"</span>");
});
sb.pop();
t._sizeSwitchContainer.innerHTML=sb.join("");
}
},_switchPageSize:function(evt){
var n=_10(evt,"gridxPagerSizeSwitchBtn","gridxPagerSizeSwitch");
if(n){
var _35=this._focusPageSize=n.getAttribute("pagesize");
this.pagination.setPageSize(parseInt(_35,10));
}
},_createGotoButton:function(){
this._toggleNode("gridxPagerGoto",this.module._exist(this.position,"gotoButton"));
},_showGotoDialog:function(){
var t=this,mod=t.module;
if(!t._gotoDialog){
var cls=mod.arg("dialogClass"),_36=mod.arg("gotoPagePane"),_37=_3.mixin({"class":"gridxGotoPageDialog",title:t.gotoDialogTitle,content:new _36({pager:t})},mod.arg("dialogProps")||{});
t._gotoDialog=new cls(_37);
}
var _38=t.pagination.pageCount(),_39=t._gotoDialog.content;
_39.pageCountMsgNode.innerHTML=_f(t.gotoDialogPageCount,[_38]);
_39.pageInputBox.set("constraints",{fractional:false,min:1,max:_38});
t._gotoDialog.show();
},_initFocus:function(){
var t=this,g=t.module.grid,_17=g.focus;
if(_17){
var p=g.pagination,pos=t.position,fp=t.focusPriority,_3a=g.isLeftToRight()?_9.LEFT_ARROW:_9.RIGHT_ARROW;
_17.registerArea({name:pos+"PageStepper",priority:fp,focusNode:t._pageStepperContainer,doFocus:_3.hitch(t,t._findNextPageStepperBtn,false,false)});
t.connect(t._pageStepperContainer,"onkeydown",function(evt){
if(evt.keyCode==_9.LEFT_ARROW||evt.keyCode==_9.RIGHT_ARROW){
t._findNextPageStepperBtn(true,evt.keyCode==_3a);
}else{
if(evt.keyCode==_9.ENTER&&_d(evt.target,"gridxPagerStepperBtn")&&!_d(evt.target,"gridxPagerStepperBtnActive")&&!_d(evt.target,"gridxPagerStepperBtnDisable")){
if(isNaN(parseInt(t._focusPageIndex,10))){
t["_goto"+t._focusPageIndex+"Page"]();
}else{
p.gotoPage(parseInt(t._focusPageIndex,10));
}
}else{
return;
}
}
_6.stop(evt);
});
_17.registerArea({name:pos+"PageSizeSwitch",priority:fp+0.001,focusNode:t._sizeSwitchContainer,doFocus:_3.hitch(t,t._findNextPageSizeSwitch,false,false)});
t.connect(t._sizeSwitchContainer,"onkeydown",function(evt){
if(evt.keyCode==_9.LEFT_ARROW||evt.keyCode==_9.RIGHT_ARROW){
t._findNextPageSizeSwitch(true,evt.keyCode==_3a);
}else{
if(evt.keyCode==_9.ENTER&&_d(evt.target,"gridxPagerSizeSwitchBtn")&&!_d(evt.target,"gridxPagerSizeSwitchBtnActive")){
p.setPageSize(parseInt(t._focusPageSize,10));
}else{
return;
}
}
_6.stop(evt);
});
_17.registerArea({name:pos+"GotoPage",priority:fp+0.002,focusNode:t._gotoBtn,doFocus:function(evt){
_a.stopEvent(evt);
t._gotoBtn.focus();
return true;
}});
t.connect(t._gotoBtn,"onkeydown",function(evt){
if(evt.keyCode==_9.ENTER){
t._showGotoDialog();
_6.stop(evt);
}
});
}
},_findNextPageSizeSwitch:function(_3b,_3c,evt){
_a.stopEvent(evt);
var t=this,c=t._sizeSwitchContainer,n=_5("[pagesize=\""+t._focusPageSize+"\"]",c)[0];
n=_17(_5(".gridxPagerSizeSwitchBtn",c),n,_3b,_3c,function(_3d){
return !_d(_3d,"gridxPagerSizeSwitchBtnActive");
});
if(n){
t._focusPageSize=n.getAttribute("pagesize");
}
return n;
},_findNextPageStepperBtn:function(_3e,_3f,evt){
_a.stopEvent(evt);
var t=this,c=t._pageStepperContainer,n=_5("[pageindex=\""+t._focusPageIndex+"\"]",c)[0];
n=_17(_5(".gridxPagerStepperBtn",c),n,_3e,_3f,function(_40){
return !_d(_40,"gridxPagerStepperBtnActive")&&!_d(_40,"gridxPagerStepperBtnDisable");
});
if(n){
t._focusPageIndex=n.getAttribute("pageindex");
}
return n;
}});
});
