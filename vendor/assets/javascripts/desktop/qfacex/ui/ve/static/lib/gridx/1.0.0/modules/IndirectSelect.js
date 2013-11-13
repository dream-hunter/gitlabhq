//>>built
define("gridx/modules/IndirectSelect",["dojo/_base/declare","dojo/_base/array","dojo/_base/query","dojo/_base/lang","dojo/dom-class","dojo/_base/Deferred","../core/_Module","../util","./RowHeader"],function(_1,_2,_3,_4,_5,_6,_7,_8){
return _1(_7,{name:"indirectSelect",required:["rowHeader","selectRow"],preload:function(){
var t=this,g=t.grid,_9=g.focus,sr=g.select.row,_a=g.rowHeader;
_a.cellProvider=_4.hitch(t,t._createSelector);
t.batchConnect([sr,"onHighlightChange","_onHighlightChange"],[sr,"clear","_onClear"],[sr,"onSelectionChange","_onSelectionChange"],[g,"onRowMouseOver","_onMouseOver"],[g,"onRowMouseOut","_onMouseOut"],_9&&[_9,"onFocusArea",function(_b){
if(_b=="rowHeader"){
t._onMouseOver();
}
}],_9&&[_9,"onBlurArea",function(_c){
if(_c=="rowHeader"){
t._onMouseOut();
}
}]);
if(sr.selectByIndex&&t.arg("all")){
t._allSelected={};
_a.headerProvider=_4.hitch(t,t._createSelectAllBox);
_a.loaded.then(function(){
if(_9){
t._initFocus();
}
t.connect(g,"onRowHeaderHeaderMouseDown","_onSelectAll");
});
}
},all:true,_createSelector:function(_d){
var _e=_d.node(),_f=_e&&_5.contains(_e,"gridxRowSelected"),_10=_e&&_5.contains(_e,"gridxRowPartialSelected");
return this._createCheckBox(_f,_10);
},_createCheckBox:function(_11,_12){
var _13=this._getDijitClass();
return ["<span role=\"",this._isSingle()?"radio":"checkbox","\" class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline ",_13," ",_11?_13+"Checked":"",_12?_13+"Partial":"","\" aria-checked=\"",_11?"true":_12?"mixed":"false","\"><span class=\"gridxIndirectSelectionCheckBoxInner\">",_11?"&#10003;":_12?"&#9646;":"&#9744;","</span></span>"].join("");
},_createSelectAllBox:function(){
return this._createCheckBox(this._allSelected[this._getPageId()]);
},_getPageId:function(){
return this.grid.body.rootStart+","+this.grid.body.rootCount;
},_onClear:function(){
var cls=this._getDijitClass()+"Checked";
_3("."+cls,this.grid.rowHeader.bodyNode).forEach(function(_14){
_5.remove(_14,cls);
});
},_onHighlightChange:function(_15,_16){
var _17=_3("[visualindex=\""+_15.row+"\"].gridxRowHeaderRow .gridxIndirectSelectionCheckBox",this.grid.rowHeader.bodyNode)[0];
if(_17){
var _18=this._getDijitClass(),_19=_16=="mixed",_1a=_16&&!_19;
_5.toggle(_17,_18+"Checked",_1a);
_5.toggle(_17,_18+"Partial",_19);
_17.setAttribute("aria-checked",_1a?"true":_19?"mixed":"false");
_17.firstChild.innerHTML=_1a?"&#10003;":_19?"&#9646;":"&#9744;";
}
},_onMouseOver:function(){
var sr=this.grid.select.row;
if(!sr.holdingCtrl){
this._holdingCtrl=false;
sr.holdingCtrl=true;
}
},_onMouseOut:function(){
if(this.hasOwnProperty("_holdingCtrl")){
this.grid.select.row.holdingCtrl=false;
delete this._holdingCtrl;
}
},_getDijitClass:function(){
return this._isSingle()?"dijitRadio":"dijitCheckBox";
},_isSingle:function(){
var _1b=this.grid.select.row;
return _1b.hasOwnProperty("multiple")&&!_1b.arg("multiple");
},_onSelectAll:function(){
var t=this,g=t.grid,_1c=g.body;
g.select.row[t._allSelected[t._getPageId()]?"deselectByIndex":"selectByIndex"]([0,_1c.visualCount-1]);
},_onSelectionChange:function(_1d){
var t=this,d,_1e,_1f=t.grid.body,_20=t.model,_21=_1f.rootStart,_22=_1f.rootCount;
var _23=_2.filter(_1d,function(id){
return !_20.treePath(id).pop();
});
if(_22===_20.size()){
_1e=_22==_23.length;
}else{
d=new _6();
_20.when({start:_21,count:_22},function(){
var _24=_2.filter(_2.map(_23,function(id){
return _20.idToIndex(id);
}),function(_25){
return _25>=_21&&_25<_21+_22;
});
_1e=_22==_24.length;
d.callback();
});
}
_6.when(d,function(){
t._allSelected[t._getPageId()]=_1e;
var _26=t.grid.rowHeader.headerCellNode.firstChild;
_5.toggle(_26,t._getDijitClass()+"Checked",_1e);
_26.setAttribute("aria-checked",_1e?"true":"false");
});
},_initFocus:function(){
var g=this.grid,_27=g.rowHeader,_28=_27.headerCellNode,_29=function(evt){
_8.stopEvent(evt);
_5.add(_28,"gridxHeaderCellFocus");
_28.focus();
return true;
},_2a=function(){
_5.remove(_28,"gridxHeaderCellFocus");
return true;
};
g.focus.registerArea({name:"selectAll",priority:0.89,focusNode:_27.headerNode,doFocus:_29,doBlur:_2a,onFocus:_29,onBlur:_2a});
}});
});
