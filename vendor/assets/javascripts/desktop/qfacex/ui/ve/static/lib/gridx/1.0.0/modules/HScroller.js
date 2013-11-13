//>>built
define("gridx/modules/HScroller",["dojo/_base/declare","dojo/dom-style","dojo/_base/sniff","dojo/_base/Deferred","dojo/query","dojox/html/metrics","../core/_Module"],function(_1,_2,_3,_4,_5,_6,_7){
return _1(_7,{name:"hScroller",getAPIPath:function(){
return {hScroller:this};
},constructor:function(){
var t=this,g=t.grid,n=g.hScrollerNode;
g._initEvents(["H"],["Scroll"]);
t.domNode=n;
t.container=n.parentNode;
t.stubNode=n.firstChild;
},preload:function(){
var t=this,g=t.grid,n=g.hScrollerNode;
if(!g.autoWidth){
g.vLayout.register(t,"container","footerNode",0);
n.style.display="block";
t.batchConnect([g.columnWidth,"onUpdate","refresh"],[n,"onscroll","_onScroll"]);
if(_3("ie")){
n.style.height=_6.getScrollbar().h+"px";
}
}
},scroll:function(_8){
var dn=this.domNode;
if((_3("webkit")||_3("ie")<8)&&!this.grid.isLeftToRight()){
_8=dn.scrollWidth-dn.offsetWidth-_8;
}
if((_3("ff"))&&!this.grid.isLeftToRight()&&_8>0){
_8=-_8;
}
dn.scrollLeft=_8;
},scrollToColumn:function(_9){
var _a=this.grid.header.innerNode,_b=_5("table",_a)[0],_c=_b.rows[0].cells,_d=0,_e=0,_f=this.grid.isLeftToRight(),_10=this.domNode.scrollLeft;
if(!_f&&(_3("webkit")||_3("ie")<8)){
_10=this.domNode.scrollWidth-_10-_a.offsetWidth;
}
_10=Math.abs(_10);
for(var i=0;i<_c.length;i++){
_e+=_c[i].offsetWidth;
if(_c[i].getAttribute("colid")==_9){
break;
}
_d+=_c[i].offsetWidth;
}
if(_d<_10){
this.scroll(_d);
}else{
if(_e>_10+_a.offsetWidth){
this.scroll(_e-_a.offsetWidth);
}
}
},refresh:function(){
var t=this,g=t.grid,ltr=g.isLeftToRight(),_11=ltr?"marginLeft":"marginRight",_12=ltr?"marginRight":"marginLeft",_13=g.hLayout.lead,_14=g.hLayout.tail,w=(g.domNode.clientWidth||_2.get(g.domNode,"width"))-_13-_14,bn=g.header.innerNode,pl=_2.get(bn,ltr?"paddingLeft":"paddingRight")||0,s=t.domNode.style,sw=bn.firstChild.offsetWidth+pl,_15=s.display,_16=(sw<=w)?"none":"block";
s[_11]=_13+pl+"px";
s[_12]=_14+"px";
s.width=(w-pl<0?0:w-pl)+"px";
t.stubNode.style.width=(sw-pl<0?0:sw-pl)+"px";
s.display=_16;
if(_15!=_16){
g.vLayout.reLayout();
}
},_lastLeft:0,_onScroll:function(e){
var t=this,s=t.domNode.scrollLeft;
if((_3("webkit")||_3("ie")<8)&&!t.grid.isLeftToRight()){
s=t.domNode.scrollWidth-t.domNode.offsetWidth-s;
}
if(t._lastLeft!=s){
t._lastLeft=s;
t._doScroll();
}
},_doScroll:function(_17){
var t=this,g=t.grid;
g.bodyNode.scrollLeft=t.domNode.scrollLeft;
g.onHScroll(t._lastLeft);
}});
});
