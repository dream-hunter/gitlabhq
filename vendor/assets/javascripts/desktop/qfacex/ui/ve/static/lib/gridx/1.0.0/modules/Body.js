//>>built
define("gridx/modules/Body",["dojo/_base/declare","dojo/_base/query","dojo/_base/array","dojo/_base/lang","dojo/dom-construct","dojo/dom-class","dojo/_base/Deferred","dojo/_base/sniff","dojo/keys","../core/_Module","../util","dojo/i18n!../nls/Body"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c){
return _1(_a,{name:"body",optional:["tree"],getAPIPath:function(){
return {body:this};
},constructor:function(){
var t=this,m=t.model,g=t.grid,dn=t.domNode=g.bodyNode,_d=function(){
t.refresh();
};
if(t.arg("rowHoverEffect")){
_6.add(dn,"gridxBodyRowHoverEffect");
}
g.emptyNode.innerHTML=t.arg("loadingInfo",_c.loadingInfo);
g._connectEvents(dn,"_onMouseEvent",t);
t.aspect(m,"onDelete","_onDelete");
t.aspect(m,"onSet","_onSet");
t.aspect(g,"onRowMouseOver","_onRowMouseOver");
t.aspect(g,"onCellMouseOver","_onCellMouseOver");
t.aspect(g,"onCellMouseOut","_onCellMouseOver");
t.connect(g.bodyNode,"onmouseleave",function(){
_2("> .gridxRowOver",t.domNode).removeClass("gridxRowOver");
});
t.connect(g.bodyNode,"onmouseover",function(e){
if(e.target==g.bodyNode){
_2("> .gridxRowOver",t.domNode).removeClass("gridxRowOver");
}
});
t.aspect(g,"setStore",_d);
},preload:function(){
this._initFocus();
},load:function(_e){
var t=this,m=t.model,g=t.grid,_f=function(){
t.aspect(m,"onSizeChange","_onSizeChange");
t.loaded.callback();
};
m.when({},function(){
t.rootCount=t.rootCount||m.size();
t.visualCount=g.tree?g.tree.getVisualSize(t.rootStart,t.rootCount):t.rootCount;
_f();
}).then(null,function(e){
t._loadFail(e);
_f();
});
},destroy:function(){
this.inherited(arguments);
this.domNode.innerHTML="";
},rowMixin:{node:function(){
return this.grid.body.getRowNode({rowId:this.id});
},visualIndex:function(){
var t=this,id=t.id;
return t.grid.body.getRowInfo({rowId:id,rowIndex:t.index(),parentId:t.model.parentId(id)}).visualIndex;
}},cellMixin:{node:function(){
return this.grid.body.getCellNode({rowId:this.row.id,colId:this.column.id});
}},rowHoverEffect:true,stuffEmptyCell:true,getRowNode:function(_10){
var _11=this._getRowNodeQuery(_10);
return _11&&_2("> "+_11,this.domNode)[0]||null;
},getCellNode:function(_12){
var t=this,_13=_12.colId,_14=t.grid._columns,r=t._getRowNodeQuery(_12);
if(r){
if(!_13&&_14[_12.colIndex]){
_13=_14[_12.colIndex].id;
}
r+=" [colid='"+_13+"'].gridxCell";
return _2(r,t.domNode)[0]||null;
}
return null;
},getRowInfo:function(_15){
var t=this,m=t.model,g=t.grid,id=_15.rowId;
if(id){
_15.rowIndex=m.idToIndex(id);
_15.parentId=m.parentId(id);
}
if(typeof _15.rowIndex=="number"&&_15.rowIndex>=0){
_15.visualIndex=g.tree?g.tree.getVisualIndexByRowInfo(_15.parentId,_15.rowIndex,t.rootStart):_15.rowIndex-t.rootStart;
}else{
if(typeof _15.visualIndex=="number"&&_15.visualIndex>=0){
if(g.tree){
var _16=g.tree.getRowInfoByVisualIndex(_15.visualIndex,t.rootStart);
_15.rowIndex=_16.start;
_15.parentId=_16.parentId;
}else{
_15.rowIndex=t.rootStart+_15.visualIndex;
}
}else{
return _15;
}
}
_15.rowId=id||m.indexToId(_15.rowIndex,_15.parentId);
return _15;
},refresh:function(_17){
var t=this;
delete t._err;
return t.model.when({}).then(function(){
var rs=t.renderStart,rc=t.renderCount;
if(typeof _17=="number"&&_17>=0){
_17=rs>_17?rs:_17;
var _18=rs+rc-_17,n=_2("> [visualindex=\""+_17+"\"]",t.domNode)[0],_19=[],_1a=[];
if(n){
var _1b=t._buildRows(_17,_18,_19,_1a);
if(_1b){
_5.place(_1b,n,"before");
_3.forEach(_1a,t.onAfterRow,t);
}
}
while(n){
var tmp=n.nextSibling,_1c=parseInt(n.getAttribute("visualindex"),10),id=n.getAttribute("rowid");
_5.destroy(n);
if(_1c>=_17+_18){
t.onUnrender(id);
}
n=tmp;
}
_7.when(t._buildUncachedRows(_19),function(){
t.onRender(_17,_18);
t.onForcedScroll();
});
}else{
t.renderRows(rs,rc,0,1);
t.onForcedScroll();
}
},function(e){
t._loadFail(e);
});
},refreshCell:function(_1d,_1e){
var d=new _7(),t=this,m=t.model,g=t.grid,col=g._columns[_1e],_1f=col&&t.getCellNode({visualIndex:_1d,colId:col.id});
if(_1f){
var _20,_21=t.getRowInfo({visualIndex:_1d}),idx=_21.rowIndex,pid=_21.parentId;
m.when({start:idx,count:1,parentId:pid},function(){
_20=m.byIndex(idx,pid);
if(_20){
_21.rowId=m.indexToId(idx,pid);
var _22=g.tree&&_20.data[col.id]===undefined;
var _23=g.cell(_21.rowId,col.id,1);
_1f.innerHTML=t._buildCellContent(_23,_22);
t.onAfterCell(_23);
}
}).then(function(){
d.callback(!!_20);
});
return d;
}
d.callback(false);
return d;
},rootStart:0,rootCount:0,renderStart:0,renderCount:0,visualStart:0,visualCount:0,autoUpdate:true,autoChangeSize:true,updateRootRange:function(_24,_25){
var t=this,_26=t.grid.tree,vc=t.visualCount=_26?_26.getVisualSize(_24,_25):_25;
t.rootStart=_24;
t.rootCount=_25;
if(t.renderStart+t.renderCount>vc){
t.renderStart=vc-t.renderCount;
if(t.renderStart<0){
t.renderStart=0;
t.renderCount=vc;
}
}
if(!t.renderCount&&vc){
t.onForcedScroll();
}
},renderRows:function(_27,_28,_29,_2a){
var t=this,g=t.grid,str="",_2b=[],_2c=[],n=t.domNode,en=g.emptyNode,_2d=t.arg("emptyInfo",_c.emptyInfo),_2e="";
if(t._err){
return;
}
if(_28>0){
en.innerHTML=t.arg("loadingInfo",_c.loadingInfo);
en.style.zIndex="";
if(_29!="top"&&_29!="bottom"){
t.model.free();
}
str=t._buildRows(_27,_28,_2b,_2c);
if(_29=="top"){
t.renderCount+=t.renderStart-_27;
t.renderStart=_27;
_5.place(str,n,"first");
}else{
if(_29=="bottom"){
t.renderCount=_27+_28-t.renderStart;
_5.place(str,n,"last");
}else{
t.renderStart=_27;
t.renderCount=_28;
var _2f=_2a?n.scrollTop:0;
n.scrollTop=0;
if(_8("ie")){
while(n.childNodes.length){
n.removeChild(n.firstChild);
}
}
n.innerHTML=str;
if(_2f){
n.scrollTop=_2f;
}
n.scrollLeft=g.hScrollerNode.scrollLeft;
_2e=str?"":_2d;
if(!str){
en.style.zIndex=1;
}
t.onUnrender();
}
}
_3.forEach(_2c,t.onAfterRow,t);
_7.when(t._buildUncachedRows(_2b),function(){
en.innerHTML=_2e;
t.onRender(_27,_28);
});
}else{
if(!{top:1,bottom:1}[_29]){
n.scrollTop=0;
n.innerHTML="";
en.innerHTML=_2d;
en.style.zIndex=1;
t.onUnrender();
t.onEmpty();
t.model.free();
}
}
},unrenderRows:function(_30,_31){
if(_30>0){
var t=this,i=0,id,bn=t.domNode;
if(_31=="post"){
for(;i<_30&&bn.lastChild;++i){
id=bn.lastChild.getAttribute("rowid");
t.model.free(id);
bn.removeChild(bn.lastChild);
t.onUnrender(id);
}
}else{
var tp=bn.scrollTop;
for(;i<_30&&bn.firstChild;++i){
id=bn.firstChild.getAttribute("rowid");
t.model.free(id);
tp-=bn.firstChild.offsetHeight;
bn.removeChild(bn.firstChild);
t.onUnrender(id);
}
t.renderStart+=i;
bn.scrollTop=tp>0?tp:0;
}
t.renderCount-=i;
t.model.when();
}
},onAfterRow:function(){
},onAfterCell:function(){
},onRender:function(){
},onUnrender:function(){
},onDelete:function(){
},onSet:function(){
},onMoveToCell:function(){
},onEmpty:function(){
},onForcedScroll:function(){
},collectCellWrapper:function(){
},_getRowNodeQuery:function(_32){
var r;
if(this.model.isId(_32.rowId)){
r="[rowid='"+_32.rowId+"']";
}else{
if(typeof _32.rowIndex=="number"&&_32.rowIndex>=0){
r="[rowindex='"+_32.rowIndex+"']";
if(_32.parentId){
r+="[parentid='"+_32.parentId+"']";
}
}else{
if(typeof _32.visualIndex=="number"&&_32.visualIndex>=0){
r="[visualindex='"+_32.visualIndex+"']";
}
}
}
return r&&r+".gridxRow";
},_buildRows:function(_33,_34,_35,_36){
var t=this,i,end=_33+_34,s=[],g=t.grid,m=t.model,w=t.domNode.scrollWidth;
for(i=_33;i<end;++i){
var _37=t.getRowInfo({visualIndex:i}),row=g.row(_37.rowId,1);
s.push("<div class=\"gridxRow ",i%2?"gridxRowOdd":"","\" role=\"row\" visualindex=\"",i);
if(row){
m.keep(row.id);
s.push("\" rowid=\"",row.id,"\" rowindex=\"",_37.rowIndex,"\" parentid=\"",_37.parentId,"\">",t._buildCells(row),"</div>");
_36.push(row);
}else{
s.push("\"><div class=\"gridxRowDummy\" style=\"width:",w,"px;\"></div></div>");
_37.start=_37.rowIndex;
_37.count=1;
_35.push(_37);
}
}
return s.join("");
},_buildUncachedRows:function(_38){
var t=this;
return _38.length&&t.model.when(_38,function(){
try{
_3.forEach(_38,t._buildRowContent,t);
}
catch(e){
t._loadFail(e);
}
}).then(null,function(e){
t._loadFail(e);
});
},_loadFail:function(e){
console.error(e);
var en=this.grid.emptyNode;
en.innerHTML=this.arg("loadFailInfo",_c.loadFailInfo);
en.style.zIndex=1;
this.domNode.innerHTML="";
this._err=1;
},_buildRowContent:function(_39){
var t=this,n=_2("> [visualindex=\""+_39.visualIndex+"\"]",t.domNode)[0];
if(n){
var row=t.grid.row(_39.rowIndex,0,_39.parentId);
if(row){
t.model.keep(row.id);
n.setAttribute("rowid",row.id);
n.setAttribute("rowindex",_39.rowIndex);
n.setAttribute("parentid",_39.parentId||"");
n.innerHTML=t._buildCells(row);
t.onAfterRow(row);
}else{
throw new Error("Row is not in cache:"+_39.rowIndex);
}
}
},_buildCells:function(row){
var col,_3a,_3b,cls,_3c,i,len,t=this,g=t.grid,_3d=g._columns,_3e=row.data(),_3f=g.focus&&(g.focus.currentArea()=="body"),sb=["<table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>"];
for(i=0,len=_3d.length;i<len;++i){
col=_3d[i];
_3b=g.tree&&_3e[col.id]===undefined;
_3a=g.cell(row.id,col.id,1);
cls=(_4.isFunction(col["class"])?col["class"](_3a):col["class"])||"";
_3c=(_4.isFunction(col.style)?col.style(_3a):col.style)||"";
sb.push("<td aria-describedby=\"",g.id,"-",col.id,"\" class=\"gridxCell ");
if(_3b){
sb.push("gridxPaddingCell");
}
if(_3f&&t._focusCellRow===row.visualIndex()&&t._focusCellCol===i){
sb.push("gridxCellFocus");
}
sb.push(cls,"\" role=\"gridcell\" tabindex=\"-1\" colid=\"",col.id,"\" style=\"width: ",col.width,"; ",_3c,"\">",t._buildCellContent(_3a,_3b),"</td>");
}
sb.push("</tr></table>");
return sb.join("");
},_buildCellContent:function(_40,_41){
var r="",col=_40.column,row=_40.row,_42=_40.data();
if(!_41){
var s=col.decorator?col.decorator(_42,row.id,row.visualIndex()):_42;
r=this._wrapCellData(s,row.id,col.id);
}
return (r===""||r===null||r===undefined)&&(_8("ie")<8||this.arg("stuffEmptyCell"))?"&nbsp;":r;
},_wrapCellData:function(_43,_44,_45){
var _46=[];
this.collectCellWrapper(_46,_44,_45);
var i=_46.length-1;
if(i>0){
_46.sort(function(a,b){
a.priority=a.priority||0;
b.priority=b.priority||0;
return a.priority-b.priority;
});
}
for(;i>=0;--i){
_43=_46[i].wrap(_43,_44,_45);
}
return _43;
},_onMouseEvent:function(_47,e){
var g=this.grid,_48="onCell"+_47,_49="onRow"+_47;
if(g._isConnected(_48)||g._isConnected(_49)){
this._decorateEvent(e);
if(e.rowId){
if(e.columnId){
g[_48](e);
}
g[_49](e);
}
}
},_decorateEvent:function(e){
var n=e.target||e.originalTarget,g=this.grid,tag;
for(;n&&n!=g.bodyNode;n=n.parentNode){
tag=n.tagName.toLowerCase();
if(tag=="td"&&_6.contains(n,"gridxCell")){
var col=g._columnsById[n.getAttribute("colid")];
e.cellNode=n;
e.columnId=col.id;
e.columnIndex=col.index;
}
if(tag=="div"&&_6.contains(n,"gridxRow")){
e.rowId=n.getAttribute("rowid");
e.parentId=n.getAttribute("parentid");
e.rowIndex=parseInt(n.getAttribute("rowindex"),10);
e.visualIndex=parseInt(n.getAttribute("visualindex"),10);
return;
}
}
},_onSet:function(id,_4a,_4b,_4c){
var t=this;
if(t.autoUpdate&&_4b){
var g=t.grid,row=g.row(id,1),_4d=row&&row.node();
if(_4d){
var _4e=_4b.data,_4f=_4c.data,_50=g._columns,_51=[];
_3.some(_50,function(col){
if(_4e[col.id]!==_4f[col.id]){
_51.push(col);
}
return _51.length>1;
});
if(_51.length>1){
_4d.innerHTML=t._buildCells(row);
t.onAfterRow(row);
t.onSet(row);
t.onRender(_4a,1);
}else{
if(_51.length==1){
var col=_51[0],_52=g.tree&&_4e[col.id]===undefined,_53=row.cell(col.id,1);
_53.node().innerHTML=t._buildCellContent(_53,_52);
t.onAfterCell(_53);
}
}
}
}
},_onDelete:function(id){
var t=this;
if(t.autoUpdate){
var _54=t.getRowNode({rowId:id});
if(_54){
var sn,_55=0,_56=parseInt(_54.getAttribute("rowindex"),10),pid=_54.getAttribute("parentid"),_57={},_58=[_54],rid,ids=[id],_59;
_57[id]=1;
for(sn=_54.nextSibling;sn&&_57[sn.getAttribute("parentid")];sn=sn.nextSibling){
rid=sn.getAttribute("rowid");
ids.push(rid);
_58.push(sn);
_57[rid]=1;
}
for(;sn;sn=sn.nextSibling){
if(sn.getAttribute("parentid")==pid){
sn.setAttribute("rowindex",parseInt(sn.getAttribute("rowindex"),10)-1);
}
_59=parseInt(sn.getAttribute("visualindex"),10)-_58.length;
sn.setAttribute("visualindex",_59);
_6.toggle(sn,"gridxRowOdd",_59%2);
++_55;
}
t.renderCount-=_58.length;
_3.forEach(_58,_5.destroy);
_3.forEach(ids,t.onUnrender,t);
if(t.autoChangeSize&&t.rootStart===0&&!pid){
t.updateRootRange(0,t.rootCount-1);
}
t.onDelete(id,_56);
t.onRender(_56,_55);
}
}
},_onSizeChange:function(_5a,_5b){
var t=this;
if(t.autoChangeSize&&t.rootStart===0&&(t.rootCount===_5b||_5b<0)){
t.updateRootRange(0,_5a);
t.refresh();
}
},_onRowMouseOver:function(e){
var _5c=_2("> div.gridxRowOver",this.domNode)[0],_5d=this.getRowNode({rowId:e.rowId});
if(_5c!=_5d){
if(_5c){
_6.remove(_5c,"gridxRowOver");
}
if(_5d){
_6.add(_5d,"gridxRowOver");
}
}
},_onCellMouseOver:function(e){
_6.toggle(e.cellNode,"gridxCellOver",e.type=="mouseover");
},_focusCellCol:0,_focusCellRow:0,_initFocus:function(){
var t=this,g=t.grid,ltr=g.isLeftToRight(),bn=g.bodyNode,_5e=g.focus,c="connect";
if(_5e){
_5e.registerArea({name:"body",priority:1,focusNode:bn,scope:t,doFocus:t._doFocus,doBlur:t._blurCell,onFocus:t._onFocus,onBlur:t._blurCell});
t[c](g.mainNode,"onkeypress",function(evt){
if(_5e.currentArea()=="body"&&(!g.tree||!evt.ctrlKey)){
_5e._noBlur=1;
var dk=_9,arr={},dir=ltr?1:-1;
arr[dk.LEFT_ARROW]=[0,-dir,evt];
arr[dk.RIGHT_ARROW]=[0,dir,evt];
arr[dk.UP_ARROW]=[-1,0,evt];
arr[dk.DOWN_ARROW]=[1,0,evt];
t._moveFocus.apply(t,arr[evt.keyCode]||[]);
_5e._noBlur=0;
}
});
t[c](g,"onCellClick",function(evt){
t._focusCellRow=evt.visualIndex;
t._focusCellCol=evt.columnIndex;
});
t[c](t,"onRender",function(_5f,_60){
if(t._focusCellRow>=_5f&&t._focusCellRow<_5f+_60&&_5e.currentArea()=="body"){
t._focusCell();
}
});
t[c](g.emptyNode,"onfocus",function(){
_5e.focusArea("body");
});
}
},_doFocus:function(evt){
return this._focusCell(evt)||this._focusCell(0,-1,-1);
},_focusCell:function(evt,_61,_62){
_b.stopEvent(evt);
var t=this,g=t.grid;
_62=_62>=0?_62:t._focusCellCol;
_61=_61>=0?_61:t._focusCellRow;
var _63=g._columns[_62].id,n=t.getCellNode({visualIndex:_61,colId:_63});
if(n){
var _64=_2(".gridxCellFocus",t.domNode)[0];
if(n!=_64){
if(_64){
_6.remove(_64,"gridxCellFocus");
}
_6.add(n,"gridxCellFocus");
t._focusCellRow=_61;
t._focusCellCol=_62;
g.header._focusHeaderId=_63;
}
g.hScroller.scrollToColumn(_63);
if(_8("ie")<8){
var _65=g.bodyNode.scrollLeft;
n.focus();
g.bodyNode.scrollLeft=_65;
}else{
n.focus();
}
}else{
if(!g.rowCount()){
g.emptyNode.focus();
return true;
}
}
return n;
},_moveFocus:function(_66,_67,evt){
if(_66||_67){
_b.stopEvent(evt);
var r,c,t=this,g=t.grid,_68=g._columns,vc=t.visualCount;
r=t._focusCellRow+_66;
r=r<0?0:(r>=vc?vc-1:r);
c=t._focusCellCol+_67;
c=c<0?0:(c>=_68.length?_68.length-1:c);
g.vScroller.scrollToRow(r).then(function(){
t._focusCell(0,r,c);
t.onMoveToCell(r,c,evt);
});
}
},_nextCell:function(r,c,dir,_69){
var d=new _7(),g=this.grid,cc=g._columns.length,rc=this.visualCount;
do{
c+=dir;
if(c<0||c>=cc){
r+=dir;
c=c<0?cc-1:0;
if(r<0){
r=rc-1;
c=cc-1;
}else{
if(r>=rc){
r=0;
c=0;
}
}
}
}while(!_69(r,c));
g.vScroller.scrollToRow(r).then(function(){
d.callback({r:r,c:c});
});
return d;
},_blurCell:function(){
var n=_2(".gridxCellFocus",this.domNode)[0];
if(n){
_6.remove(n,"gridxCellFocus");
}
return true;
},_onFocus:function(evt){
for(var n=evt.target,t=this;n&&n!=t.domNode;n=n.parentNode){
if(_6.contains(n,"gridxCell")){
var _6a=t.grid._columnsById[n.getAttribute("colid")].index;
while(!_6.contains(n,"gridxRow")){
n=n.parentNode;
}
return t._focusCell(0,parseInt(n.getAttribute("visualindex"),10),_6a);
}
}
return false;
}});
});
