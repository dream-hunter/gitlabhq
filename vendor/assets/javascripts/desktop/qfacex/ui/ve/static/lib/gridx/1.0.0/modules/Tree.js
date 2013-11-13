//>>built
define("gridx/modules/Tree",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/array","dojo/dom-class","dojo/dom-geometry","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","dojo/query","dojo/keys","../util","../core/_Module"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c){
_1.experimental("gridx/modules/Tree");
function _d(_e){
var n=_e.firstChild;
return n&&n.className&&_4.contains(n,"gridxTreeExpandoCell")&&!_4.contains(n,"gridxTreeExpandoLoading");
};
_c._markupAttrs.push("!expandLevel");
return _2(_c,{name:"tree",constructor:function(){
this._clear();
},getAPIPath:function(){
return {tree:this};
},preload:function(){
var t=this,g=t.grid;
if(t.model.treeMarkMode){
t.model.treeMarkMode("",true);
}
g.domNode.setAttribute("role","treegrid");
t.batchConnect([g.body,"collectCellWrapper","_createCellWrapper"],[g.body,"onAfterRow","_onAfterRow"],[g,"onCellClick","_onCellClick"],[g,"setStore","_clear"]);
t._initExpandLevel();
t._initFocus();
if(g.persist){
var id,_f=g.persist.registerAndLoad("tree",function(){
return {openInfo:this._openInfo,parentOpenInfo:this._parentOpenInfo};
});
if(_f){
var _10=t._openInfo=_f.openInfo,_11=t._parentOpenInfo=_f.parentOpenInfo;
for(id in _10){
_10[id].openned=_11[id];
}
t._persisted=1;
}
}
},load:function(_12){
var t=this;
if(t._persisted){
t.loaded.callback();
}else{
t.model.when({},function(){
t._openInfo[""].count=t.model.size();
}).then(function(){
t.loaded.callback();
});
}
},rowMixin:{canExpand:function(){
return this.grid.tree.canExpand(this.id);
},isExpanded:function(){
return this.grid.tree.isExpanded(this.id);
},expand:function(){
return this.grid.tree.expand(this.id);
},collapse:function(){
return this.grid.tree.collapse(this.id);
},expandRecursive:function(){
return this.grid.expandRecursive(this.id);
},collapseRecursive:function(){
return this.grid.collapseRecursive(this.id);
}},nested:false,expandoPadding:18,expandLevel:1/0,onExpand:function(id){
},onCollapse:function(id){
},canExpand:function(id){
var t=this,m=t.model,_13=m.treePath(id).length,_14=t.arg("expandLevel");
return m.hasChildren(id)&&(!(_14>0)||_13<=_14);
},isExpanded:function(id){
return !!this._openInfo[id];
},expand:function(id,_15){
var d=new _7(),t=this;
if(id&&!t.isExpanded(id)){
t.model.when({parentId:id,start:0},function(){
t._logicExpand(id);
}).then(function(){
_7.when(_15||t._updateBody(id),function(){
d.callback();
t.onExpand(id);
});
});
}else{
d.callback();
}
return d;
},collapse:function(id,_16){
var d=new _7(),t=this;
if(id&&t.isExpanded(id)){
t._logicCollapse(id);
_7.when(_16||t._updateBody(id),function(){
d.callback();
t.onCollapse(id);
});
}else{
d.callback();
}
return d;
},expandRecursive:function(id,_17){
var t=this,m=t.model,d=new _7();
t.expand(id,1).then(function(){
var i,dl=[],_18=m.size(id);
m.when({start:0,parentId:id},function(){
for(i=0;i<_18;++i){
var _19=m.indexToId(i,id);
dl.push(t.expandRecursive(_19,1));
}
}).then(function(){
new _8(dl).then(function(){
_7.when(_17||t._updateBody(id),function(){
d.callback();
});
});
});
});
return d;
},collapseRecursive:function(id,_1a){
var d=new _7(),_1b=_6.hitch(d,d.callback),_1c=_6.hitch(d,d.errback),t=this,_1d=t._openInfo[id||""],i,dl=[];
if(_1d){
for(i=_1d.openned.length-1;i>=0;--i){
dl.push(t.collapseRecursive(_1d.openned[i],1));
}
new _8(dl).then(function(){
if(id){
t.collapse(id,_1a).then(_1b,_1c);
}else{
if(!_1a){
t._updateBody().then(_1b,_1c);
}
}
});
}else{
_1b();
}
return d;
},getRowInfoByVisualIndex:function(_1e,_1f){
var t=this,_20=t._openInfo[""].openned,_21,i;
for(i=0;i<_20.length;++i){
_21=t._openInfo[_20[i]];
if(_21.index<_1f){
_1e+=_21.count+1;
}else{
break;
}
}
var _22={parentId:"",preCount:0};
while(!_22.found){
_22=t._getChild(_1e,_22);
}
return _22;
},getVisualIndexByRowInfo:function(_23,_24,_25){
var _26=this._getAbsoluteVisualIndex(_23,_24);
return _26>=0?_26-this._getAbsoluteVisualIndex("",_25):null;
},getVisualSize:function(_27,_28,_29){
var _2a=this._openInfo[_29||""];
if(_2a){
var i,len=_2a.openned.length,_2b,_2c=_28;
for(i=0;i<len;++i){
_2b=this._openInfo[_2a.openned[i]];
if(_2b.index>=_27&&_2b.index<_27+_28){
_2c+=_2b.count;
}
}
return _2c;
}
return 0;
},_clear:function(){
var _2d=[];
this._openInfo={"":{id:"",parentId:null,index:-1,count:0,openned:_2d}};
this._parentOpenInfo={"":_2d};
},_initExpandLevel:function(){
var _2e=this.grid._columns;
if(!_3.some(_2e,function(col){
return col.expandLevel;
})){
if(this.arg("nested")){
_3.forEach(_2e,function(col,i){
col.expandLevel=i+1;
});
}else{
_2e[0].expandLevel=1;
}
}
},_createCellWrapper:function(_2f,_30,_31){
var t=this,col=t.grid._columnsById[_31];
if(col.expandLevel){
var _32=t.arg("nested"),_33=t.model.treePath(_30).length,_34=t.arg("expandLevel");
if((!_32||col.expandLevel==_33)&&(!(_34>0)||_33<=_34+1)){
var _35=t.model.hasChildren(_30),_36=t.isExpanded(_30),pad=0,_37=t.arg("expandoPadding"),ltr=t.grid.isLeftToRight();
if(!_32){
pad=(_33-1)*_37;
}
if(_33==_34+1){
if(_32){
return;
}
_35=false;
}
_2f.push({priority:0,wrap:function(_38){
return ["<div class='gridxTreeExpandoCell ",_36?"gridxTreeExpandoCellOpen":"","' style='padding-",ltr?"left":"right",": ",pad+_37,"px;'>","<span class='gridxTreeExpandoIcon ",_35?"":"gridxTreeExpandoIconNoChildren","' ","style='margin-",ltr?"left":"right",": ",pad,"px;'>","<span class='gridxTreeExpandoInner'>",_36?"-":"+","</span></span><span class='gridxTreeExpandoContent'>",_38,"</span></span>"].join("");
}});
}
}
},_onCellClick:function(e){
if(_d(e.cellNode)){
var t=this,pos=_5.position(_9(".gridxTreeExpandoIcon",e.cellNode)[0]);
if(e.clientX>=pos.x&&e.clientX<=pos.x+pos.w&&e.clientY>=pos.y&&e.clientY<=pos.y+pos.h){
if(t.isExpanded(e.rowId)){
t.collapse(e.rowId);
}else{
t.expand(e.rowId);
}
}
}
},_updateBody:function(id){
var t=this,_39=t.grid.body;
if(_39){
_39.updateRootRange(_39.rootStart,_39.rootCount);
var _3a=_39.getRowNode({rowId:id}),n,_3b,_3c=t.isExpanded(id);
if(_3a){
n=_9(".gridxTreeExpandoCell",_3a)[0];
if(n){
_3b=_9(".gridxTreeExpandoIcon",n)[0];
_3b.firstChild.innerHTML="o";
_4.add(n,"gridxTreeExpandoLoading");
}
}
var _3d=id?t.getVisualIndexByRowInfo(t.model.treePath(id).pop(),t.model.idToIndex(id),_39.rootStart):-1;
return _39.refresh(_3d+1).then(function(){
if(n){
_3a.setAttribute("aria-expanded",_3c?"true":"false");
_3b.firstChild.innerHTML=_3c?"-":"+";
_4.remove(n,"gridxTreeExpandoLoading");
_4.toggle(n,"gridxTreeExpandoCellOpen",_3c);
}
});
}
return null;
},_getAbsoluteVisualIndex:function(_3e,_3f){
var _40=this._openInfo[_3e||""];
if(_40){
var _41=0,_42=this._openInfo,_43=function(_44){
_41+=_3f;
var _45,i;
for(i=0;i<_44.openned.length;++i){
_45=_42[_44.openned[i]];
if(_45.index<_3f){
_41+=_45.count;
}else{
break;
}
}
_3f=_44.index;
if(_44.id){
_41++;
}
return _42[_44.parentId];
};
while(_40){
_40=_43(_40);
}
return _41;
}
return -1;
},_logicExpand:function(id){
var t=this,m=t.model,_46=m.treePath(id),_47=_46.length,_48=t.arg("expandLevel");
if(m.hasChildren(id)&&(!(_48>0)||_47<=_48)){
var _49=_46.pop(),_4a=t._openInfo,poi=t._parentOpenInfo,_4b=poi[_49]=poi[_49]||[];
poi[id]=poi[id]||[];
if(!_4a[id]){
var _4c=m.idToIndex(id),_4d=m.size(id),i=_b.biSearch(_4b,function(_4e){
return _4a[_4e].index-_4c;
});
if(_4b[i]!==id){
_4b.splice(i,0,id);
}
for(i=poi[id].length-1;i>=0;--i){
_4d+=_4a[poi[id][i]].count;
}
_4a[id]={id:id,parentId:_49,index:_4c,count:_4d,openned:poi[id]};
var _4f=_4a[_49];
while(_4f){
_4f.count+=_4d;
_4f=_4a[_4f.parentId];
}
}
}
},_logicCollapse:function(id){
var t=this,_50=t._openInfo[id];
if(_50){
var _51=t._openInfo,_52=t.model.treePath(id).pop(),_53=t._parentOpenInfo[_52],i=_b.biSearch(_53,function(_54){
return _51[_54].index-_50.index;
}),_55=_50.count;
_53.splice(i,1);
_50=_51[_52];
while(_50){
_50.count-=_55;
_50=_51[_50.parentId];
}
delete _51[id];
}
},_getChild:function(_56,_57){
var _58=this._openInfo[_57.parentId],i,len,_59=_57.preCount+_58.index+1,_5a={found:true,visualIndex:_56,count:1};
for(i=0,len=_58.openned.length;i<len;++i){
var _5b=_58.openned[i],_5c=this._openInfo[_5b],_5d=_5c.index+_59;
if(_5d===_56){
return _6.mixin({parentId:_58.id,start:_5c.index},_5a);
}else{
if(_5d>_56){
break;
}else{
if(_5d+_5c.count>=_56){
return {parentId:_5b,preCount:_59};
}
}
}
_59+=_5c.count;
}
return _6.mixin({parentId:_58.id,start:_56-_59},_5a);
},_onAfterRow:function(row){
var _5e=this.model.hasChildren(row.id);
if(_5e){
row.node().setAttribute("aria-expanded",this.isExpanded(row.id));
}
},_initFocus:function(){
this.connect(this.grid,"onCellKeyPress","_onKey");
},_onKey:function(e){
var t=this;
if(e.keyCode==_a.ESCAPE){
var m=t.model,_5f=m.treePath(e.rowId),_60=_5f.pop(),_61=_5f.length,_62=t.grid;
if(_60){
var i,col,_63;
for(i=_62._columns.length-1;i>=0;--i){
col=_62._columns[i];
if(col.expandLevel&&(!t.arg("nested")||col.expandLevel==_61)){
break;
}
}
m.when({id:_60},function(){
_63=_62.body.getVisualIndex({parentId:_5f.pop(),rowIndex:m.idToIndex(_60)}).visualIndex;
}).then(function(){
_62.vScroller.scrollToRow(_63).then(function(){
_62.body._focusCell(null,_63,col.index);
});
});
}
}else{
if(e.ctrlKey&&_d(e.cellNode)){
var ltr=t.grid.isLeftToRight();
if(e.keyCode==(ltr?_a.LEFT_ARROW:_a.RIGHT_ARROW)&&t._openInfo[e.rowId]){
t.collapse(e.rowId);
}else{
if(e.keyCode==(ltr?_a.RIGHT_ARROW:_a.LEFT_ARROW)&&!t._openInfo[e.rowId]){
t.expand(e.rowId);
}
}
}
}
}});
});
