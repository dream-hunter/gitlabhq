//>>built
define("gridx/modules/VScroller",["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/event","dojo/_base/sniff","dojo/_base/query","dojo/dom-geometry","dojo/keys","dojox/html/metrics","../core/_Module"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){
var st="scrollTop";
return _1(_9,{name:"vScroller",forced:["body","vLayout","columnWidth"],optional:["pagination"],getAPIPath:function(){
return {vScroller:this};
},constructor:function(){
var t=this,g=t.grid,dn=t.domNode=g.vScrollerNode;
t.stubNode=dn.firstChild;
if(g.autoHeight){
dn.style.display="none";
if(_4("ie")<8){
dn.style.width="0px";
}
}else{
var w=_8.getScrollbar().w+"px";
dn.style.width=w;
dn.style[g.isLeftToRight()?"right":"left"]=-_8.getScrollbar().w+"px";
if(_4("ie")<8){
t.stubNode.style.width=w;
}
}
},preload:function(_a){
this.grid.hLayout.register(null,this.domNode,1);
},load:function(_b,_c){
var t=this,g=t.grid,bd=g.body,dn=t.domNode,bn=g.bodyNode;
t.batchConnect([t.domNode,"onscroll","_doScroll"],[bn,"onmousewheel","_onMouseWheel"],[g.mainNode,"onkeypress","_onKeyScroll"],_4("ff")&&[bn,"DOMMouseScroll","_onMouseWheel"]);
t.aspect(g,"_onResizeEnd","_onBodyChange");
t.aspect(bd,"onForcedScroll","_onForcedScroll");
t.aspect(bd,"onRender","_onBodyChange");
if(!g.autoHeight){
t.aspect(bd,"onEmpty",function(){
var ds=dn.style;
ds.display="none";
ds.width="";
if(_4("ie")<8){
ds.width=t.stub.style.width="0px";
}
g.hLayout.reLayout();
g.hScroller.refresh();
});
}
_c.then(function(){
_2.when(t._init(_b),function(){
t.domNode.style.width="";
t.loaded.callback();
});
});
},scrollToRow:function(_d,_e){
var d=new _2(),bn=this.grid.bodyNode,dn=this.domNode,_f=0,n=_5("[visualindex=\""+_d+"\"]",bn)[0];
if(n){
var no=n.offsetTop,bs=bn[st];
if(_e){
dn[st]=no;
d.callback(true);
return d;
}else{
if(no<bs){
_f=no-bs;
}else{
if(no+n.offsetHeight>bs+bn.clientHeight){
_f=no+n.offsetHeight-bs-bn.clientHeight;
}else{
d.callback(true);
return d;
}
}
}
dn[st]+=_f;
}
d.callback(!!n);
return d;
},_init:function(){
this._onForcedScroll();
},_update:function(){
var t=this,g=t.grid;
if(!g.autoHeight){
var bd=g.body,bn=g.bodyNode,_10=bd.renderCount<bd.visualCount||bn.scrollHeight>bn.clientHeight,ds=t.domNode.style;
scrollBarWidth=_8.getScrollbar().w+(_4("webkit")?1:0);
if(_4("ie")<8){
var w=_10?scrollBarWidth+"px":"0px";
t.stubNode.style.width=w;
ds.width=w;
}else{
ds.width="";
}
ds.display=_10?"":"none";
ds[g.isLeftToRight()?"right":"left"]=-t.domNode.offsetWidth+"px";
}
g.hLayout.reLayout();
},_doScroll:function(){
this.grid.bodyNode[st]=this.domNode[st];
},_onMouseWheel:function(e){
if(this.grid.vScrollerNode.style.display!="none"){
var _11=typeof e.wheelDelta==="number"?e.wheelDelta/3:(-40*e.detail);
this.domNode[st]-=_11;
_3.stop(e);
}
},_onBodyChange:function(){
var t=this,g=t.grid;
t._update();
setTimeout(function(){
if(!g.bodyNode){
return;
}
t.stubNode.style.height=g.bodyNode.scrollHeight+"px";
t._doScroll();
g.vScrollerNode[st]=g.vScrollerNode[st]||0;
},0);
},_onForcedScroll:function(){
var t=this,bd=t.grid.body;
return t.model.when({start:bd.rootStart,count:bd.rootCount},function(){
bd.renderRows(0,bd.visualCount);
});
},_onKeyScroll:function(evt){
var t=this,g=t.grid,bd=g.body,bn=g.bodyNode,_12=g.focus,sn=t.domNode,_13;
if(bn.childNodes.length&&(!_12||_12.currentArea()=="body")){
if(evt.keyCode==_7.HOME){
sn[st]=0;
_13=bn.firstChild;
}else{
if(evt.keyCode==_7.END){
sn[st]=sn.scrollHeight-sn.offsetHeight;
_13=bn.lastChild;
}else{
if(evt.keyCode==_7.PAGE_UP){
if(!sn[st]){
_13=bn.firstChild;
}else{
sn[st]-=sn.offsetHeight;
}
}else{
if(evt.keyCode==_7.PAGE_DOWN){
if(sn[st]>=sn.scrollHeight-sn.offsetHeight){
_13=bn.lastChild;
}else{
sn[st]+=sn.offsetHeight;
}
}else{
return;
}
}
}
}
if(_12){
if(_13){
bd._focusCellRow=parseInt(_13.getAttribute("visualindex"),10);
_12.focusArea("body",1);
}else{
setTimeout(function(){
var _14=bn.childNodes,_15=0,end=_14.length-1,_16=_6.position(bn),i,p,_17=function(idx){
var rn=_14[idx],pos=_6.position(rn);
if(evt.keyCode==_7.PAGE_DOWN){
var _18=rn.previousSibling;
if((!_18&&pos.y>=_16.y)||pos.y==_16.y){
return 0;
}else{
if(!_18){
return -1;
}else{
var _19=_6.position(_18);
if(_19.y<_16.y&&_19.y+_19.h>=_16.y){
return 0;
}else{
if(_19.y>_16.y){
return 1;
}else{
return -1;
}
}
}
}
}else{
var _1a=rn.nextSibling;
if((!_1a&&pos.y+pos.h<=_16.y+_16.h)||pos.y+pos.h==_16.y+_16.h){
return 0;
}else{
if(!_1a){
return 1;
}else{
var _1b=_6.position(_1a);
if(_1b.y<=_16.y+_16.h&&_1b.y+_1b.h>_16.y+_16.h){
return 0;
}else{
if(_1b.y>_16.y+_16.h){
return 1;
}else{
return -1;
}
}
}
}
}
};
while(_15<=end){
i=Math.floor((_15+end)/2);
p=_17(i);
if(p<0){
_15=i+1;
}else{
if(p>0){
end=i-1;
}else{
_13=_14[i];
break;
}
}
}
if(_13){
bd._focusCellRow=parseInt(_13.getAttribute("visualindex"),10);
_12.focusArea("body",1);
}
},0);
}
}
_3.stop(evt);
}
}});
});
