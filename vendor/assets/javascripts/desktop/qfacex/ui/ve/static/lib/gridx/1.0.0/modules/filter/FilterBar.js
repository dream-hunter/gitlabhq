//>>built
require({cache:{"url:gridx/templates/FilterBar.html":"<input type=\"button\" data-dojo-type=\"dijit.form.Button\" data-dojo-props=\"\n\ticonClass: 'gridxFilterBarBtnIcon',\n\tlabel: '...',\n\ttitle: '${defineFilter}'\" aria-label='${defineFilter}'\n/><div class=\"gridxFilterBarStatus\"\n\t><span>${noFilterApplied}</span\n\t><span class=\"gridxFilterBarCloseBtn\" tabindex=\"-1\" title=\"${closeFilterBarBtn}\"><span class=\"gridxFilterBarCloseBtnText\">x</span></span\n></div>\n"}});
define("gridx/modules/filter/FilterBar",["dojo/_base/declare","dijit/registry","dojo/_base/lang","dojo/_base/array","dojo/_base/event","dojo/dom-construct","dojo/dom-attr","dojo/dom-class","dojo/string","dojo/parser","dojo/query","../../core/_Module","dojo/text!../../templates/FilterBar.html","dojo/i18n!../../nls/FilterBar","./Filter","./FilterDialog","./FilterConfirmDialog","./FilterTooltip","dijit/TooltipDialog","dijit/popup","dijit/Tooltip","dijit/form/Button"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12){
return _1(_c,{name:"filterBar",forced:["filter"],getAPIPath:function(){
return {filterBar:this};
},closeFilterBarButton:true,defineFilterButton:true,tooltipDelay:300,maxRuleCount:0,ruleCountToConfirmClearFilter:2,conditions:{string:["equal","contain","startWith","endWith","notEqual","notContain","notStartWith","notEndWith","isEmpty"],number:["equal","greater","less","greaterEqual","lessEqual","notEqual","isEmpty"],date:["equal","before","after","range","isEmpty"],time:["equal","before","after","range","isEmpty"],"boolean":["equal","isEmpty"]},load:function(_13,_14){
var F=_f;
F.before=F.lessEqual;
F.after=F.greaterEqual;
this.closeFilterBarButton=this.arg("closeFilterBarButton")||this.closeFilterBarButton;
this.defineFilterButton=this.arg("defineFilterButton")||this.defineFilterButton;
this.tooltipDelay=this.arg("tooltipDelay")||this.tooltipDelay;
this.maxRuleCount=this.arg("maxRuleCount")||this.maxRuleCount;
this.ruleCountToConfirmClearFilter=this.arg("ruleCountToConfirmClearFilter")||this.ruleCountToConfirmClearFilter;
this.domNode=_6.create("div",{innerHTML:_9.substitute(_d,_e),"class":"gridxFilterBar"});
_a.parse(this.domNode);
_8.toggle(this.domNode,"gridxFilterBarHideCloseBtn",!this.closeFilterBarButton);
this.grid.vLayout.register(this,"domNode","headerNode",-1);
this._nls=_e;
this._initWidgets();
this._initFocus();
this.refresh();
this.connect(this.domNode,"onclick","onDomClick");
this.connect(this.domNode,"onmouseover","onDomMouseOver");
this.connect(this.domNode,"onmousemove","onDomMouseMove");
this.connect(this.domNode,"onmouseout","onDomMouseOut");
this.loaded.callback();
},onDomClick:function(e){
if(!e.target||!e.target.tagName){
return;
}
if(_7.get(e.target,"action")==="clear"){
this.clearFilter();
}else{
if(_8.contains(e.target,"gridxFilterBarCloseBtn")||_8.contains(e.target,"gridxFilterBarCloseBtnText")){
this.hide();
}else{
this.showFilterDialog();
}
}
},onDomMouseMove:function(e){
if(e&&e.target&&(_7.get(e.target,"action")==="clear"||this.btnFilter===dijit.getEnclosingWidget(e.target))){
return;
}
this._showTooltip(e);
},onDomMouseOver:function(e){
},onDomMouseOut:function(e){
window.setTimeout(_3.hitch(this,"_hideTooltip"),10);
},applyFilter:function(_15){
var F=_f,_16=[];
this.filterData=_15;
_4.forEach(_15.conditions,function(_17){
var _18="string";
if(_17.colId){
_18=this.grid.column(_17.colId).dataType();
_16.push(this._getFilterExpression(_17.condition,_17,_18,_17.colId));
}else{
var arr=[];
_4.forEach(this.grid.columns(),function(col){
if(!col.isFilterable()){
return;
}
arr.push(this._getFilterExpression(_17.condition,_17,_18,col.id));
},this);
_16.push(F.or.apply(F,arr));
}
},this);
var _19=(_15.type==="all"?F.and:F.or).apply(F,_16);
this.grid.filter.setFilter(_19);
var _1a=this;
this.model.when({}).then(function(){
_1a._currentSize=_1a.model.size();
_1a._totalSize=_1a.model._cache.size();
_1a._buildFilterState();
});
},confirmToExecute:function(_1b,_1c){
var max=this.ruleCountToConfirmClearFilter;
if(this.filterData&&(this.filterData.conditions.length>=max||max<=0)){
if(!this._cfmDlg){
this._cfmDlg=new _11();
}
this._cfmDlg.execute=_3.hitch(_1c,_1b);
this._cfmDlg.show();
}else{
_1b.apply(_1c);
}
},clearFilter:function(_1d){
if(!_1d){
this.confirmToExecute(_3.hitch(this,"clearFilter",true),this);
}else{
this.filterData=null;
this.grid.filter.setFilter();
this._buildFilterState();
}
},columnMixin:{isFilterable:function(){
return this.grid._columnsById[this.id].filterable!==false;
},setFilterable:function(_1e){
this.grid.filterBar._setFilterable(this.id,_1e);
return this;
},dataType:function(){
return (this.grid._columnsById[this.id].dataType||"string").toLowerCase();
},filterConditions:function(){
return this.grid.filterBar._getColumnConditions(this.id);
}},refresh:function(){
this.btnClose.style.display=this.closeFilterBarButton?"":"none";
this.btnFilter.style.display=this.defineFilterButton?"":"none";
},isVisible:function(){
return this.domNode.style.display!="none";
},show:function(){
this.domNode.style.display="block";
this.grid.vLayout.reLayout();
this.onShow();
},hide:function(){
this.domNode.style.display="none";
this.grid.vLayout.reLayout();
this._hideTooltip();
this.onHide();
},onShow:function(){
},onHide:function(){
},showFilterDialog:function(){
var dlg=this._filterDialog;
if(!dlg){
this._filterDialog=dlg=new _10({grid:this.grid});
}
if(dlg.open){
return;
}
if(!this.filterData){
dlg.setData(this.filterData);
}
dlg.show();
if(this.filterData){
dlg.setData(this.filterData);
}
},uninitialize:function(){
this._filterDialog&&this._filterDialog.destroyRecursive();
this.inherited(arguments);
_6.destroy(this.domNode);
},_getColumnConditions:function(_1f){
var _20,_21;
if(!_1f){
_20=[];
_21="string";
}else{
_20=this.grid._columnsById[_1f].disabledConditions||[];
_21=(this.grid._columnsById[_1f].dataType||"string").toLowerCase();
}
var ret=this.conditions[_21],_22={};
if(!ret){
ret=this.conditions["string"];
}
_4.forEach(_20,function(_23){
_22[_23]=true;
});
ret=_4.filter(ret,function(_24){
return !_22[_24];
});
return ret;
},_setFilterable:function(_25,_26){
var col=this.grid._columnsById[_25];
if(!col){
return;
}
if(col.filterable==!!_26){
return;
}
col.filterable=!!_26;
if(this.filterData){
var d=this.filterData,len=d.conditions.length;
d.conditions=_4.filter(d.conditions,function(c){
return c.colId!=_25;
});
if(len!=d.conditions.length){
this.applyFilter(d);
}
if(this._filterDialog.open){
this._filterDialog.setData(d);
}
}
},_initWidgets:function(){
this.btnFilter=_2.byNode(_b(".dijitButton",this.domNode)[0]);
this.btnClose=_b(".gridxFilterBarCloseBtn",this.domNode)[0];
this.statusNode=_b(".gridxFilterBarStatus",this.domNode)[0].firstChild;
_7.remove(this.btnFilter.focusNode,"aria-labelledby");
},_buildFilterState:function(){
var nls=this._nls;
if(!this.filterData||!this.filterData.conditions.length){
this.statusNode.innerHTML=nls.filterBarMsgNoFilterTemplate;
return;
}
this.statusNode.innerHTML=_9.substitute(nls.filterBarMsgHasFilterTemplate,[this._currentSize,this._totalSize,"items"])+"&nbsp; &nbsp; <a href=\"javascript:void(0);\" action=\"clear\" title=\"Clear filter\">Clear Filter</a>";
this._buildTooltip();
},_buildTooltip:function(){
if(!this._tooltip){
this._tooltip=new _12({grid:this.grid});
}
this._tooltip.buildContent();
},_showTooltip:function(evt,_27){
this._hideTooltip();
if(!this.filterData||!this.filterData.conditions||!this.filterData.conditions.length){
return;
}
if(!_27){
this._pointTooltipDelay=window.setTimeout(_3.hitch(this,"_showTooltip",evt,true),this.tooltipDelay);
return;
}
this._tooltip.show(evt);
},_hideTooltip:function(){
var dlg=this._tooltip;
if(!dlg){
return;
}
if(dlg.isMouseOn){
return;
}
if(this._pointTooltipDelay){
window.clearTimeout(this._pointTooltipDelay);
this._pointTooltipDelay=null;
}
dlg.hide();
},_getRuleString:function(_28,_29,_2a){
var _2b,_2a;
if(_28=="isEmpty"){
_2b="";
}else{
if(/^date|^time/i.test(_2a)){
var f=this._formatDate;
if(/^time/i.test(_2a)){
f=this._formatTime;
}
if(_28==="range"){
var tpl=this._nls.rangeTemplate;
_2b=_9.substitute(tpl,[f(_29.start),f(_29.end)]);
}else{
_2b=f(_29);
}
}else{
_2b=_29;
}
}
return "<span style=\"font-style:italic\">"+this._getConditionDisplayName(_28)+"</span> "+_2b;
},_getConditionDisplayName:function(c){
var k=c.charAt(0).toUpperCase()+c.substring(1);
return this._nls["condition"+k];
},_getConditionOptions:function(_2c){
var nls=this._nls;
var _2d=this._conditionOptions=this._conditionOptions||{};
if(!_2d[_2c]){
var arr=[];
_4.forEach(this._getColumnConditions(_2c),function(s){
var k=s.charAt(0).toUpperCase()+s.substring(1);
arr.push({label:nls["condition"+k],value:s});
},this);
_2d[_2c]=arr;
}
return _2d[_2c];
},_getFilterExpression:function(_2e,_2f,_30,_31){
var F=_f;
var dc=this.grid._columnsById[_31].dateParser||this._stringToDate;
var tc=this.grid._columnsById[_31].timeParser||this._stringToTime;
var _32={date:dc,time:tc};
var c=_2f.condition,exp,_33=false,_30=c=="isEmpty"?"string":_30;
if(c==="range"){
var _34=F.value(_2f.value.start,_30),_35=F.value(_2f.value.end,_30),_36=F.column(_31,_30,_32[_30]);
exp=F.and(F.greaterEqual(_36,_34),F.lessEqual(_36,_35));
}else{
if(/^not/.test(c)){
_33=true;
c=c.replace(/^not/g,"");
c=c.charAt(0).toLowerCase()+c.substring(1);
}
exp=F[c](F.column(_31,_30,_32[_30]),c=="isEmpty"?null:F.value(_2f.value,_30));
if(_33){
exp=F.not(exp);
}
}
return exp;
},_stringToDate:function(s,_37){
_37=_37||/(\d{4})\/(\d\d?)\/(\d\d?)/;
_37.test(s);
var d=new Date();
d.setFullYear(parseInt(RegExp.$1));
d.setMonth(parseInt(RegExp.$2)-1);
return d;
},_stringToTime:function(s,_38){
_38=_38||/(\d\d?):(\d\d?):(\d\d?)/;
_38.test(s);
var d=new Date();
d.setHours(parseInt(RegExp.$1));
d.setMinutes(parseInt(RegExp.$2));
d.setSeconds(parseInt(RegExp.$3));
return d;
},_formatDate:function(_39){
var m=_39.getMonth()+1,d=_39.getDate();
return m+"/"+d+"/"+_39.getFullYear();
},_formatTime:function(_3a){
var h=_3a.getHours(),m=_3a.getMinutes();
if(h<10){
h="0"+h;
}
if(m<10){
m="0"+m;
}
return h+":"+m+":00";
},_initFocus:function(){
var _3b=this.grid.focus;
if(_3b){
_3b.registerArea({name:"filterbar_btn",priority:-1,focusNode:this.btnFilter.domNode,doFocus:this._doFocusBtnFilter,scope:this});
_3b.registerArea({name:"filterbar_clear",priority:-0.9,focusNode:this.domNode,doFocus:this._doFocusClearLink,scope:this});
_3b.registerArea({name:"filterbar_close",priority:-0.8,focusNode:this.btnClose,doFocus:this._doFocusBtnClose,scope:this});
}
},_doFocusBtnFilter:function(evt){
this.btnFilter.focus();
if(evt){
_5.stop(evt);
}
return true;
},_doFocusClearLink:function(evt){
this.btnFilter.focus();
var _3c=_b("a[action=\"clear\"]")[0];
if(_3c){
_3c.focus();
if(evt){
_5.stop(evt);
}
return true;
}
return false;
},_doFocusBtnClose:function(evt){
this.btnClose.focus();
if(evt){
_5.stop(evt);
}
return true;
},_doBlur:function(){
return true;
},destroy:function(){
this._filterDialog&&this._filterDialog.destroy();
_6.destroy(this.domNode);
this.inherited(arguments);
}});
});
