//>>built
define("gridx/modules/ColumnWidth",["dojo/_base/declare","dojo/_base/array","dojo/_base/Deferred","dojo/_base/query","dojo/_base/sniff","dojo/dom-geometry","dojo/dom-class","dojo/dom-style","dojo/keys","../core/_Module"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){
return _1(_a,{name:"columnWidth",forced:["hLayout"],getAPIPath:function(){
return {columnWidth:this};
},constructor:function(){
this._init();
},preload:function(){
var t=this,g=t.grid;
t._ready=new _3();
t.batchConnect([g.hLayout,"onUpdateWidth","_onUpdateWidth"],[g,"setColumns","_onSetColumns"]);
},load:function(){
this._adaptWidth();
this.loaded.callback();
},"default":60,autoResize:false,onUpdate:function(){
},_init:function(){
var t=this,g=t.grid,dn=g.domNode,_b=g._columns;
_2.forEach(_b,function(_c){
if(!_c.hasOwnProperty("declaredWidth")){
_c.declaredWidth=_c.width=_c.width||"auto";
}
});
if(g.autoWidth){
_2.forEach(_b,function(c){
if(c.declaredWidth=="auto"){
c.width=t.arg("default")+"px";
}
});
}else{
if(t.arg("autoResize")){
_7.add(dn,"gridxPercentColumnWidth");
_2.forEach(_b,function(c){
if(!(/%$/).test(c.declaredWidth)){
c.width="auto";
}
});
}
}
},_onUpdateWidth:function(){
var t=this,g=t.grid;
if(g.autoWidth){
t._adaptWidth();
}else{
var _d=g.hScrollerNode.style.display=="none";
t._adaptWidth(!_d,1);
if(!t.arg("autoResize")&&_d){
_4(".gridxCell",g.bodyNode).forEach(function(_e){
var _f=g._columnsById[_e.getAttribute("colId")];
if(t.arg("autoResize")||!_f.declaredWidth||_f.declaredWidth=="auto"||(/%$/).test(_f.declaredWidth)){
_e.style.width=_f.width;
}
});
}
t.onUpdate();
}
},_adaptWidth:function(_10,_11){
var t=this,g=t.grid,dn=g.domNode,_12=g.header,ltr=g.isLeftToRight(),_13=ltr?"marginLeft":"marginRight",_14=ltr?"marginRight":"marginLeft",_15=g.hLayout.lead,_16=g.hLayout.tail,_17=_12.innerNode,bs=g.bodyNode.style,hs=_17.style,_18=(dn.clientWidth||_8.get(dn,"width"))-_15-_16,_19=_4(".gridxCell",_17)[0],_1a=_19?_6.getMarginBox(_19).w-_6.getContentBox(_19).w:0,_1b=!dn.offsetHeight,_1c=_19&&_8.get(_19,"borderCollapse")=="collapse",_1d=_1c&&_15>0?(_15-1):_15;
hs[_13]=_1d+"px";
hs[_14]=(!_1c&&_16>0?_16-1:0)+"px";
g.mainNode.style[_13]=_1d+"px";
g.mainNode.style[_14]=_16+"px";
_18=_18<0?0:_18;
if(_10){
t.onUpdate();
return;
}
if(_1c){
_1a+=_1b?-1:1;
}
if(g.autoWidth){
var _1e=_4("th.gridxCell",_17),_1f=_1c?2:0;
_1e.forEach(function(_20){
var w=_8.get(_20,"width");
if(!_5("safari")||!_1b){
w+=_1a;
}
_1f+=w;
if(_1c){
_1f--;
}
var c=g._columnsById[_20.getAttribute("colid")];
if(c.width=="auto"||(/%$/).test(c.width)){
_20.style.width=c.width=w+"px";
}
});
bs.width=_1f+"px";
dn.style.width=(_15+_16+_1f)+"px";
}else{
if(!t.arg("autoResize")){
var _21=[],_22=g._columns,_23=_1c?2:0;
_2.forEach(_22,function(c){
if(c.declaredWidth=="auto"){
_21.push(c);
}else{
if(/%$/.test(c.declaredWidth)){
var w=parseInt(_18*parseFloat(c.declaredWidth,10)/100-(_5("safari")?(_1c?1:0):_1a),10);
if(w<0){
w=0;
}
_12.getHeaderNode(c.id).style.width=c.width=w+"px";
}
}
});
_2.forEach(_22,function(c){
if(c.declaredWidth!="auto"){
var w=_5("safari")?parseFloat(_12.getHeaderNode(c.id).style.width,10):_8.get(_12.getHeaderNode(c.id),"width");
if(/%$/.test(c.declaredWidth)){
c.width=w+"px";
}
if(!_5("safari")){
w+=_1a;
}
_23+=w;
}
});
if(_21.length){
if(_5("safari")){
_1a=0;
}
var w=_18>_23?((_18-_23)/_21.length-_1a):t.arg("default"),ww=parseInt(w,10);
if(_18>_23){
if(_1c){
w+=_22.length/_21.length;
if(_5("ie")<8){
w+=_22.length/_21.length;
}
}
ww=_18-_23-(ww+_1a)*(_21.length-1)-_1a;
}
w=parseInt(w,10);
if(w<0){
w=0;
}
if(ww<0){
ww=0;
}
_2.forEach(_21,function(c,i){
_12.getHeaderNode(c.id).style.width=c.width=(i<_21.length-1?w:ww)+"px";
});
}
}
}
g.hScroller.scroll(0);
_12._onHScroll(0);
g.vLayout.reLayout();
if(!_11){
t.onUpdate();
}
},_onSetColumns:function(){
var t=this,g=t.grid;
t._init();
g.header.refresh();
t._adaptWidth();
if(g.cellWidget){
g.cellWidget._init();
if(g.edit){
g.edit._init();
}
}
if(g.tree){
g.tree._initExpandLevel();
}
g.body.refresh();
}});
});
