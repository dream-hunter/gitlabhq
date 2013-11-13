//>>built
define("gridx/modules/RowHeader",["dojo/_base/declare","dojo/_base/query","dojo/_base/lang","dojo/_base/sniff","dojo/aspect","dojo/dom-construct","dojo/dom-class","dojo/dom-style","dojo/keys","../core/_Module","../util"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b){
return _1(_a,{name:"rowHeader",getAPIPath:function(){
return {rowHeader:this};
},constructor:function(){
this.headerNode=_6.create("div",{"class":"gridxRowHeaderHeader",role:"row",innerHTML:["<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width: ",this.arg("width"),";\"><tr><th class=\"gridxRowHeaderHeaderCell\" role=\"rowheader\" tabindex=\"-1\"></th></tr></table>"].join("")});
this.bodyNode=_6.create("div",{"class":"gridxRowHeaderBody"});
},destroy:function(){
this.inherited(arguments);
this._b.remove();
_6.destroy(this.headerNode);
_6.destroy(this.bodyNode);
},preload:function(){
var t=this,_c=t.headerNode,_d=t.bodyNode,g=t.grid,_e=g.body,w=t.arg("width");
g._initEvents(["RowHeaderHeader","RowHeaderCell"],g._eventNames);
g.header.domNode.appendChild(_c);
_c.style.width=w;
t.headerCellNode=_2("th",_c)[0];
g._connectEvents(_c,"_onHeaderMouseEvent",t);
g.mainNode.appendChild(_d);
_d.style.width=w;
g.hLayout.register(null,_d);
t.batchConnect([_e,"onRender","_onRendered"],[_e,"onAfterRow","_onAfterRow"],[_e,"onAfterCell","_onAfterCell"],[_e,"onUnrender","_onUnrender"],[g.bodyNode,"onscroll","_onScroll"],[g,"onRowMouseOver","_onRowMouseOver"],[g,"onRowMouseOut","_onRowMouseOver"],[g,"_onResizeEnd","_onResize"],g.columnWidth&&[g.columnWidth,"onUpdate","_onResize"],g.columnResizer&&[g.columnResizer,"onResize","_onResize"],[g,"onRowHeaderCellMouseOver","_onCellMouseOver"],[g,"onRowHeaderCellMouseOut","_onCellMouseOver"]);
t._b=_5.before(_e,"renderRows",_3.hitch(t,t._onRenderRows),true);
g._connectEvents(_d,"_onBodyMouseEvent",t);
t._initFocus();
},load:function(_f,_10){
var t=this,bn=t.bodyNode;
_10.then(function(){
bn.style[t.grid.isLeftToRight()?"left":"right"]=-bn.offsetWidth+"px";
t.loaded.callback();
});
},width:"20px",onMoveToRowHeaderCell:function(){
},_onRenderRows:function(_11,_12,_13){
var nd=this.bodyNode;
if(_12>0){
var str=this._buildRows(_11,_12);
if(_13=="top"){
_6.place(str,nd,"first");
}else{
if(_13=="bottom"){
_6.place(str,nd,"last");
}else{
nd.innerHTML=str;
nd.scrollTop=0;
}
}
}else{
if(_13!="top"&&_13!="bottom"){
nd.innerHTML="";
}
}
},_onAfterRow:function(row){
var t=this,_14=row.visualIndex(),n=_2("[visualindex=\""+_14+"\"].gridxRowHeaderRow",t.bodyNode)[0],bn=_2("[visualindex=\""+_14+"\"].gridxRow .gridxRowTable",t.grid.bodyNode)[0],nt=n.firstChild,cp=t.arg("cellProvider");
n.setAttribute("rowid",row.id);
n.setAttribute("rowindex",row.index());
n.setAttribute("parentid",t.model.treePath(row.id).pop()||"");
if(cp){
nt.firstChild.firstChild.firstChild.innerHTML=cp.call(t,row);
}
t._syncRowHeight(nt,bn);
},_onAfterCell:function(_15){
var t=this,_16=_15.row.visualIndex(),n=_2("[visualindex=\""+_16+"\"].gridxRowHeaderRow",t.bodyNode)[0],bn=_2("[visualindex=\""+_16+"\"].gridxRow .gridxRowTable",t.grid.bodyNode)[0];
t._syncRowHeight(n.firstChild,bn);
},_syncRowHeight:function(_17,_18){
function _19(){
return _4("ie")?_18.offsetHeight+"px":_8.getComputedStyle(_18).height;
};
_17.style.height=_19();
setTimeout(function(){
_17.style.height=_19();
},0);
},_onRendered:function(_1a,_1b){
var t=this,hp=t.arg("headerProvider");
if(hp){
t.headerCellNode.innerHTML=hp();
}
t._onScroll();
},_onUnrender:function(id){
var _1c=id&&_2("[rowid=\""+id+"\"].gridxRowHeaderRow",this.bodyNode);
if(_1c&&_1c.length){
_6.destroy(_1c[_1c.length-1]);
}
},_onScroll:function(){
this.bodyNode.scrollTop=this.grid.bodyNode.scrollTop;
},_onResize:function(){
for(var bn=this.grid.bodyNode.firstChild,n=this.bodyNode.firstChild;bn&&n;bn=bn.nextSibling,n=n.nextSibling){
n.firstChild.style.height=bn.firstChild.offsetHeight+"px";
}
},_buildRows:function(_1d,_1e){
var sb=[];
for(var i=0;i<_1e;++i){
sb.push("<div class=\"gridxRowHeaderRow\" role=\"row\" visualindex=\"",_1d+i,"\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"height: 24px;\"><tr><td class=\"gridxRowHeaderCell\" role=\"rowheader\" tabindex=\"-1\"></td></tr></table></div>");
}
return sb.join("");
},_onHeaderMouseEvent:function(_1f,e){
var g=this.grid,_20="onRowHeaderHeader"+_1f,_21="onHeader"+_1f;
if(g._isConnected(_20)){
g[_20](e);
}
if(g._isConnected(_21)){
g[_21](e);
}
},_onBodyMouseEvent:function(_22,e){
var g=this.grid,_23="onRowHeaderCell"+_22,_24="onRow"+_22,_25=g._isConnected(_23),_26=g._isConnected(_24);
if(_25||_26){
this._decorateBodyEvent(e);
if(e.rowIndex>=0){
if(e.isRowHeader&&_25){
g[_23](e);
}
if(_26){
g[_24](e);
}
}
}
},_decorateBodyEvent:function(e){
var _27=e.target||e.originalTarget;
while(_27&&_27!=this.bodyNode){
if(_7.contains(_27,"gridxRowHeaderCell")){
e.isRowHeader=true;
e.rowHeaderCellNode=_27;
}else{
if(_27.tagName.toLowerCase()==="div"&&_7.contains(_27,"gridxRowHeaderRow")){
e.rowId=_27.getAttribute("rowid");
e.parentId=_27.getAttribute("parentid");
e.rowIndex=parseInt(_27.getAttribute("rowindex"),10);
e.visualIndex=parseInt(_27.getAttribute("visualindex"),10);
return;
}
}
_27=_27.parentNode;
}
},_onRowMouseOver:function(e){
var _28=_2("> [rowid=\""+e.rowId+"\"].gridxRowHeaderRow",this.bodyNode)[0];
if(_28){
_7.toggle(_28,"gridxRowOver",e.type.toLowerCase()=="mouseover");
}
},_onCellMouseOver:function(e){
var _29=_2("> [rowid=\""+e.rowId+"\"].gridxRowHeaderRow .gridxRowHeaderCell",this.bodyNode)[0];
if(_29){
_7.toggle(_29,"gridxRowHeaderCellOver",e.type.toLowerCase()=="mouseover");
}
},_initFocus:function(){
var t=this,_2a=t.grid.focus;
if(_2a){
_2a.registerArea({name:"rowHeader",priority:0.9,focusNode:t.bodyNode,scope:t,doFocus:t._doFocus,onFocus:t._onFocus,doBlur:t._blur,onBlur:t._blur,connects:[t.connect(t.bodyNode,"onkeydown","_onKeyDown")]});
}
},_doFocus:function(evt){
if(this._focusRow(this.grid.body._focusCellRow)){
_b.stopEvent(evt);
return true;
}
},_onFocus:function(evt){
var t=this,_2b=evt.target;
while(_2b!=t.bodyNode){
if(_7.contains(_2b,"gridxRowHeaderRow")){
var r=t.grid.body._focusCellRow=parseInt(_2b.getAttribute("visualindex"),10);
t._focusRow(r);
return true;
}
_2b=_2b.parentNode;
}
},_focusRow:function(_2c){
var t=this,_2d=_2("[visualindex=\""+_2c+"\"] .gridxRowHeaderCell",t.bodyNode)[0];
t._blur();
_2d=_2d||t.bodyNode.firstChild;
if(_2d){
_7.add(_2d,"gridxCellFocus");
_2d.focus();
}
return _2d;
},_blur:function(){
_2(".gridxCellFocus",this.bodyNode).forEach(function(_2e){
_7.remove(_2e,"gridxCellFocus");
});
return true;
},_onKeyDown:function(evt){
var t=this,g=t.grid;
if(g.focus.currentArea()=="rowHeader"&&evt.keyCode==_9.UP_ARROW||evt.keyCode==_9.DOWN_ARROW){
_b.stopEvent(evt);
var _2f=evt.keyCode==_9.UP_ARROW?-1:1,_30=g.body,r=_30._focusCellRow+_2f;
_30._focusCellRow=r=r<0?0:(r>=_30.visualCount?_30.visualCount-1:r);
g.vScroller.scrollToRow(r).then(function(){
t._focusRow(r);
t.onMoveToRowHeaderCell(r,evt);
});
}
}});
});
