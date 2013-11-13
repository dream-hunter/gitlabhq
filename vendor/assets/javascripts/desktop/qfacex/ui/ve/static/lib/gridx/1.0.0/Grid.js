/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

//>>built
require({cache:{"gridx/core/model/_Extension":function(){
define("gridx/core/model/_Extension",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/aspect"],function(_1,_2,_3,_4){
return _1([],{constructor:function(_5){
var t=this,i=t.inner=_5._model;
t._cnnts=[];
t.model=_5;
_5._model=t;
if(i){
t.aspect(i,"onDelete","_onDelete");
t.aspect(i,"onNew","_onNew");
t.aspect(i,"onSet","_onSet");
}
},destroy:function(){
_3.forEach(this._cnnts,function(_6){
_6.remove();
});
},aspect:function(_7,e,_8,_9,_a){
var _b=_4[_a||"after"](_7,e,_2.hitch(_9||this,_8),1);
this._cnnts.push(_b);
return _b;
},_onNew:function(){
this.onNew.apply(this,arguments);
},_onSet:function(){
this.onSet.apply(this,arguments);
},_onDelete:function(){
this.onDelete.apply(this,arguments);
},onNew:function(){
},onDelete:function(){
},onSet:function(){
},_call:function(_c,_d){
var t=this,m=t[_c],n=t.inner;
return m?m.apply(t,_d||[]):n&&n._call(_c,_d);
},_mixinAPI:function(){
var i,m=this.model,_e=arguments,_f=function(_10){
return function(){
return m._model._call(_10,arguments);
};
};
for(i=_e.length-1;i>=0;--i){
m[_e[i]]=_f(_e[i]);
}
}});
});
},"dojo/dnd/Selector":function(){
define("dojo/dnd/Selector",["../_base/array","../_base/declare","../_base/event","../_base/kernel","../_base/lang","../dom","../dom-construct","../mouse","../_base/NodeList","../on","../touch","./common","./Container"],function(_11,_12,_13,_14,_15,dom,_16,_17,_18,on,_19,dnd,_1a){
var _1b=_12("dojo.dnd.Selector",_1a,{constructor:function(_1c,_1d){
if(!_1d){
_1d={};
}
this.singular=_1d.singular;
this.autoSync=_1d.autoSync;
this.selection={};
this.anchor=null;
this.simpleSelection=false;
this.events.push(on(this.node,_19.press,_15.hitch(this,"onMouseDown")),on(this.node,_19.release,_15.hitch(this,"onMouseUp")));
},singular:false,getSelectedNodes:function(){
var t=new _18();
var e=dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
t.push(dom.byId(i));
}
return t;
},selectNone:function(){
return this._removeSelection()._removeAnchor();
},selectAll:function(){
this.forInItems(function(_1e,id){
this._addItemClass(dom.byId(id),"Selected");
this.selection[id]=1;
},this);
return this._removeAnchor();
},deleteSelectedNodes:function(){
var e=dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
var n=dom.byId(i);
this.delItem(i);
_16.destroy(n);
}
this.anchor=null;
this.selection={};
return this;
},forInSelectedItems:function(f,o){
o=o||_14.global;
var s=this.selection,e=dnd._empty;
for(var i in s){
if(i in e){
continue;
}
f.call(o,this.getItem(i),i,this);
}
},sync:function(){
_1b.superclass.sync.call(this);
if(this.anchor){
if(!this.getItem(this.anchor.id)){
this.anchor=null;
}
}
var t=[],e=dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
if(!this.getItem(i)){
t.push(i);
}
}
_11.forEach(t,function(i){
delete this.selection[i];
},this);
return this;
},insertNodes:function(_1f,_20,_21,_22){
var _23=this._normalizedCreator;
this._normalizedCreator=function(_24,_25){
var t=_23.call(this,_24,_25);
if(_1f){
if(!this.anchor){
this.anchor=t.node;
this._removeItemClass(t.node,"Selected");
this._addItemClass(this.anchor,"Anchor");
}else{
if(this.anchor!=t.node){
this._removeItemClass(t.node,"Anchor");
this._addItemClass(t.node,"Selected");
}
}
this.selection[t.node.id]=1;
}else{
this._removeItemClass(t.node,"Selected");
this._removeItemClass(t.node,"Anchor");
}
return t;
};
_1b.superclass.insertNodes.call(this,_20,_21,_22);
this._normalizedCreator=_23;
return this;
},destroy:function(){
_1b.superclass.destroy.call(this);
this.selection=this.anchor=null;
},onMouseDown:function(e){
if(this.autoSync){
this.sync();
}
if(!this.current){
return;
}
if(!this.singular&&!dnd.getCopyKeyState(e)&&!e.shiftKey&&(this.current.id in this.selection)){
this.simpleSelection=true;
if(_17.isLeft(e)){
_13.stop(e);
}
return;
}
if(!this.singular&&e.shiftKey){
if(!dnd.getCopyKeyState(e)){
this._removeSelection();
}
var c=this.getAllNodes();
if(c.length){
if(!this.anchor){
this.anchor=c[0];
this._addItemClass(this.anchor,"Anchor");
}
this.selection[this.anchor.id]=1;
if(this.anchor!=this.current){
var i=0,_26;
for(;i<c.length;++i){
_26=c[i];
if(_26==this.anchor||_26==this.current){
break;
}
}
for(++i;i<c.length;++i){
_26=c[i];
if(_26==this.anchor||_26==this.current){
break;
}
this._addItemClass(_26,"Selected");
this.selection[_26.id]=1;
}
this._addItemClass(this.current,"Selected");
this.selection[this.current.id]=1;
}
}
}else{
if(this.singular){
if(this.anchor==this.current){
if(dnd.getCopyKeyState(e)){
this.selectNone();
}
}else{
this.selectNone();
this.anchor=this.current;
this._addItemClass(this.anchor,"Anchor");
this.selection[this.current.id]=1;
}
}else{
if(dnd.getCopyKeyState(e)){
if(this.anchor==this.current){
delete this.selection[this.anchor.id];
this._removeAnchor();
}else{
if(this.current.id in this.selection){
this._removeItemClass(this.current,"Selected");
delete this.selection[this.current.id];
}else{
if(this.anchor){
this._removeItemClass(this.anchor,"Anchor");
this._addItemClass(this.anchor,"Selected");
}
this.anchor=this.current;
this._addItemClass(this.current,"Anchor");
this.selection[this.current.id]=1;
}
}
}else{
if(!(this.current.id in this.selection)){
this.selectNone();
this.anchor=this.current;
this._addItemClass(this.current,"Anchor");
this.selection[this.current.id]=1;
}
}
}
}
_13.stop(e);
},onMouseUp:function(){
if(!this.simpleSelection){
return;
}
this.simpleSelection=false;
this.selectNone();
if(this.current){
this.anchor=this.current;
this._addItemClass(this.anchor,"Anchor");
this.selection[this.current.id]=1;
}
},onMouseMove:function(){
this.simpleSelection=false;
},onOverEvent:function(){
this.onmousemoveEvent=on(this.node,_19.move,_15.hitch(this,"onMouseMove"));
},onOutEvent:function(){
if(this.onmousemoveEvent){
this.onmousemoveEvent.remove();
delete this.onmousemoveEvent;
}
},_removeSelection:function(){
var e=dnd._empty;
for(var i in this.selection){
if(i in e){
continue;
}
var _27=dom.byId(i);
if(_27){
this._removeItemClass(_27,"Selected");
}
}
this.selection={};
return this;
},_removeAnchor:function(){
if(this.anchor){
this._removeItemClass(this.anchor,"Anchor");
this.anchor=null;
}
return this;
}});
return _1b;
});
},"gridx/modules/VScroller":function(){
define("gridx/modules/VScroller",["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/event","dojo/_base/sniff","dojo/_base/query","dojo/dom-geometry","dojo/keys","dojox/html/metrics","../core/_Module"],function(_28,_29,_2a,_2b,_2c,_2d,_2e,_2f,_30){
var st="scrollTop";
return _28(_30,{name:"vScroller",forced:["body","vLayout","columnWidth"],optional:["pagination"],getAPIPath:function(){
return {vScroller:this};
},constructor:function(){
var t=this,g=t.grid,dn=t.domNode=g.vScrollerNode;
t.stubNode=dn.firstChild;
if(g.autoHeight){
dn.style.display="none";
if(_2b("ie")<8){
dn.style.width="0px";
}
}else{
var w=_2f.getScrollbar().w+"px";
dn.style.width=w;
dn.style[g.isLeftToRight()?"right":"left"]=-_2f.getScrollbar().w+"px";
if(_2b("ie")<8){
t.stubNode.style.width=w;
}
}
},preload:function(_31){
this.grid.hLayout.register(null,this.domNode,1);
},load:function(_32,_33){
var t=this,g=t.grid,bd=g.body,dn=t.domNode,bn=g.bodyNode;
t.batchConnect([t.domNode,"onscroll","_doScroll"],[bn,"onmousewheel","_onMouseWheel"],[g.mainNode,"onkeypress","_onKeyScroll"],_2b("ff")&&[bn,"DOMMouseScroll","_onMouseWheel"]);
t.aspect(g,"_onResizeEnd","_onBodyChange");
t.aspect(bd,"onForcedScroll","_onForcedScroll");
t.aspect(bd,"onRender","_onBodyChange");
if(!g.autoHeight){
t.aspect(bd,"onEmpty",function(){
var ds=dn.style;
ds.display="none";
ds.width="";
if(_2b("ie")<8){
ds.width=t.stub.style.width="0px";
}
g.hLayout.reLayout();
g.hScroller.refresh();
});
}
_33.then(function(){
_29.when(t._init(_32),function(){
t.domNode.style.width="";
t.loaded.callback();
});
});
},scrollToRow:function(_34,_35){
var d=new _29(),bn=this.grid.bodyNode,dn=this.domNode,dif=0,n=_2c("[visualindex=\""+_34+"\"]",bn)[0];
if(n){
var no=n.offsetTop,bs=bn[st];
if(_35){
dn[st]=no;
d.callback(true);
return d;
}else{
if(no<bs){
dif=no-bs;
}else{
if(no+n.offsetHeight>bs+bn.clientHeight){
dif=no+n.offsetHeight-bs-bn.clientHeight;
}else{
d.callback(true);
return d;
}
}
}
dn[st]+=dif;
}
d.callback(!!n);
return d;
},_init:function(){
this._onForcedScroll();
},_update:function(){
var t=this,g=t.grid;
if(!g.autoHeight){
var bd=g.body,bn=g.bodyNode,_36=bd.renderCount<bd.visualCount||bn.scrollHeight>bn.clientHeight,ds=t.domNode.style;
scrollBarWidth=_2f.getScrollbar().w+(_2b("webkit")?1:0);
if(_2b("ie")<8){
var w=_36?scrollBarWidth+"px":"0px";
t.stubNode.style.width=w;
ds.width=w;
}else{
ds.width="";
}
ds.display=_36?"":"none";
ds[g.isLeftToRight()?"right":"left"]=-t.domNode.offsetWidth+"px";
}
g.hLayout.reLayout();
},_doScroll:function(){
this.grid.bodyNode[st]=this.domNode[st];
},_onMouseWheel:function(e){
if(this.grid.vScrollerNode.style.display!="none"){
var _37=typeof e.wheelDelta==="number"?e.wheelDelta/3:(-40*e.detail);
this.domNode[st]-=_37;
_2a.stop(e);
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
var t=this,g=t.grid,bd=g.body,bn=g.bodyNode,_38=g.focus,sn=t.domNode,_39;
if(bn.childNodes.length&&(!_38||_38.currentArea()=="body")){
if(evt.keyCode==_2e.HOME){
sn[st]=0;
_39=bn.firstChild;
}else{
if(evt.keyCode==_2e.END){
sn[st]=sn.scrollHeight-sn.offsetHeight;
_39=bn.lastChild;
}else{
if(evt.keyCode==_2e.PAGE_UP){
if(!sn[st]){
_39=bn.firstChild;
}else{
sn[st]-=sn.offsetHeight;
}
}else{
if(evt.keyCode==_2e.PAGE_DOWN){
if(sn[st]>=sn.scrollHeight-sn.offsetHeight){
_39=bn.lastChild;
}else{
sn[st]+=sn.offsetHeight;
}
}else{
return;
}
}
}
}
if(_38){
if(_39){
bd._focusCellRow=parseInt(_39.getAttribute("visualindex"),10);
_38.focusArea("body",1);
}else{
setTimeout(function(){
var _3a=bn.childNodes,_3b=0,end=_3a.length-1,_3c=_2d.position(bn),i,p,_3d=function(idx){
var rn=_3a[idx],pos=_2d.position(rn);
if(evt.keyCode==_2e.PAGE_DOWN){
var _3e=rn.previousSibling;
if((!_3e&&pos.y>=_3c.y)||pos.y==_3c.y){
return 0;
}else{
if(!_3e){
return -1;
}else{
var _3f=_2d.position(_3e);
if(_3f.y<_3c.y&&_3f.y+_3f.h>=_3c.y){
return 0;
}else{
if(_3f.y>_3c.y){
return 1;
}else{
return -1;
}
}
}
}
}else{
var _40=rn.nextSibling;
if((!_40&&pos.y+pos.h<=_3c.y+_3c.h)||pos.y+pos.h==_3c.y+_3c.h){
return 0;
}else{
if(!_40){
return 1;
}else{
var _41=_2d.position(_40);
if(_41.y<=_3c.y+_3c.h&&_41.y+_41.h>_3c.y+_3c.h){
return 0;
}else{
if(_41.y>_3c.y+_3c.h){
return 1;
}else{
return -1;
}
}
}
}
}
};
while(_3b<=end){
i=Math.floor((_3b+end)/2);
p=_3d(i);
if(p<0){
_3b=i+1;
}else{
if(p>0){
end=i-1;
}else{
_39=_3a[i];
break;
}
}
}
if(_39){
bd._focusCellRow=parseInt(_39.getAttribute("visualindex"),10);
_38.focusArea("body",1);
}
},0);
}
}
_2a.stop(evt);
}
}});
});
},"gridx/core/model/Model":function(){
define("gridx/core/model/Model",["require","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","dojo/aspect"],function(_42,_43,_44,_45,_46,_47,_48){
var _49=_45.isArrayLike,_4a=_45.isString;
return _43([],{constructor:function(_4b){
var t=this,_4c=_4b.cacheClass;
_4c=typeof _4c=="string"?_42(_4c):_4c;
t.store=_4b.store;
t._exts={};
t._cmdQueue=[];
t._model=t._cache=new _4c(t,_4b);
t._createExts(_4b.modelExtensions||[],_4b);
var m=t._model;
t._cnnts=[_48.after(m,"onDelete",_45.hitch(t,"onDelete"),1),_48.after(m,"onNew",_45.hitch(t,"onNew"),1),_48.after(m,"onSet",_45.hitch(t,"onSet"),1)];
},destroy:function(){
_44.forEach(this._cnnts,function(_4d){
_4d.remove();
});
for(var n in this._exts){
this._exts[n].destroy();
}
},clearCache:function(){
this._cache.clear();
},isId:function(id){
return id||id===0;
},setStore:function(_4e){
this.store=_4e;
this._cache.setStore(_4e);
},when:function(_4f,_50,_51){
this._oldSize=this.size();
this._addCmd({name:"_cmdRequest",scope:this,args:arguments,async:1});
return this._exec();
},scan:function(_52,_53){
var d=new _46,_54=_52.start||0,_55=_52.pageSize||this._cache.pageSize||1,_56=_52.count,end=_56>0?_54+_56:Infinity,_57=_52.whenScope||this,_58=_52.whenFunc||_57.when;
var f=function(s){
d.progress(s/(_56>0?s+_56:_57.size()));
_58.call(_57,{id:[],range:[{start:s,count:_55}]},function(){
var i,r,_59=[];
for(i=s;i<s+_55&&i<end;++i){
r=_57.byIndex(i);
if(r){
_59.push(r);
}else{
end=-1;
break;
}
}
if(_53(_59,s)||i==end){
end=-1;
}
}).then(function(){
if(end==-1){
d.callback();
}else{
f(s+_55);
}
});
};
f(_54);
return d;
},onDelete:function(){
},onNew:function(){
},onSet:function(){
},onSizeChange:function(){
},_msg:function(){
},_addCmd:function(_5a){
var _5b=this._cmdQueue,cmd=_5b[_5b.length-1];
if(cmd&&cmd.name==_5a.name&&cmd.scope==_5a.scope){
cmd.args.push(_5a.args||[]);
}else{
_5a.args=[_5a.args||[]];
_5b.push(_5a);
}
},_onSizeChange:function(){
var t=this,_5c=t._oldSize,_5d=t._oldSize=t.size();
if(_5c!=_5d){
t.onSizeChange(_5d,_5c);
}
},_execEvents:function(_5e,_5f){
this._onSizeChange();
if(_5f){
_5f.call(_5e);
}
},_cmdRequest:function(){
var t=this;
return new _47(_44.map(arguments,function(_60){
var arg=_60[0],_61=_45.hitch(t,t._execEvents,_60[2],_60[1]);
if(arg===null||!_60.length){
var d=new _46;
_61();
d.callback();
return d;
}
return t._model._call("when",[t._normArgs(arg),_61]);
}),0,1);
},_exec:function(){
var t=this,c=t._cache,d=new _46,_62=t._cmdQueue,_63=function(d,err){
t._busy=0;
c.skipCacheSizeCheck=0;
if(c._checkSize){
c._checkSize();
}
if(err){
d.errback(err);
}else{
d.callback();
}
},_64=function(){
if(_44.some(_62,function(cmd){
return cmd.name=="_cmdRequest";
})){
try{
while(_62.length){
var cmd=_62.shift(),dd=cmd.scope[cmd.name].apply(cmd.scope,cmd.args);
if(cmd.async){
_46.when(dd,_64,_45.partial(_63,d));
return;
}
}
}
catch(e){
_63(d,e);
return;
}
}
_63(d);
};
if(t._busy){
return t._busy;
}
t._busy=d;
c.skipCacheSizeCheck=1;
_64();
return d;
},_createExts:function(_65,_66){
_65=_44.filter(_65,function(ext){
ext=typeof ext=="string"?_42(ext):ext;
return ext&&ext.prototype;
});
_65.sort(function(a,b){
return a.prototype.priority-b.prototype.priority;
});
for(var i=0,len=_65.length;i<len;++i){
if(i==_65.length-1||_65[i]!=_65[i+1]){
var ext=new _65[i](this,_66);
this._exts[ext.name]=ext;
}
}
},_normArgs:function(_67){
var i,rgs=[],ids=[],res={range:rgs,id:ids},_68=function(a){
return typeof a=="number"&&a>=0;
},_69=function(a){
return a&&_68(a.start);
},f=function(a){
if(_69(a)){
rgs.push(a);
}else{
if(_68(a)){
rgs.push({start:a,count:1});
}else{
if(_49(a)){
for(i=a.length-1;i>=0;--i){
if(_68(a[i])){
rgs.push({start:a[i],count:1});
}else{
if(_69(a[i])){
rgs.push(a[i]);
}else{
if(_4a(a)){
ids.push(a[i]);
}
}
}
}
}else{
if(_4a(a)){
ids.push(a);
}
}
}
}
};
if(_67&&(_67.index||_67.range||_67.id)){
f(_67.index);
f(_67.range);
if(_49(_67.id)){
for(i=_67.id.length-1;i>=0;--i){
ids.push(_67.id[i]);
}
}else{
if(this.isId(_67.id)){
ids.push(_67.id);
}
}
}else{
f(_67);
}
if(!rgs.length&&!ids.length&&this.size()<0){
rgs.push({start:0,count:this._cache.pageSize||1});
}
return res;
}});
});
},"gridx/core/model/cache/Async":function(){
define(["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","./_Cache"],function(_6a,_6b,_6c,_6d,_6e,_6f){
var _70=_6c.hitch;
function _71(_72,_73){
if(!_73.length||!_72.length){
return _72;
}
var _74=[],f=0,r,res=[],_75=function(idx,_76){
_74[idx]=_74[idx]||0;
_74[idx]+=_76;
},_77=function(_78,_79){
var i,r;
for(i=_78.length-1;i>=0;--i){
r=_78[i];
_75(r.start,_79);
if(r.count){
_75(r.start+r.count,-_79);
}
}
};
_77(_72,1);
_77(_73,2);
for(var i=0,len=_74.length;i<len;++i){
if(_74[i]){
f+=_74[i];
if(f===1){
res.push({start:i});
}else{
if(f===3){
res._overlap=true;
}
r=res[res.length-1];
if(r&&!r.count){
r.count=i-r.start;
}
}
}
}
return res;
};
function _7a(_7b){
var _7c=[],r=_7b.range,i,t,a,b,c,_7d;
while(r.length>0){
c=a=r.pop();
_7d=0;
for(i=r.length-1;i>=0;--i){
b=r[i];
if(a.start<b.start){
t=b;
b=a;
a=t;
}
if(b.count){
if(a.start<=b.start+b.count){
if(a.count&&a.start+a.count>b.start+b.count){
b.count=a.start+a.count-b.start;
}else{
if(!a.count){
b.count=null;
}
}
}else{
a=c;
continue;
}
}
r[i]=b;
_7d=1;
break;
}
if(!_7d){
_7c.push(c);
}
}
_7b.range=_7c;
return _7b;
};
function _7e(_7f,ps){
var r=_7f.range,_80=[],a,b;
r.sort(function(a,b){
return a.start-b.start;
});
while(r.length){
a=r.shift();
if(r.length){
b=r[0];
if(b.count&&b.count+b.start-a.start<=ps){
b.count=b.count+b.start-a.start;
b.start=a.start;
continue;
}else{
if(!b.count&&b.start-a.start<ps){
b.start=a.start;
continue;
}
}
}
_80.push(a);
}
if(_80.length==1&&_80[0].count<ps){
_80[0].count=ps;
}
_7f.range=_80;
return _7f;
};
function _81(n){
return typeof n=="number"&&!isNaN(n);
};
return _6a(_6f,{isAsync:true,constructor:function(_82,_83){
var cs=_83.cacheSize,ps=_83.pageSize;
this.cacheSize=_81(cs)?cs:-1;
this.pageSize=_81(ps)&&ps>0?ps:100;
},when:function(_84,_85){
var t=this,d=_84._def=new _6d(),_86=_70(d,d.errback),_87=function(e){
t._requests.pop();
_86(e);
};
t._fetchById(_84).then(function(_88){
t._fetchByIndex(_88).then(function(_89){
t._fetchByParentId(_89).then(function(_8a){
_6d.when(_8a._req,function(){
var err;
if(_85){
try{
_85();
}
catch(e){
err=e;
}
}
t._requests.shift();
if(err){
d.errback(err);
}else{
d.callback();
}
},_87);
},_87);
},_87);
},_86);
return d;
},keep:function(id){
var t=this,k=t._kept;
if(t._cache[id]&&t._struct[id]&&!k[id]){
k[id]=1;
++t._keptSize;
}
},free:function(id){
var t=this;
if(!t.model.isId(id)){
t._kept={};
t._keptSize=0;
}else{
if(t._kept[id]){
delete t._kept[id];
--t._keptSize;
}
}
},clear:function(){
var t=this;
if(t._requests&&t._requests.length){
t._clearLock=1;
return;
}
t.inherited(arguments);
t._requests=[];
t._priority=[];
t._kept={};
t._keptSize=0;
},_init:function(){
},_findMissingIds:function(ids){
var c=this._cache;
return _6b.filter(ids,function(id){
return !c[id];
});
},_searchRootLevel:function(ids){
var t=this,d=new _6d(),_8b=_70(d,d.errback),_8c=t._struct[""],_8d=[],_8e,_8f;
if(ids.length){
for(var i=1,len=_8c.length;i<len;++i){
if(!_8c[i]){
if(_8f){
_8e.count++;
}else{
_8f=1;
_8d.push(_8e={start:i-1,count:1});
}
}
}
_8d.push({start:_8c.length<2?0:_8c.length-2});
}
var _90=function(ids){
if(ids.length&&_8d.length){
t._storeFetch(_8d.shift()).then(function(){
_90(t._findMissingIds(ids));
},_8b);
}else{
d.callback(ids);
}
};
_90(ids);
return d;
},_searchChildLevel:function(ids){
var t=this,d=new _6d(),_91=_70(d,d.errback),st=t._struct,_92=st[""].slice(1),_93=function(ids){
if(ids.length&&_92.length){
var pid=_92.shift();
t._loadChildren(pid).then(function(){
[].push.apply(_92,st[pid].slice(1));
_93(t._findMissingIds(ids));
},_91);
}else{
d.callback(ids);
}
};
_93(ids);
return d;
},_fetchById:function(_94){
var t=this,d=new _6d(),i,r,len,pid,_95=_70(d,d.callback),_96=_70(d,d.errback),_97=_94.range,_98=t.store.getChildren;
_94.pids=[];
if(_98){
for(i=_97.length-1;i>=0;--i){
r=_97[i];
pid=r.parentId;
if(t.model.isId(pid)){
_94.id.push(pid);
_94.pids.push(pid);
_97.splice(i,1);
}
}
}
var ids=t._findMissingIds(_94.id),mis=[];
if(ids.length){
_6b.forEach(ids,function(id){
var idx=t.idToIndex(id);
if(idx>=0&&!t.treePath(id).pop()){
_97.push({start:idx,count:1});
}else{
mis.push(id);
}
});
t._searchRootLevel(mis).then(function(ids){
if(ids.length&&_98){
t._searchChildLevel(ids).then(function(ids){
if(ids.length){
console.warn("Requested row ids are not found: ",ids);
}
_95(_94);
},_96);
}else{
_95(_94);
}
},_96);
}else{
_95(_94);
}
return d;
},_fetchByParentId:function(_99){
var t=this,d=new _6d();
new _6e(_6b.map(_99.pids,function(pid){
return t._loadChildren(pid);
}),0,1).then(_70(d,d.callback,_99),_70(d,d.errback));
return d;
},_fetchByIndex:function(_9a){
var t=this,d=new _6d(),_9b=t._size[""];
_9a=_7e(t._mergePendingRequests(t._findMissingIndexes(_7a(_9a))),t.pageSize);
var _9c=_9b>0?_6b.filter(_9a.range,function(r){
if(r.count>0&&_9b<r.start+r.count){
r.count=_9b-r.start;
}
return r.start<_9b;
}):_9a.range;
new _6e(_6b.map(_9c,function(r){
return t._storeFetch(r);
}),0,1).then(_70(d,d.callback,_9a),_70(d,d.errback));
return d;
},_findMissingIndexes:function(_9d){
var i,j,r,end,_9e,t=this,_9f=[],_a0=t._struct[""],_a1=t._size[""];
for(i=_9d.range.length-1;i>=0;--i){
r=_9d.range[i];
end=r.count?r.start+r.count:_a0.length-1;
_9e=1;
for(j=r.start;j<end;++j){
var id=_a0[j+1];
if(!id||!t._cache[id]){
if(_9e){
_9f.push({start:j,count:1});
}else{
++_9f[_9f.length-1].count;
}
_9e=0;
}else{
_9e=1;
}
}
if(!r.count){
if(!_9e){
delete _9f[_9f.length-1].count;
}else{
if(_a1<0||j<_a1){
_9f.push({start:j});
}
}
}
}
_9d.range=_9f;
return _9d;
},_mergePendingRequests:function(_a2){
var i,req,_a3=[],_a4=this._requests;
for(i=_a4.length-1;i>=0;--i){
req=_a4[i];
_a2.range=_71(_a2.range,req.range);
if(_a2.range._overlap){
_a3.push(req._def);
}
}
_a2._req=_a3.length&&new _6e(_a3,0,1);
_a4.push(_a2);
return _a2;
},_checkSize:function(){
var t=this,id,cs=t.cacheSize,p=t._priority;
if(t._clearLock){
t._clearLock=0;
t.clear();
}else{
if(cs>=0){
cs+=t._keptSize;
while(p.length>cs){
id=p.shift();
if(t._kept[id]){
p.push(id);
}else{
delete t._cache[id];
}
}
}
}
}});
});
},"gridx/core/_Module":function(){
define(["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/Deferred","dojo/_base/connect","dojo/aspect"],function(_a5,_a6,_a7,_a8,_a9,_aa){
var _ab=_a6.isFunction,c="connect",_ac=_a5([],{constructor:function(_ad,_ae){
var t=this;
t.grid=_ad;
t.model=_ad.model;
t.loaded=new _a8;
t._cnnts=[];
t._sbscs=[];
_a6.mixin(t,_ae);
},destroy:function(){
var f=_a7.forEach;
f(this._cnnts,_a9.disconnect);
f(this._sbscs,_a9.unsubscribe);
},arg:function(_af,_b0,_b1){
if(arguments.length==2&&_ab(_b0)){
_b1=_b0;
_b0=undefined;
}
var t=this,g=t.grid,r=t[_af];
if(!t.hasOwnProperty(_af)){
var _b2=t.name+_af.substring(0,1).toUpperCase()+_af.substring(1);
if(g[_b2]===undefined){
if(_b0!==undefined){
r=_b0;
}
}else{
r=g[_b2];
}
}
t[_af]=(_b1&&!_b1(r))?_b0:r;
return r;
},aspect:function(obj,e,_b3,_b4,pos){
var _b5=_aa[pos||"after"](obj,e,_a6.hitch(_b4||this,_b3),1);
this._cnnts.push(_b5);
return _b5;
},connect:function(obj,e,_b6,_b7,_b8){
var t=this,_b9,g=t.grid,s=_b7||t;
if(obj===g&&typeof e=="string"){
_b9=_a9[c](obj,e,function(){
var a=arguments;
if(g._eventFlags[e]===_b8){
if(_ab(_b6)){
_b6.apply(s,a);
}else{
if(_ab(s[_b6])){
s[_b6].apply(s,a);
}
}
}
});
}else{
_b9=_a9[c](obj,e,s,_b6);
}
t._cnnts.push(_b9);
return _b9;
},batchConnect:function(){
for(var i=0,_ba=arguments,len=_ba.length;i<len;++i){
if(_a6.isArrayLike(_ba[i])){
this[c].apply(this,_ba[i]);
}
}
},subscribe:function(_bb,_bc,_bd){
var s=_a9.subscribe(_bb,_bd||this,_bc);
this._sbscs.push(s);
return s;
}}),_be=_ac._modules={};
_ac.register=function(_bf){
var p=_bf.prototype;
return _be[p.name||p.declaredClass]=_bf;
};
_ac._markupAttrs=["id","name","field","width","dataType","!formatter","!decorator","!sortable"];
return _ac;
});
},"gridx/modules/extendedSelect/Column":function(){
define("gridx/modules/extendedSelect/Column",["dojo/_base/declare","dojo/_base/array","dojo/_base/query","dojo/_base/lang","dojo/_base/sniff","dojo/dom-class","dojo/mouse","dojo/keys","../../core/_Module","./_Base"],function(_c0,_c1,_c2,_c3,_c4,_c5,_c6,_c7,_c8,_c9){
return _c0(_c9,{name:"selectColumn",columnMixin:{select:function(){
this.grid.select.column.selectById(this.id);
return this;
},deselect:function(){
this.grid.select.column.deselectById(this.id);
return this;
},isSelected:function(){
return this.grid._columnsById[this.id]._selected;
}},getSelected:function(){
return _c1.map(_c1.filter(this.grid._columns,function(col){
return col._selected;
}),function(col){
return col.id;
});
},clear:function(_ca){
_c2(".gridxColumnSelected",this.grid.domNode).forEach(function(_cb){
_c5.remove(_cb,"gridxColumnSelected");
_cb.removeAttribute("aria-selected");
});
_c1.forEach(this.grid._columns,function(col){
col._selected=0;
});
this._clear();
if(!_ca){
this._onSelectionChange();
}
},isSelected:function(){
var _cc=this.grid._columnsById;
return _c1.every(arguments,function(id){
var col=_cc[id];
return col&&col._selected;
});
},_type:"column",_markById:function(_cd,_ce){
_c1.forEach(_cd,function(_cf){
var col=this.grid._columnsById[_cf];
if(col){
col._selected=_ce;
this._doHighlight({column:col.index},_ce);
}
},this);
},_markByIndex:function(_d0,_d1){
var i,col,_d2=this.grid._columns;
for(i=0;i<_d0.length;++i){
var arg=_d0[i];
if(_c3.isArrayLike(arg)){
var _d3=arg[0],end=arg[1],_d4;
if(_d3>=0&&_d3<Infinity){
if(!(end>=_d3&&end<Infinity)){
end=_d2.length-1;
}
for(;_d3<end+1;++_d3){
col=_d2[_d3];
if(col){
col._selected=_d1;
this._doHighlight({column:col.index},_d1);
}
}
}
}else{
if(arg>=0&&arg<Infinity){
col=_d2[arg];
if(col){
col._selected=_d1;
this._doHighlight({column:arg},_d1);
}
}
}
}
},_init:function(){
var t=this,g=t.grid;
t.batchConnect([g,"onHeaderCellMouseDown",function(e){
if(_c6.isLeft(e)&&!_c5.contains(e.target,"gridxArrowButtonNode")){
t._start({column:e.columnIndex},g._isCopyEvent(e),e.shiftKey);
}
}],[g,"onHeaderCellMouseOver",function(e){
t._highlight({column:e.columnIndex});
}],[g,"onCellMouseOver",function(e){
t._highlight({column:e.columnIndex});
}],[g,_c4("ff")<4?"onHeaderCellKeyUp":"onHeaderCellKeyDown",function(e){
if((e.keyCode==_c7.SPACE||e.keyCode==_c7.ENTER)&&!_c5.contains(e.target,"gridxArrowButtonNode")){
t._start({column:e.columnIndex},g._isCopyEvent(e),e.shiftKey);
t._end();
}
}],[g.header,"onMoveToHeaderCell","_onMoveToHeaderCell"]);
},_onRender:function(_d5,_d6){
var i,j,end=_d5+_d6,g=this.grid,bn=g.bodyNode,_d7,_d8=_c1.filter(g._columns,function(col){
return col._selected;
});
for(i=_d8.length-1;i>=0;--i){
for(j=_d5;j<end;++j){
_d7=_c2(["[visualindex=\"",j,"\"] [colid=\"",_d8[i].id,"\"]"].join(""),bn)[0];
_c5.add(_d7,"gridxColumnSelected");
_d7.setAttribute("aria-selected",true);
}
}
},_onMoveToHeaderCell:function(_d9,e){
if(e.shiftKey&&(e.keyCode==_c7.LEFT_ARROW||e.keyCode==_c7.RIGHT_ARROW)){
var t=this,col=t.grid._columnsById[_d9];
t._start({column:col.index},t.grid._isCopyEvent(e),1);
t._end();
}
},_isSelected:function(_da){
var t=this,col=t.grid._columns[_da.column],id=col.id;
return t._isRange?_c1.indexOf(t._refSelectedIds,id)>=0:col._selected;
},_beginAutoScroll:function(){
var _db=this.grid.autoScroll;
this._autoScrollV=_db.vertical;
_db.vertical=false;
},_endAutoScroll:function(){
this.grid.autoScroll.vertical=this._autoScrollV;
},_doHighlight:function(_dc,_dd){
_c2("[colid=\""+this.grid._columns[_dc.column].id+"\"].gridxCell",this.grid.domNode).forEach(function(_de){
_c5.toggle(_de,"gridxColumnSelected",_dd);
});
},_focus:function(_df){
var g=this.grid;
if(g.focus){
g.header._focusNode(_c2("[colid=\""+g._columns[_df.column].id+"\"].gridxCell",g.header.domNode)[0]);
}
},_addToSelected:function(_e0,end,_e1){
var t=this,g=t.grid,a,i;
if(!t._isRange){
t._refSelectedIds=t.getSelected();
}
if(t._isRange&&t._inRange(end.column,_e0.column,t._lastEndItem.column)){
_e0=Math.min(end.column,t._lastEndItem.column);
end=Math.max(end.column,t._lastEndItem.column);
for(i=_e0;i<=end;++i){
g._columns[i]._selected=_c1.indexOf(t._refSelectedIds,g._columns[i].id)>=0;
}
}else{
a=Math.min(_e0.column,end.column);
end=Math.max(_e0.column,end.column);
_e0=a;
for(i=_e0;i<=end;++i){
g._columns[i]._selected=_e1;
}
}
}});
});
},"dojo/dnd/Manager":function(){
define("dojo/dnd/Manager",["../_base/array","../_base/declare","../_base/event","../_base/lang","../_base/window","../dom-class","../Evented","../has","../keys","../on","../topic","../touch","./common","./autoscroll","./Avatar"],function(_e2,_e3,_e4,_e5,win,_e6,_e7,has,_e8,on,_e9,_ea,dnd,_eb,_ec){
var _ed=_e3("dojo.dnd.Manager",[_e7],{constructor:function(){
this.avatar=null;
this.source=null;
this.nodes=[];
this.copy=true;
this.target=null;
this.canDropFlag=false;
this.events=[];
},OFFSET_X:has("touch")?0:16,OFFSET_Y:has("touch")?-64:16,overSource:function(_ee){
if(this.avatar){
this.target=(_ee&&_ee.targetState!="Disabled")?_ee:null;
this.canDropFlag=Boolean(this.target);
this.avatar.update();
}
_e9.publish("/dnd/source/over",_ee);
},outSource:function(_ef){
if(this.avatar){
if(this.target==_ef){
this.target=null;
this.canDropFlag=false;
this.avatar.update();
_e9.publish("/dnd/source/over",null);
}
}else{
_e9.publish("/dnd/source/over",null);
}
},startDrag:function(_f0,_f1,_f2){
_eb.autoScrollStart(win.doc);
this.source=_f0;
this.nodes=_f1;
this.copy=Boolean(_f2);
this.avatar=this.makeAvatar();
win.body().appendChild(this.avatar.node);
_e9.publish("/dnd/start",_f0,_f1,this.copy);
this.events=[on(win.doc,_ea.move,_e5.hitch(this,"onMouseMove")),on(win.doc,_ea.release,_e5.hitch(this,"onMouseUp")),on(win.doc,"keydown",_e5.hitch(this,"onKeyDown")),on(win.doc,"keyup",_e5.hitch(this,"onKeyUp")),on(win.doc,"dragstart",_e4.stop),on(win.body(),"selectstart",_e4.stop)];
var c="dojoDnd"+(_f2?"Copy":"Move");
_e6.add(win.body(),c);
},canDrop:function(_f3){
var _f4=Boolean(this.target&&_f3);
if(this.canDropFlag!=_f4){
this.canDropFlag=_f4;
this.avatar.update();
}
},stopDrag:function(){
_e6.remove(win.body(),["dojoDndCopy","dojoDndMove"]);
_e2.forEach(this.events,function(_f5){
_f5.remove();
});
this.events=[];
this.avatar.destroy();
this.avatar=null;
this.source=this.target=null;
this.nodes=[];
},makeAvatar:function(){
return new _ec(this);
},updateAvatar:function(){
this.avatar.update();
},onMouseMove:function(e){
var a=this.avatar;
if(a){
_eb.autoScrollNodes(e);
var s=a.node.style;
s.left=(e.pageX+this.OFFSET_X)+"px";
s.top=(e.pageY+this.OFFSET_Y)+"px";
var _f6=Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
if(this.copy!=_f6){
this._setCopyStatus(_f6);
}
}
if(has("touch")){
e.preventDefault();
}
},onMouseUp:function(e){
if(this.avatar){
if(this.target&&this.canDropFlag){
var _f7=Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
_e9.publish("/dnd/drop/before",this.source,this.nodes,_f7,this.target,e);
_e9.publish("/dnd/drop",this.source,this.nodes,_f7,this.target,e);
}else{
_e9.publish("/dnd/cancel");
}
this.stopDrag();
}
},onKeyDown:function(e){
if(this.avatar){
switch(e.keyCode){
case _e8.CTRL:
var _f8=Boolean(this.source.copyState(true));
if(this.copy!=_f8){
this._setCopyStatus(_f8);
}
break;
case _e8.ESCAPE:
_e9.publish("/dnd/cancel");
this.stopDrag();
break;
}
}
},onKeyUp:function(e){
if(this.avatar&&e.keyCode==_e8.CTRL){
var _f9=Boolean(this.source.copyState(false));
if(this.copy!=_f9){
this._setCopyStatus(_f9);
}
}
},_setCopyStatus:function(_fa){
this.copy=_fa;
this.source._markDndStatus(this.copy);
this.updateAvatar();
_e6.replace(win.body(),"dojoDnd"+(this.copy?"Copy":"Move"),"dojoDnd"+(this.copy?"Move":"Copy"));
}});
dnd._manager=null;
_ed.manager=dnd.manager=function(){
if(!dnd._manager){
dnd._manager=new _ed();
}
return dnd._manager;
};
return _ed;
});
},"gridx/modules/ColumnResizer":function(){
define(["dojo/_base/declare","dojo/_base/sniff","dojo/_base/window","dojo/_base/event","dojo/dom","dojo/dom-style","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/keys","dojo/query","../core/_Module"],function(_fb,_fc,win,_fd,dom,_fe,_ff,_100,_101,keys,_102,_103){
var _104=_ff.remove;
function _105(e){
var node=e.target;
if(node){
if(/table/i.test(node.tagName)){
var m=e.offsetX||e.layerX||0,i=0,_106=node.rows[0].cells;
while(m>0&&_106[i]){
m-=_106[i].offsetWidth;
i++;
}
return _106[i]||null;
}
while(node&&node.tagName){
if(node.tagName.toLowerCase()=="th"){
return node;
}
node=node.parentNode;
}
}
return null;
};
return _fb(_103,{name:"columnResizer",minWidth:20,detectWidth:5,load:function(args){
var t=this,g=t.grid;
t.batchConnect([g.header.innerNode,"mousemove","_mousemove"],[g,"onHeaderMouseOut","_mouseout"],[g,"onHeaderMouseDown","_mousedown",t,t.name],[g,"onHeaderKeyDown","_keydown"],[win.doc,"mousemove","_docMousemove"],[win.doc,"onmouseup","_mouseup"]);
t.loaded.callback();
},getAPIPath:function(){
return {columnResizer:this};
},columnMixin:{setWidth:function(_107){
this.grid.columnResizer.setWidth(this.id,_107);
}},setWidth:function(_108,_109){
var t=this,g=t.grid,i,cols=g._columns,_10a=t.arg("minWidth"),_10b;
_109=parseInt(_109,10);
if(_109<_10a){
_109=_10a;
}
g._columnsById[_108].width=_109+"px";
for(i=0;i<cols.length;++i){
cols[i].declaredWidth=cols[i].width;
}
_102("[colid=\""+_108+"\"]",g.domNode).forEach(function(cell){
if(!_10b){
_10b=_fe.get(cell,"width");
}
cell.style.width=_109+"px";
});
g.body.onRender();
g.vLayout.reLayout();
t.onResize(_108,_109,_10b);
},onResize:function(){
},_mousemove:function(e){
var t=this,cell=_105(e),_10c=t.grid._eventFlags;
if(cell){
if(t._resizing){
_104(cell,"gridxHeaderCellOver");
}
if(t._resizing||!cell||t._ismousedown){
return;
}
var _10d=t._readyToResize=t._isInResizeRange(e);
_10c.onHeaderMouseDown=_10c.onHeaderCellMouseDown=_10d?t.name:undefined;
_ff.toggle(win.body(),"gridxColumnResizing",_10d);
if(_10d){
_104(cell,"gridxHeaderCellOver");
}
}
},_docMousemove:function(e){
if(this._resizing){
this._updateResizerPosition(e);
}
},_mouseout:function(e){
if(!this._resizing){
this._readyToResize=0;
_104(win.body(),"gridxColumnResizing");
}
},_keydown:function(evt){
if((evt.keyCode==keys.LEFT_ARROW||evt.keyCode==keys.RIGHT_ARROW)&&evt.ctrlKey&&evt.shiftKey){
var _10e=evt.columnId,g=this.grid,dir=g.isLeftToRight()?1:-1,step=dir*2;
_102("[colid=\""+_10e+"\"]",g.header.domNode).forEach(function(cell){
var _10f=_fe.get(cell,"width");
if(evt.keyCode==keys.LEFT_ARROW){
_10f-=step;
}else{
_10f+=step;
}
this.setWidth(_10e,_10f);
_fd.stop(evt);
},this);
}
},_updateResizerPosition:function(e){
var t=this,_110=e.pageX-t._startX,cell=t._targetCell,g=t.grid,hs=g.hScroller,h=0,n,left=e.pageX-t._gridX,_111=t.arg("minWidth"),ltr=this.grid.isLeftToRight();
if(!ltr){
_110=-_110;
}
if(cell.offsetWidth+_110<_111){
if(ltr){
left=t._startX-t._gridX-cell.offsetWidth+_111;
}else{
left=t._startX-t._gridX+(cell.offsetWidth-_111);
}
}
n=hs&&hs.container.offsetHeight?hs.container:g.bodyNode;
h=n.parentNode.offsetTop+n.offsetHeight-g.header.domNode.offsetTop;
_fe.set(t._resizer,{top:g.header.domNode.offsetTop+"px",left:left+"px",height:h+"px"});
},_showResizer:function(e){
var t=this;
if(!t._resizer){
t._resizer=_100.create("div",{className:"gridxColumnResizer"},t.grid.domNode,"last");
t.connect(t._resizer,"mouseup","_mouseup");
}
t._resizer.style.display="block";
t._updateResizerPosition(e);
},_hideResizer:function(){
this._resizer.style.display="none";
},_mousedown:function(e){
var t=this;
if(!t._readyToResize){
t._ismousedown=1;
return;
}
dom.setSelectable(t.grid.domNode,false);
win.doc.onselectstart=function(){
return false;
};
t._resizing=1;
t._startX=e.pageX;
t._gridX=_101.position(t.grid.domNode).x;
t._showResizer(e);
},_mouseup:function(e){
var t=this;
t._ismousedown=0;
if(t._resizing){
t._resizing=0;
t._readyToResize=0;
_104(win.body(),"gridxColumnResizing");
dom.setSelectable(t.grid.domNode,true);
win.doc.onselectstart=null;
var cell=t._targetCell,_112=e.pageX-t._startX;
if(!t.grid.isLeftToRight()){
_112=-_112;
}
var w=(_fc("webkit")?cell.offsetWidth:_fe.get(cell,"width"))+_112,_113=t.arg("minWidth");
if(w<_113){
w=_113;
}
t.setWidth(cell.getAttribute("colid"),w);
t._hideResizer();
}
},_isInResizeRange:function(e){
var t=this,cell=_105(e),x=t._getCellX(e),_114=t.arg("detectWidth"),ltr=t.grid.isLeftToRight();
if(x<_114){
if(ltr){
return !!(t._targetCell=cell.previousSibling);
}else{
t._targetCell=cell;
return 1;
}
}else{
if(x>cell.offsetWidth-_114&&x<=cell.offsetWidth){
if(ltr){
t._targetCell=cell;
return 1;
}else{
return !!(t._targetCell=cell.previousSibling);
}
}
}
return 0;
},_getCellX:function(e){
var _115=e.target,cell=_105(e);
if(!cell){
return 100000;
}
if(/table/i.test(_115.tagName)){
return 0;
}
var lx=e.offsetX;
if(lx==undefined){
lx=e.layerX;
}
if(!/th/i.test(_115.tagName)){
lx+=_115.offsetLeft;
}
if(_fc("ff")&&/th/i.test(_115.tagName)){
var ltr=this.grid.isLeftToRight();
var _116=-parseInt(_fe.get(cell.parentNode.parentNode.parentNode,ltr?"marginLeft":"marginRight"));
if(!ltr){
_116=this.grid.header.domNode.firstChild.scrollWidth-_116-this.grid.header.innerNode.offsetWidth;
}
var d=lx-(cell.offsetLeft-_116);
if(d>=0){
lx=d;
}
if(lx>=cell.offsetWidth){
lx=0;
}
}
return lx;
}});
});
},"gridx/util":function(){
define("gridx/util",{stopEvent:function(evt){
if(evt&&evt.stopPropagation&&evt.preventDefault){
evt.stopPropagation();
evt.preventDefault();
}
},biSearch:function(arr,comp){
var i=0,j=arr.length,k;
for(k=Math.floor((i+j)/2);i+1<j;k=Math.floor((i+j)/2)){
if(comp(arr[k])>0){
j=k;
}else{
i=k;
}
}
return arr.length&&comp(arr[i])>=0?i:j;
}});
},"gridx/modules/VLayout":function(){
define("gridx/modules/VLayout",["dojo/_base/declare","dojo/DeferredList","../core/_Module"],function(_117,_118,_119){
return _117(_119,{name:"vLayout",getAPIPath:function(){
return {vLayout:this};
},preload:function(){
var t=this,g=t.grid;
t.connect(g,"_onResizeEnd",function(_11a,ds){
var d,dl=[];
for(d in ds){
dl.push(ds[d]);
}
new _118(dl).then(function(){
t.reLayout();
});
});
if(g.autoHeight){
t.connect(g.body,"onRender","reLayout");
}else{
t.connect(g,"setColumns",function(){
setTimeout(function(){
t.reLayout();
},0);
});
}
},load:function(args,_11b){
var t=this;
_11b.then(function(){
if(t._defs&&t._mods){
new _118(t._defs).then(function(){
t._layout();
t.loaded.callback();
});
}else{
t.loaded.callback();
}
});
},register:function(mod,_11c,_11d,_11e,_11f){
var t=this;
t._defs=t._defs||[];
t._mods=t._mods||{};
t._mods[_11d]=t._mods[_11d]||[];
t._defs.push(_11f||mod.loaded);
t._mods[_11d].push({p:_11e||0,mod:mod,nodeName:_11c});
},reLayout:function(){
var t=this,_120=0,_121,n;
for(_121 in t._mods){
n=t.grid[_121];
if(n){
_120+=n.offsetHeight;
}
}
t._updateHeight(_120);
},_layout:function(){
var _122=0,t=this,mods=t._mods,_123,n,i,hp,mod,_124;
for(_123 in mods){
n=t.grid[_123];
if(n){
hp=mods[_123];
hp.sort(function(a,b){
return a.p-b.p;
});
for(i=0;i<hp.length;++i){
mod=hp[i].mod;
_124=hp[i].nodeName;
if(mod&&mod[_124]){
n.appendChild(mod[_124]);
}
}
_122+=n.offsetHeight;
}
}
t._updateHeight(_122);
},_updateHeight:function(_125){
var g=this.grid,dn=g.domNode,ms=g.mainNode.style;
if(g.autoHeight){
g.vScroller.loaded.then(function(){
var _126=g.bodyNode.lastChild,_127=_126?_126.offsetTop+_126.offsetHeight:g.emptyNode.offsetHeight;
dn.style.height=(_127+_125)+"px";
ms.height=_127+"px";
});
}else{
if(dn.clientHeight>_125){
ms.height=(dn.clientHeight-_125)+"px";
}
}
}});
});
},"gridx/modules/extendedSelect/_Base":function(){
define("gridx/modules/extendedSelect/_Base",["dojo/_base/declare","dojo/_base/query","dojo/_base/connect","dojo/_base/Deferred","dojo/_base/sniff","dojo/_base/window","dojo/dom","dojo/keys","../../core/_Module","../AutoScroll"],function(_128,_129,_12a,_12b,_12c,win,dom,keys,_12d){
return _128(_12d,{required:["autoScroll"],getAPIPath:function(){
var path={select:{}};
path.select[this._type]=this;
return path;
},load:function(){
var t=this,g=t.grid,doc=win.doc;
g.domNode.setAttribute("aria-multiselectable",true);
t._refSelectedIds=[];
t.subscribe("gridClearSelection_"+g.id,function(type){
if(type!=t._type){
t.clear();
}
});
t.batchConnect([g.body,"onRender","_onRender"],[doc,"onmouseup","_end"],[doc,"onkeydown",function(e){
if(e.keyCode==keys.SHIFT){
dom.setSelectable(g.domNode,false);
}
}],[doc,"onkeyup",function(e){
if(e.keyCode==keys.SHIFT){
dom.setSelectable(g.domNode,true);
}
}]);
t._init();
t.loaded.callback();
},enabled:true,holdingCtrl:false,holdingShift:false,selectById:function(){
return this._subMark("_markById",arguments,true);
},deselectById:function(){
return this._subMark("_markById",arguments,false);
},selectByIndex:function(){
return this._subMark("_markByIndex",arguments,true);
},deselectByIndex:function(){
return this._subMark("_markByIndex",arguments,false);
},onSelectionChange:function(){
},_clear:function(){
var t=this;
delete t._lastToSelect;
delete t._lastStartItem;
delete t._lastEndItem;
},_subMark:function(func,args,_12e){
var t=this;
if(t.arg("enabled")){
if(_12e){
_12a.publish("gridClearSelection_"+t.grid.id,[t._type]);
}
t._lastSelectedIds=t.getSelected();
t._refSelectedIds=[];
return _12b.when(t[func](args,_12e),function(){
t._onSelectionChange();
});
}
},_start:function(item,_12f,_130){
var t=this;
if(!t._selecting&&!t._marking&&t.arg("enabled")){
dom.setSelectable(t.grid.domNode,false);
t._fixFF(1);
var _131=t._isSelected(item);
_130=_130||t.arg("holdingShift");
if(_130&&t._lastStartItem){
t._isRange=1;
t._toSelect=t._lastToSelect;
t._startItem=t._lastStartItem;
t._currentItem=t._lastEndItem;
}else{
t._startItem=item;
t._currentItem=null;
if(_12f||t.arg("holdingCtrl")){
t._toSelect=!_131;
}else{
t._toSelect=1;
t.clear(1);
}
}
_12a.publish("gridClearSelection_"+t.grid.id,[t._type]);
t._beginAutoScroll();
t.grid.autoScroll.enabled=true;
t._lastSelectedIds=t.getSelected();
t._selecting=1;
t._highlight(item);
}
},_highlight:function(_132){
var t=this;
if(t._selecting){
var type=t._type,_133=t._startItem,_134=t._currentItem,_135=function(from,to,toHL){
from=from[type];
to=to[type];
var dir=from<to?1:-1;
for(;from!=to;from+=dir){
var item={};
item[type]=from;
t._highlightSingle(item,toHL);
}
};
if(_134===null){
t._highlightSingle(_132,1);
}else{
if(t._inRange(_132[type],_133[type],_134[type])){
_135(_134,_132,0);
}else{
if(t._inRange(_133[type],_132[type],_134[type])){
_135(_134,_133,0);
_134=_133;
}
_135(_132,_134,1);
}
}
t._currentItem=_132;
t._focus(_132);
}
},_end:function(){
var t=this,g=t.grid;
if(t._selecting){
t._fixFF();
t._endAutoScroll();
t._selecting=0;
t._marking=1;
g.autoScroll.enabled=false;
var d=t._addToSelected(t._startItem,t._currentItem,t._toSelect);
t._lastToSelect=t._toSelect;
t._lastStartItem=t._startItem;
t._lastEndItem=t._currentItem;
t._startItem=t._currentItem=t._isRange=null;
_12b.when(d,function(){
dom.setSelectable(g.domNode,true);
t._marking=0;
t._onSelectionChange();
});
}
},_highlightSingle:function(_136,_137){
_137=_137?this._toSelect:this._isSelected(_136);
this._doHighlight(_136,_137);
},_onSelectionChange:function(){
var t=this,_138=t.getSelected();
t.onSelectionChange(_138,t._lastSelectedIds);
t._lastSelectedIds=_138;
},_inRange:function(_139,_13a,end,_13b){
return ((_139>=_13a&&_139<=end)||(_139>=end&&_139<=_13a))&&(_13b||_139!=end);
},_fixFF:function(_13c){
if(_12c("ff")){
_129(".gridxSortNode",this.grid.headerNode).style("overflow",_13c?"visible":"");
}
}});
});
},"dojo/i18n":function(){
define("dojo/i18n",["./_base/kernel","require","./has","./_base/array","./_base/config","./_base/lang","./_base/xhr","./json","module"],function(dojo,_13d,has,_13e,_13f,lang,xhr,json,_140){
has.add("dojo-preload-i18n-Api",1);
1||has.add("dojo-v1x-i18n-Api",1);
var _141=dojo.i18n={},_142=/(^.*(^|\/)nls)(\/|$)([^\/]*)\/?([^\/]*)/,_143=function(root,_144,_145,_146){
for(var _147=[_145+_146],_148=_144.split("-"),_149="",i=0;i<_148.length;i++){
_149+=(_149?"-":"")+_148[i];
if(!root||root[_149]){
_147.push(_145+_149+"/"+_146);
}
}
return _147;
},_14a={},_14b=function(_14c,_14d,_14e){
_14e=_14e?_14e.toLowerCase():dojo.locale;
_14c=_14c.replace(/\./g,"/");
_14d=_14d.replace(/\./g,"/");
return (/root/i.test(_14e))?(_14c+"/nls/"+_14d):(_14c+"/nls/"+_14e+"/"+_14d);
},_14f=dojo.getL10nName=function(_150,_151,_152){
return _150=_140.id+"!"+_14b(_150,_151,_152);
},_153=function(_154,_155,_156,_157,_158,load){
_154([_155],function(root){
var _159=lang.clone(root.root),_15a=_143(!root._v1x&&root,_158,_156,_157);
_154(_15a,function(){
for(var i=1;i<_15a.length;i++){
_159=lang.mixin(lang.clone(_159),arguments[i]);
}
var _15b=_155+"/"+_158;
_14a[_15b]=_159;
load();
});
});
},_15c=function(id,_15d){
return /^\./.test(id)?_15d(id):id;
},_15e=function(_15f){
var list=_13f.extraLocale||[];
list=lang.isArray(list)?list:[list];
list.push(_15f);
return list;
},load=function(id,_160,load){
if(has("dojo-preload-i18n-Api")){
var _161=id.split("*"),_162=_161[1]=="preload";
if(_162){
if(!_14a[id]){
_14a[id]=1;
_163(_161[2],json.parse(_161[3]),1,_160);
}
load(1);
}
if(_162||_164(id,_160,load)){
return;
}
}
var _165=_142.exec(id),_166=_165[1]+"/",_167=_165[5]||_165[4],_168=_166+_167,_169=(_165[5]&&_165[4]),_16a=_169||dojo.locale,_16b=_168+"/"+_16a,_16c=_169?[_16a]:_15e(_16a),_16d=_16c.length,_16e=function(){
if(!--_16d){
load(lang.delegate(_14a[_16b]));
}
};
_13e.forEach(_16c,function(_16f){
var _170=_168+"/"+_16f;
if(has("dojo-preload-i18n-Api")){
_171(_170);
}
if(!_14a[_170]){
_153(_160,_168,_166,_167,_16f,_16e);
}else{
_16e();
}
});
};
if(has("dojo-unit-tests")){
var _172=_141.unitTests=[];
}
if(has("dojo-preload-i18n-Api")||1){
var _173=_141.normalizeLocale=function(_174){
var _175=_174?_174.toLowerCase():dojo.locale;
return _175=="root"?"ROOT":_175;
},isXd=function(mid,_176){
return (1&&1)?_176.isXdUrl(_13d.toUrl(mid+".js")):true;
},_177=0,_178=[],_163=_141._preloadLocalizations=function(_179,_17a,_17b,_17c){
_17c=_17c||_13d;
function _17d(mid,_17e){
if(isXd(mid,_17c)||_17b){
_17c([mid],_17e);
}else{
_188([mid],_17e,_17c);
}
};
function _17f(_180,func){
var _181=_180.split("-");
while(_181.length){
if(func(_181.join("-"))){
return;
}
_181.pop();
}
func("ROOT");
};
function _182(_183){
_183=_173(_183);
_17f(_183,function(loc){
if(_13e.indexOf(_17a,loc)>=0){
var mid=_179.replace(/\./g,"/")+"_"+loc;
_177++;
_17d(mid,function(_184){
for(var p in _184){
_14a[_13d.toAbsMid(p)+"/"+loc]=_184[p];
}
--_177;
while(!_177&&_178.length){
load.apply(null,_178.shift());
}
});
return true;
}
return false;
});
};
_182();
_13e.forEach(dojo.config.extraLocale,_182);
},_164=function(id,_185,load){
if(_177){
_178.push([id,_185,load]);
}
return _177;
},_171=function(){
};
}
if(1){
var _186={},_187=new Function("__bundle","__checkForLegacyModules","__mid","__amdValue","var define = function(mid, factory){define.called = 1; __amdValue.result = factory || mid;},"+"\t   require = function(){define.called = 1;};"+"try{"+"define.called = 0;"+"eval(__bundle);"+"if(define.called==1)"+"return __amdValue;"+"if((__checkForLegacyModules = __checkForLegacyModules(__mid)))"+"return __checkForLegacyModules;"+"}catch(e){}"+"try{"+"return eval('('+__bundle+')');"+"}catch(e){"+"return e;"+"}"),_188=function(deps,_189,_18a){
var _18b=[];
_13e.forEach(deps,function(mid){
var url=_18a.toUrl(mid+".js");
function load(text){
var _18c=_187(text,_171,mid,_186);
if(_18c===_186){
_18b.push(_14a[url]=_186.result);
}else{
if(_18c instanceof Error){
console.error("failed to evaluate i18n bundle; url="+url,_18c);
_18c={};
}
_18b.push(_14a[url]=(/nls\/[^\/]+\/[^\/]+$/.test(url)?_18c:{root:_18c,_v1x:1}));
}
};
if(_14a[url]){
_18b.push(_14a[url]);
}else{
var _18d=_18a.syncLoadNls(mid);
if(_18d){
_18b.push(_18d);
}else{
if(!xhr){
try{
_18a.getText(url,true,load);
}
catch(e){
_18b.push(_14a[url]={});
}
}else{
xhr.get({url:url,sync:true,load:load,error:function(){
_18b.push(_14a[url]={});
}});
}
}
}
});
_189&&_189.apply(null,_18b);
};
_171=function(_18e){
for(var _18f,_190=_18e.split("/"),_191=dojo.global[_190[0]],i=1;_191&&i<_190.length-1;_191=_191[_190[i++]]){
}
if(_191){
_18f=_191[_190[i]];
if(!_18f){
_18f=_191[_190[i].replace(/-/g,"_")];
}
if(_18f){
_14a[_18e]=_18f;
}
}
return _18f;
};
_141.getLocalization=function(_192,_193,_194){
var _195,_196=_14b(_192,_193,_194);
load(_196,(!isXd(_196,_13d)?function(deps,_197){
_188(deps,_197,_13d);
}:_13d),function(_198){
_195=_198;
});
return _195;
};
if(has("dojo-unit-tests")){
_172.push(function(doh){
doh.register("tests.i18n.unit",function(t){
var _199;
_199=_187("{prop:1}",_171,"nonsense",_186);
t.is({prop:1},_199);
t.is(undefined,_199[1]);
_199=_187("({prop:1})",_171,"nonsense",_186);
t.is({prop:1},_199);
t.is(undefined,_199[1]);
_199=_187("{'prop-x':1}",_171,"nonsense",_186);
t.is({"prop-x":1},_199);
t.is(undefined,_199[1]);
_199=_187("({'prop-x':1})",_171,"nonsense",_186);
t.is({"prop-x":1},_199);
t.is(undefined,_199[1]);
_199=_187("define({'prop-x':1})",_171,"nonsense",_186);
t.is(_186,_199);
t.is({"prop-x":1},_186.result);
_199=_187("define('some/module', {'prop-x':1})",_171,"nonsense",_186);
t.is(_186,_199);
t.is({"prop-x":1},_186.result);
_199=_187("this is total nonsense and should throw an error",_171,"nonsense",_186);
t.is(_199 instanceof Error,true);
});
});
}
}
return lang.mixin(_141,{dynamic:true,normalize:_15c,load:load,cache:_14a});
});
},"dojo/_base/query":function(){
define("dojo/_base/query",["../query","./NodeList"],function(_19a){
return _19a;
});
},"gridx/core/model/cache/_Cache":function(){
define("gridx/core/model/cache/_Cache",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","../_Extension"],function(_19b,_19c,lang,_19d,_19e){
var _19f=lang.hitch,_1a0=lang.mixin,_1a1=_19c.indexOf;
return _19b(_19e,{constructor:function(_1a2,args){
var t=this;
t.setStore(args.store);
t.columns=args.columns;
t._mixinAPI("byIndex","byId","indexToId","idToIndex","size","treePath","parentId","hasChildren","children","keep","free");
},destroy:function(){
this.inherited(arguments);
this.clear();
},setStore:function(_1a3){
var t=this,c="aspect",old=_1a3.fetch;
t.clear();
t.store=_1a3;
if(!old&&_1a3.notify){
t[c](_1a3,"notify",function(item,id){
if(item===undefined){
t._onDelete(id);
}else{
if(id===undefined){
t._onNew(item);
}else{
t._onSet(item);
}
}
});
}else{
t[c](_1a3,old?"onSet":"put","_onSet");
t[c](_1a3,old?"onNew":"add","_onNew");
t[c](_1a3,old?"onDelete":"remove","_onDelete");
}
},clear:function(){
var t=this;
t._filled=0;
t._priority=[];
t._struct={};
t._cache={};
t._size={};
t._struct[""]=[];
t._size[""]=-1;
},byIndex:function(_1a4,_1a5){
this._init("byIndex",arguments);
return this._cache[this.indexToId(_1a4,_1a5)];
},byId:function(id){
this._init("byId",arguments);
return this._cache[id];
},indexToId:function(_1a6,_1a7){
this._init("indexToId",arguments);
var _1a8=this._struct[this.model.isId(_1a7)?_1a7:""];
return typeof _1a6=="number"&&_1a6>=0?_1a8&&_1a8[_1a6+1]:undefined;
},idToIndex:function(id){
this._init("idToIndex",arguments);
var s=this._struct,pid=s[id]&&s[id][0],_1a9=_1a1(s[pid]||[],id);
return _1a9>0?_1a9-1:-1;
},treePath:function(id){
this._init("treePath",arguments);
var s=this._struct,path=[];
while(id!==undefined){
path.unshift(id);
id=s[id]&&s[id][0];
}
if(path[0]!==""){
path=[];
}else{
path.pop();
}
return path;
},parentId:function(id){
return this.treePath(id).pop();
},hasChildren:function(id){
var t=this,s=t.store,c;
t._init("hasChildren",arguments);
c=t.byId(id);
return s.hasChildren&&s.hasChildren(id,c&&c.item);
},children:function(_1aa){
this._init("children",arguments);
_1aa=this.model.isId(_1aa)?_1aa:"";
var size=this._size[_1aa],_1ab=[];
for(var i=0;i<size;++i){
_1ab.push(this.indexToId(i,_1aa));
}
return _1ab;
},size:function(_1ac){
this._init("size",arguments);
var s=this._size[this.model.isId(_1ac)?_1ac:""];
return s>=0?s:-1;
},onBeforeFetch:function(){
},onAfterFetch:function(){
},onLoadRow:function(){
},onSetColumns:function(_1ad){
var t=this,id,c,_1ae,col;
t.columns=_1ad;
for(id in t._cache){
c=t._cache[id];
for(_1ae in _1ad){
col=_1ad[_1ae];
c.data[_1ae]=t._formatCell(col.id,c.rawData);
}
}
},_itemToObject:function(item){
var s=this.store;
if(s.fetch){
var obj={};
_19c.forEach(s.getAttributes(item),function(attr){
obj[attr]=s.getValue(item,attr);
});
return obj;
}
return item;
},_formatCell:function(_1af,_1b0){
var col=this.columns[_1af];
return col.formatter?col.formatter(_1b0):_1b0[col.field||_1af];
},_formatRow:function(_1b1){
var cols=this.columns,res={},_1b2;
for(_1b2 in cols){
res[_1b2]=this._formatCell(_1b2,_1b1);
}
return res;
},_addRow:function(id,_1b3,_1b4,item,_1b5){
var t=this,st=t._struct,pr=t._priority,pid=t.model.isId(_1b5)?_1b5:"",ids=st[pid],i;
if(!ids){
throw new Error("Fatal error of cache._addRow: parent item "+pid+" of "+id+" is not loaded");
}
if(!ids[_1b3+1]){
ids[_1b3+1]=id;
}else{
if(ids[_1b3+1]!==id){
throw new Error("Fatal error of cache._addRow: different row id "+id+" and "+ids[_1b3+1]+" for same row index "+_1b3);
}
}
st[id]=st[id]||[pid];
if(pid===""){
i=_1a1(pr,id);
if(i>=0){
pr.splice(i,1);
}
pr.push(id);
}
t._cache[id]={data:t._formatRow(_1b4),rawData:_1b4,item:item};
t.onLoadRow(id);
},_loadChildren:function(_1b6){
var t=this,d=new _19d(),s=t.store,row=t.byId(_1b6),_1b7=row&&s.getChildren&&s.getChildren(row.item)||[];
_19d.when(_1b7,function(_1b8){
var i=0,item,len=t._size[_1b6]=_1b8.length;
for(;i<len;++i){
item=_1b8[i];
t._addRow(s.getIdentity(item),i,t._itemToObject(item),item,_1b6);
}
d.callback();
},_19f(d,d.errback));
return d;
},_onBegin:function(size){
this._size[""]=parseInt(size,10);
},_onComplete:function(d,_1b9,_1ba){
try{
var t=this,i=0,item;
for(;item=_1ba[i];++i){
t._addRow(t.store.getIdentity(item),_1b9+i,t._itemToObject(item),item);
}
d.callback();
}
catch(e){
d.errback(e);
}
},_storeFetch:function(_1bb,_1bc){
var t=this,s=t.store,d=new _19d(),req=_1a0({},t.options||{},_1bb),_1bd=_19f(t,t._onBegin),_1be=_19f(t,t._onComplete,d,_1bb.start),_1bf=_19f(d,d.errback);
t._filled=1;
t.onBeforeFetch();
if(s.fetch){
s.fetch(_1a0(req,{onBegin:_1bd,onComplete:_1be,onError:_1bf}));
}else{
var _1c0=s.query(req.query,req);
_19d.when(_1c0.total,_1bd);
_19d.when(_1c0,_1be,_1bf);
}
d.then(_19f(t,t.onAfterFetch));
return d;
},_onSet:function(item){
var t=this,id=t.store.getIdentity(item),_1c1=t.idToIndex(id),path=t.treePath(id),old=t._cache[id];
if(path.length){
t._addRow(id,_1c1,t._itemToObject(item),item,path.pop());
}
t.onSet(id,_1c1,t._cache[id],old);
},_onNew:function(item,_1c2){
var t=this,s=t.store,row=t._itemToObject(item),_1c3=_1c2&&_1c2[s.fetch?"item":"parent"],_1c4=_1c3?s.getIdentity(_1c3):"",size=t._size[""];
t.clear();
t.onNew(s.getIdentity(item),0,{data:t._formatRow(row),rawData:row,item:item});
if(!_1c3&&size>=0){
t._size[""]=size+1;
t.model._onSizeChange();
}
},_onDelete:function(item){
var t=this,s=t.store,st=t._struct,id=s.fetch?s.getIdentity(item):item,path=t.treePath(id);
if(path.length){
var _1c5,i,j,ids=[id],_1c6=path.pop(),sz=t._size,size=sz[""],_1c7=_1a1(st[_1c6],id);
st[_1c6].splice(_1c7,1);
--sz[_1c6];
for(i=0;i<ids.length;++i){
_1c5=st[ids[i]];
if(_1c5){
for(j=_1c5.length-1;j>0;--j){
ids.push(_1c5[j]);
}
}
}
for(i=ids.length-1;i>=0;--i){
j=ids[i];
delete t._cache[j];
delete st[j];
delete sz[j];
}
i=_1a1(t._priority,id);
if(i>=0){
t._priority.splice(i,1);
}
t.onDelete(id,_1c7-1);
if(!_1c6&&size>=0){
sz[""]=size-1;
t.model._onSizeChange();
}
}else{
t.onDelete(id);
}
}});
});
},"gridx/modules/dnd/_Base":function(){
define(["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","../../core/_Module","./Avatar","./_Dnd"],function(_1c8,_1c9,lang,_1ca,_1cb){
return _1c8(_1ca,{delay:2,enabled:true,canRearrange:true,copyWhenDragOut:false,avatar:_1cb,preload:function(args){
var dnd=this.grid.dnd._dnd;
dnd.register(this.name,this);
dnd.avatar=this.arg("avatar");
},checkArg:function(name,arr){
var arg=this.arg(name);
return (arg&&lang.isObject(arg))?_1c9.some(arr,function(v){
return arg[v];
}):arg;
}});
});
},"dojo/dnd/Avatar":function(){
define("dojo/dnd/Avatar",["../_base/declare","../_base/window","../dom","../dom-attr","../dom-class","../dom-construct","../hccss","../query"],function(_1cc,win,dom,_1cd,_1ce,_1cf,has,_1d0){
return _1cc("dojo.dnd.Avatar",null,{constructor:function(_1d1){
this.manager=_1d1;
this.construct();
},construct:function(){
var a=_1cf.create("table",{"class":"dojoDndAvatar",style:{position:"absolute",zIndex:"1999",margin:"0px"}}),_1d2=this.manager.source,node,b=_1cf.create("tbody",null,a),tr=_1cf.create("tr",null,b),td=_1cf.create("td",null,tr),k=Math.min(5,this.manager.nodes.length),i=0;
if(has("highcontrast")){
_1cf.create("span",{id:"a11yIcon",innerHTML:this.manager.copy?"+":"<"},td);
}
_1cf.create("span",{innerHTML:_1d2.generateText?this._generateText():""},td);
_1cd.set(tr,{"class":"dojoDndAvatarHeader",style:{opacity:0.9}});
for(;i<k;++i){
if(_1d2.creator){
node=_1d2._normalizedCreator(_1d2.getItem(this.manager.nodes[i].id).data,"avatar").node;
}else{
node=this.manager.nodes[i].cloneNode(true);
if(node.tagName.toLowerCase()=="tr"){
var _1d3=_1cf.create("table"),_1d4=_1cf.create("tbody",null,_1d3);
_1d4.appendChild(node);
node=_1d3;
}
}
node.id="";
tr=_1cf.create("tr",null,b);
td=_1cf.create("td",null,tr);
td.appendChild(node);
_1cd.set(tr,{"class":"dojoDndAvatarItem",style:{opacity:(9-i)/10}});
}
this.node=a;
},destroy:function(){
_1cf.destroy(this.node);
this.node=false;
},update:function(){
_1ce.toggle(this.node,"dojoDndAvatarCanDrop",this.manager.canDropFlag);
if(has("highcontrast")){
var icon=dom.byId("a11yIcon");
var text="+";
if(this.manager.canDropFlag&&!this.manager.copy){
text="< ";
}else{
if(!this.manager.canDropFlag&&!this.manager.copy){
text="o";
}else{
if(!this.manager.canDropFlag){
text="x";
}
}
}
icon.innerHTML=text;
}
_1d0(("tr.dojoDndAvatarHeader td span"+(has("highcontrast")?" span":"")),this.node).forEach(function(node){
node.innerHTML=this.manager.source.generateText?this._generateText():"";
},this);
},_generateText:function(){
return this.manager.nodes.length.toString();
}});
});
},"dojo/dnd/autoscroll":function(){
define("dojo/dnd/autoscroll",["../_base/lang","../sniff","../_base/window","../dom-geometry","../dom-style","../window"],function(lang,has,win,_1d5,_1d6,_1d7){
var _1d8={};
lang.setObject("dojo.dnd.autoscroll",_1d8);
_1d8.getViewport=_1d7.getBox;
_1d8.V_TRIGGER_AUTOSCROLL=32;
_1d8.H_TRIGGER_AUTOSCROLL=32;
_1d8.V_AUTOSCROLL_VALUE=16;
_1d8.H_AUTOSCROLL_VALUE=16;
var _1d9,doc=win.doc,_1da=Infinity,_1db=Infinity;
_1d8.autoScrollStart=function(d){
doc=d;
_1d9=_1d7.getBox(doc);
var html=win.body(doc).parentNode;
_1da=Math.max(html.scrollHeight-_1d9.h,0);
_1db=Math.max(html.scrollWidth-_1d9.w,0);
};
_1d8.autoScroll=function(e){
var v=_1d9||_1d7.getBox(doc),html=win.body(doc).parentNode,dx=0,dy=0;
if(e.clientX<_1d8.H_TRIGGER_AUTOSCROLL){
dx=-_1d8.H_AUTOSCROLL_VALUE;
}else{
if(e.clientX>v.w-_1d8.H_TRIGGER_AUTOSCROLL){
dx=Math.min(_1d8.H_AUTOSCROLL_VALUE,_1db-html.scrollLeft);
}
}
if(e.clientY<_1d8.V_TRIGGER_AUTOSCROLL){
dy=-_1d8.V_AUTOSCROLL_VALUE;
}else{
if(e.clientY>v.h-_1d8.V_TRIGGER_AUTOSCROLL){
dy=Math.min(_1d8.V_AUTOSCROLL_VALUE,_1da-html.scrollTop);
}
}
window.scrollBy(dx,dy);
};
_1d8._validNodes={"div":1,"p":1,"td":1};
_1d8._validOverflow={"auto":1,"scroll":1};
_1d8.autoScrollNodes=function(e){
var b,t,w,h,rx,ry,dx=0,dy=0,_1dc,_1dd;
for(var n=e.target;n;){
if(n.nodeType==1&&(n.tagName.toLowerCase() in _1d8._validNodes)){
var s=_1d6.getComputedStyle(n),_1de=(s.overflow.toLowerCase() in _1d8._validOverflow),_1df=(s.overflowX.toLowerCase() in _1d8._validOverflow),_1e0=(s.overflowY.toLowerCase() in _1d8._validOverflow);
if(_1de||_1df||_1e0){
b=_1d5.getContentBox(n,s);
t=_1d5.position(n,true);
}
if(_1de||_1df){
w=Math.min(_1d8.H_TRIGGER_AUTOSCROLL,b.w/2);
rx=e.pageX-t.x;
if(has("webkit")||has("opera")){
rx+=win.body().scrollLeft;
}
dx=0;
if(rx>0&&rx<b.w){
if(rx<w){
dx=-w;
}else{
if(rx>b.w-w){
dx=w;
}
}
_1dc=n.scrollLeft;
n.scrollLeft=n.scrollLeft+dx;
}
}
if(_1de||_1e0){
h=Math.min(_1d8.V_TRIGGER_AUTOSCROLL,b.h/2);
ry=e.pageY-t.y;
if(has("webkit")||has("opera")){
ry+=win.body().scrollTop;
}
dy=0;
if(ry>0&&ry<b.h){
if(ry<h){
dy=-h;
}else{
if(ry>b.h-h){
dy=h;
}
}
_1dd=n.scrollTop;
n.scrollTop=n.scrollTop+dy;
}
}
if(dx||dy){
return;
}
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
_1d8.autoScroll(e);
};
return _1d8;
});
},"dojox/html/metrics":function(){
define("dojox/html/metrics",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/sniff","dojo/ready","dojo/_base/unload","dojo/_base/window","dojo/dom-geometry"],function(_1e1,lang,has,_1e2,_1e3,_1e4,_1e5){
var dhm=lang.getObject("dojox.html.metrics",true);
var _1e6=lang.getObject("dojox");
dhm.getFontMeasurements=function(){
var _1e7={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
if(has("ie")){
_1e4.doc.documentElement.style.fontSize="100%";
}
var div=_1e4.doc.createElement("div");
var ds=div.style;
ds.position="absolute";
ds.left="-100px";
ds.top="0";
ds.width="30px";
ds.height="1000em";
ds.borderWidth="0";
ds.margin="0";
ds.padding="0";
ds.outline="0";
ds.lineHeight="1";
ds.overflow="hidden";
_1e4.body().appendChild(div);
for(var p in _1e7){
ds.fontSize=p;
_1e7[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;
}
_1e4.body().removeChild(div);
div=null;
return _1e7;
};
var _1e8=null;
dhm.getCachedFontMeasurements=function(_1e9){
if(_1e9||!_1e8){
_1e8=dhm.getFontMeasurements();
}
return _1e8;
};
var _1ea=null,_1eb={};
dhm.getTextBox=function(text,_1ec,_1ed){
var m,s;
if(!_1ea){
m=_1ea=_1e4.doc.createElement("div");
var c=_1e4.doc.createElement("div");
c.appendChild(m);
s=c.style;
s.overflow="scroll";
s.position="absolute";
s.left="0px";
s.top="-10000px";
s.width="1px";
s.height="1px";
s.visibility="hidden";
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
_1e4.body().appendChild(c);
}else{
m=_1ea;
}
m.className="";
s=m.style;
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
if(arguments.length>1&&_1ec){
for(var i in _1ec){
if(i in _1eb){
continue;
}
s[i]=_1ec[i];
}
}
if(arguments.length>2&&_1ed){
m.className=_1ed;
}
m.innerHTML=text;
var box=_1e5.position(m);
box.w=m.parentNode.scrollWidth;
return box;
};
var _1ee={w:16,h:16};
dhm.getScrollbar=function(){
return {w:_1ee.w,h:_1ee.h};
};
dhm._fontResizeNode=null;
dhm.initOnFontResize=function(_1ef){
var f=dhm._fontResizeNode=_1e4.doc.createElement("iframe");
var fs=f.style;
fs.position="absolute";
fs.width="5em";
fs.height="10em";
fs.top="-10000px";
fs.display="none";
if(has("ie")){
f.onreadystatechange=function(){
if(f.contentWindow.document.readyState=="complete"){
f.onresize=f.contentWindow.parent[_1e6._scopeName].html.metrics._fontresize;
}
};
}else{
f.onload=function(){
f.contentWindow.onresize=f.contentWindow.parent[_1e6._scopeName].html.metrics._fontresize;
};
}
f.setAttribute("src","javascript:'<html><head><script>if(\"loadFirebugConsole\" in window){window.loadFirebugConsole();}</script></head><body></body></html>'");
_1e4.body().appendChild(f);
dhm.initOnFontResize=function(){
};
};
dhm.onFontResize=function(){
};
dhm._fontresize=function(){
dhm.onFontResize();
};
_1e3.addOnUnload(function(){
var f=dhm._fontResizeNode;
if(f){
if(has("ie")&&f.onresize){
f.onresize=null;
}else{
if(f.contentWindow&&f.contentWindow.onresize){
f.contentWindow.onresize=null;
}
}
dhm._fontResizeNode=null;
}
});
_1e2(function(){
try{
var n=_1e4.doc.createElement("div");
n.style.cssText="top:0;left:0;width:100px;height:100px;overflow:scroll;position:absolute;visibility:hidden;";
_1e4.body().appendChild(n);
_1ee.w=n.offsetWidth-n.clientWidth;
_1ee.h=n.offsetHeight-n.clientHeight;
_1e4.body().removeChild(n);
delete n;
}
catch(e){
}
if("fontSizeWatch" in _1e1.config&&!!_1e1.config.fontSizeWatch){
dhm.initOnFontResize();
}
});
return dhm;
});
},"dojo/DeferredList":function(){
define("dojo/DeferredList",["./_base/kernel","./_base/Deferred","./_base/array"],function(dojo,_1f0,_1f1){
dojo.DeferredList=function(list,_1f2,_1f3,_1f4,_1f5){
var _1f6=[];
_1f0.call(this);
var self=this;
if(list.length===0&&!_1f2){
this.resolve([0,[]]);
}
var _1f7=0;
_1f1.forEach(list,function(item,i){
item.then(function(_1f8){
if(_1f2){
self.resolve([i,_1f8]);
}else{
_1f9(true,_1f8);
}
},function(_1fa){
if(_1f3){
self.reject(_1fa);
}else{
_1f9(false,_1fa);
}
if(_1f4){
return null;
}
throw _1fa;
});
function _1f9(_1fb,_1fc){
_1f6[i]=[_1fb,_1fc];
_1f7++;
if(_1f7===list.length){
self.resolve(_1f6);
}
};
});
};
dojo.DeferredList.prototype=new _1f0();
dojo.DeferredList.prototype.gatherResults=function(_1fd){
var d=new dojo.DeferredList(_1fd,false,true,false);
d.addCallback(function(_1fe){
var ret=[];
_1f1.forEach(_1fe,function(_1ff){
ret.push(_1ff[1]);
});
return ret;
});
return d;
};
return dojo.DeferredList;
});
},"gridx/modules/HScroller":function(){
define(["dojo/_base/declare","dojo/dom-style","dojo/_base/sniff","dojo/_base/Deferred","dojo/query","dojox/html/metrics","../core/_Module"],function(_200,_201,_202,_203,_204,_205,_206){
return _200(_206,{name:"hScroller",getAPIPath:function(){
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
if(_202("ie")){
n.style.height=_205.getScrollbar().h+"px";
}
}
},scroll:function(left){
var dn=this.domNode;
if((_202("webkit")||_202("ie")<8)&&!this.grid.isLeftToRight()){
left=dn.scrollWidth-dn.offsetWidth-left;
}
if((_202("ff"))&&!this.grid.isLeftToRight()&&left>0){
left=-left;
}
dn.scrollLeft=left;
},scrollToColumn:function(_207){
var _208=this.grid.header.innerNode,_209=_204("table",_208)[0],_20a=_209.rows[0].cells,left=0,_20b=0,ltr=this.grid.isLeftToRight(),_20c=this.domNode.scrollLeft;
if(!ltr&&(_202("webkit")||_202("ie")<8)){
_20c=this.domNode.scrollWidth-_20c-_208.offsetWidth;
}
_20c=Math.abs(_20c);
for(var i=0;i<_20a.length;i++){
_20b+=_20a[i].offsetWidth;
if(_20a[i].getAttribute("colid")==_207){
break;
}
left+=_20a[i].offsetWidth;
}
if(left<_20c){
this.scroll(left);
}else{
if(_20b>_20c+_208.offsetWidth){
this.scroll(_20b-_208.offsetWidth);
}
}
},refresh:function(){
var t=this,g=t.grid,ltr=g.isLeftToRight(),_20d=ltr?"marginLeft":"marginRight",_20e=ltr?"marginRight":"marginLeft",lead=g.hLayout.lead,tail=g.hLayout.tail,w=(g.domNode.clientWidth||_201.get(g.domNode,"width"))-lead-tail,bn=g.header.innerNode,pl=_201.get(bn,ltr?"paddingLeft":"paddingRight")||0,s=t.domNode.style,sw=bn.firstChild.offsetWidth+pl,_20f=s.display,_210=(sw<=w)?"none":"block";
s[_20d]=lead+pl+"px";
s[_20e]=tail+"px";
s.width=(w-pl<0?0:w-pl)+"px";
t.stubNode.style.width=(sw-pl<0?0:sw-pl)+"px";
s.display=_210;
if(_20f!=_210){
g.vLayout.reLayout();
}
},_lastLeft:0,_onScroll:function(e){
var t=this,s=t.domNode.scrollLeft;
if((_202("webkit")||_202("ie")<8)&&!t.grid.isLeftToRight()){
s=t.domNode.scrollWidth-t.domNode.offsetWidth-s;
}
if(t._lastLeft!=s){
t._lastLeft=s;
t._doScroll();
}
},_doScroll:function(_211){
var t=this,g=t.grid;
g.bodyNode.scrollLeft=t.domNode.scrollLeft;
g.onHScroll(t._lastLeft);
}});
});
},"dojo/dnd/Container":function(){
define("dojo/dnd/Container",["../_base/array","../_base/declare","../_base/event","../_base/kernel","../_base/lang","../_base/window","../dom","../dom-class","../dom-construct","../Evented","../has","../on","../query","../ready","../touch","./common"],function(_212,_213,_214,_215,lang,win,dom,_216,_217,_218,has,on,_219,_21a,_21b,dnd){
var _21c=_213("dojo.dnd.Container",_218,{skipForm:false,allowNested:false,constructor:function(node,_21d){
this.node=dom.byId(node);
if(!_21d){
_21d={};
}
this.creator=_21d.creator||null;
this.skipForm=_21d.skipForm;
this.parent=_21d.dropParent&&dom.byId(_21d.dropParent);
this.map={};
this.current=null;
this.containerState="";
_216.add(this.node,"dojoDndContainer");
if(!(_21d&&_21d._skipStartup)){
this.startup();
}
this.events=[on(this.node,_21b.over,lang.hitch(this,"onMouseOver")),on(this.node,_21b.out,lang.hitch(this,"onMouseOut")),on(this.node,"dragstart",lang.hitch(this,"onSelectStart")),on(this.node,"selectstart",lang.hitch(this,"onSelectStart"))];
},creator:function(){
},getItem:function(key){
return this.map[key];
},setItem:function(key,data){
this.map[key]=data;
},delItem:function(key){
delete this.map[key];
},forInItems:function(f,o){
o=o||_215.global;
var m=this.map,e=dnd._empty;
for(var i in m){
if(i in e){
continue;
}
f.call(o,m[i],i,this);
}
return o;
},clearItems:function(){
this.map={};
},getAllNodes:function(){
return _219((this.allowNested?"":"> ")+".dojoDndItem",this.parent);
},sync:function(){
var map={};
this.getAllNodes().forEach(function(node){
if(node.id){
var item=this.getItem(node.id);
if(item){
map[node.id]=item;
return;
}
}else{
node.id=dnd.getUniqueId();
}
var type=node.getAttribute("dndType"),data=node.getAttribute("dndData");
map[node.id]={data:data||node.innerHTML,type:type?type.split(/\s*,\s*/):["text"]};
},this);
this.map=map;
return this;
},insertNodes:function(data,_21e,_21f){
if(!this.parent.firstChild){
_21f=null;
}else{
if(_21e){
if(!_21f){
_21f=this.parent.firstChild;
}
}else{
if(_21f){
_21f=_21f.nextSibling;
}
}
}
var i,t;
if(_21f){
for(i=0;i<data.length;++i){
t=this._normalizedCreator(data[i]);
this.setItem(t.node.id,{data:t.data,type:t.type});
_21f.parentNode.insertBefore(t.node,_21f);
}
}else{
for(i=0;i<data.length;++i){
t=this._normalizedCreator(data[i]);
this.setItem(t.node.id,{data:t.data,type:t.type});
this.parent.appendChild(t.node);
}
}
return this;
},destroy:function(){
_212.forEach(this.events,function(_220){
_220.remove();
});
this.clearItems();
this.node=this.parent=this.current=null;
},markupFactory:function(_221,node,Ctor){
_221._skipStartup=true;
return new Ctor(node,_221);
},startup:function(){
if(!this.parent){
this.parent=this.node;
if(this.parent.tagName.toLowerCase()=="table"){
var c=this.parent.getElementsByTagName("tbody");
if(c&&c.length){
this.parent=c[0];
}
}
}
this.defaultCreator=dnd._defaultCreator(this.parent);
this.sync();
},onMouseOver:function(e){
var n=e.relatedTarget;
while(n){
if(n==this.node){
break;
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
if(!n){
this._changeState("Container","Over");
this.onOverEvent();
}
n=this._getChildByEvent(e);
if(this.current==n){
return;
}
if(this.current){
this._removeItemClass(this.current,"Over");
}
if(n){
this._addItemClass(n,"Over");
}
this.current=n;
},onMouseOut:function(e){
for(var n=e.relatedTarget;n;){
if(n==this.node){
return;
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
if(this.current){
this._removeItemClass(this.current,"Over");
this.current=null;
}
this._changeState("Container","");
this.onOutEvent();
},onSelectStart:function(e){
if(!this.skipForm||!dnd.isFormElement(e)){
_214.stop(e);
}
},onOverEvent:function(){
},onOutEvent:function(){
},_changeState:function(type,_222){
var _223="dojoDnd"+type;
var _224=type.toLowerCase()+"State";
_216.replace(this.node,_223+_222,_223+this[_224]);
this[_224]=_222;
},_addItemClass:function(node,type){
_216.add(node,"dojoDndItem"+type);
},_removeItemClass:function(node,type){
_216.remove(node,"dojoDndItem"+type);
},_getChildByEvent:function(e){
var node=e.target;
if(node){
for(var _225=node.parentNode;_225;node=_225,_225=node.parentNode){
if((_225==this.parent||this.allowNested)&&_216.contains(node,"dojoDndItem")){
return node;
}
}
}
return null;
},_normalizedCreator:function(item,hint){
var t=(this.creator||this.defaultCreator).call(this,item,hint);
if(!lang.isArray(t.type)){
t.type=["text"];
}
if(!t.node.id){
t.node.id=dnd.getUniqueId();
}
_216.add(t.node,"dojoDndItem");
return t;
}});
dnd._createNode=function(tag){
if(!tag){
return dnd._createSpan;
}
return function(text){
return _217.create(tag,{innerHTML:text});
};
};
dnd._createTrTd=function(text){
var tr=_217.create("tr");
_217.create("td",{innerHTML:text},tr);
return tr;
};
dnd._createSpan=function(text){
return _217.create("span",{innerHTML:text});
};
dnd._defaultCreatorNodes={ul:"li",ol:"li",div:"div",p:"div"};
dnd._defaultCreator=function(node){
var tag=node.tagName.toLowerCase();
var c=tag=="tbody"||tag=="thead"?dnd._createTrTd:dnd._createNode(dnd._defaultCreatorNodes[tag]);
return function(item,hint){
var _226=item&&lang.isObject(item),data,type,n;
if(_226&&item.tagName&&item.nodeType&&item.getAttribute){
data=item.getAttribute("dndData")||item.innerHTML;
type=item.getAttribute("dndType");
type=type?type.split(/\s*,\s*/):["text"];
n=item;
}else{
data=(_226&&item.data)?item.data:item;
type=(_226&&item.type)?item.type:["text"];
n=(hint=="avatar"?dnd._createSpan:c)(String(data));
}
if(!n.id){
n.id=dnd.getUniqueId();
}
return {node:n,data:data,type:type};
};
};
return _21c;
});
},"dojo/dnd/common":function(){
define("dojo/dnd/common",["../_base/connect","../_base/kernel","../_base/lang","../dom"],function(_227,_228,lang,dom){
var _229={};
_229.getCopyKeyState=_227.isCopyKey;
_229._uniqueId=0;
_229.getUniqueId=function(){
var id;
do{
id=_228._scopeName+"Unique"+(++_229._uniqueId);
}while(dom.byId(id));
return id;
};
_229._empty={};
_229.isFormElement=function(e){
var t=e.target;
if(t.nodeType==3){
t=t.parentNode;
}
return " button textarea input select option ".indexOf(" "+t.tagName.toLowerCase()+" ")>=0;
};
lang.mixin(lang.getObject("dojo.dnd",true),_229);
return _229;
});
},"gridx/modules/move/Column":function(){
define("gridx/modules/move/Column",["dojo/_base/declare","dojo/_base/query","dojo/_base/array","dojo/keys","../../core/_Module"],function(_22a,_22b,_22c,keys,_22d){
return _22a(_22d,{name:"moveColumn",getAPIPath:function(){
return {move:{column:this}};
},preload:function(){
this.aspect(this.grid,"onHeaderCellKeyDown","_onKeyDown");
},columnMixin:{moveTo:function(_22e){
this.grid.move.column.moveRange(this.index(),1,_22e);
return this;
}},moveSelected:true,move:function(_22f,_230){
if(typeof _22f==="number"){
_22f=[_22f];
}
var map=[],i,len,_231=this.grid._columns,pos,_232=[];
for(i=0,len=_22f.length;i<len;++i){
map[_22f[i]]=true;
}
for(i=map.length-1;i>=0;--i){
if(map[i]){
_232.unshift(_231[i]);
_231.splice(i,1);
}
}
for(i=0,len=_231.length;i<len;++i){
if(_231[i].index>=_230){
pos=i;
break;
}
}
if(pos===undefined){
pos=_231.length;
}
this._moveComplete(_232,pos);
},moveRange:function(_233,_234,_235){
if(_235<_233||_235>_233+_234){
if(_235>_233+_234){
_235-=_234;
}
this._moveComplete(this.grid._columns.splice(_233,_234),_235);
}
},onMoved:function(){
},_moveComplete:function(_236,_237){
var g=this.grid,map={},_238=g._columns,i,_239={},_23a=_237<_238.length?_238[_237].id:null,_23b=function(tr){
var _23c=_22b("> .gridxCell",tr).filter(function(_23d){
return _239[_23d.getAttribute("colid")];
});
if(_23a===null){
_23c.place(tr);
}else{
_23c.place(_22b("> [colid=\""+_23a+"\"]",tr)[0],"before");
}
};
for(i=_236.length-1;i>=0;--i){
map[_236[i].index]=_237+i;
_239[_236[i].id]=1;
}
[].splice.apply(_238,[_237,0].concat(_236));
for(i=_238.length-1;i>=0;--i){
_238[i].index=i;
}
_23b(_22b(".gridxHeaderRowInner > table > tbody > tr",g.headerNode)[0]);
_22b(".gridxRow > table > tbody > tr",g.bodyNode).forEach(_23b);
this.onMoved(map);
},_onKeyDown:function(e){
var t=this,g=t.grid,_23e=t.arg("moveSelected")&&g.select&&g.select.column,ltr=g.isLeftToRight(),_23f=ltr?keys.LEFT_ARROW:keys.RIGHT_ARROW,_240=ltr?keys.RIGHT_ARROW:keys.LEFT_ARROW;
if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&(e.keyCode==_23f||e.keyCode==_240)){
var _241=e.columnIndex,_242=_23e&&_23e.isSelected(e.columnId)?_22c.map(_23e.getSelected(),function(id){
return g._columnsById[id].index;
}):[e.columnIndex],node=g.header.getHeaderNode(e.columnId);
if(e.keyCode==_23f){
while(_22c.indexOf(_242,_241)>=0){
_241--;
}
if(_241>=0){
t.move(_242,_241);
g.header._focusNode(node);
}
}else{
if(e.keyCode==_240){
while(_22c.indexOf(_242,_241)>=0){
_241++;
}
if(_241<g._columns.length){
t.move(_242,_241+1);
g.header._focusNode(node);
}
}
}
}
}});
});
},"gridx/modules/AutoScroll":function(){
define("gridx/modules/AutoScroll",["dojo/_base/declare","dojo/_base/window","dojo/dom-geometry","../core/_Module"],function(_243,win,_244,_245){
return _245.register(_243(_245,{name:"autoScroll",constructor:function(){
this.connect(win.doc,"mousemove","_onMouseMove");
},getAPIPath:function(){
return {autoScroll:this};
},enabled:false,vertical:true,horizontal:true,margin:20,_timeout:100,_step:10,_maxMargin:100,_onMouseMove:function(e){
var t=this;
if(t.arg("enabled")){
var d1,d2,g=t.grid,m=t.arg("margin"),pos=_244.position(g.bodyNode);
if(t.arg("vertical")&&g.vScroller){
d1=e.clientY-pos.y-m;
d2=d1+2*m-pos.h;
t._vdir=d1<0?d1:(d2>0?d2:0);
}
if(t.arg("horizontal")&&g.hScroller){
d1=e.clientX-pos.x-m;
d2=d1+2*m-pos.w;
t._hdir=d1<0?d1:(d2>0?d2:0);
}
if(!t._handler){
t._scroll();
}
}
},_scroll:function(){
var t=this;
if(t.arg("enabled")){
var dir,a,_246,g=t.grid,m=t._maxMargin,s=t._step,v=t._vdir,h=t._hdir;
if(t.arg("vertical")&&v){
dir=v>0?1:-1;
a=Math.min(m,Math.abs(v))/s;
a=(a<1?1:a)*s*dir;
g.vScroller.domNode.scrollTop+=a;
_246=1;
}
if(t.arg("horizontal")&&h){
dir=h>0?1:-1;
a=Math.min(m,Math.abs(h))/s;
a=(a<1?1:a)*s*dir;
g.hScroller.domNode.scrollLeft+=a;
_246=1;
}
if(_246){
t._handler=setTimeout(function(){
t._scroll();
},t._timeout);
return;
}
}
delete t._handler;
}}));
});
},"gridx/core/model/cache/Sync":function(){
define("gridx/core/model/cache/Sync",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred","./_Cache"],function(_247,lang,_248,_249){
return _247(_249,{keep:function(){
},free:function(){
},when:function(args,_24a){
var d=new _248();
try{
if(_24a){
_24a();
}
d.callback();
}
catch(e){
d.errback(e);
}
return d;
},_init:function(){
var t=this;
if(!t._filled){
t._storeFetch({start:0});
if(t.store.getChildren){
t._fetchChildren();
}
t.model._onSizeChange();
}
},_fetchChildren:function(){
var s=this._struct,pids=s[""].slice(1),pid,_24b=function(pid){
[].push.apply(pids,s[pid].slice(1));
};
while(pids.length){
pid=pids.shift();
_248.when(this._loadChildren(pid),lang.partial(_24b,pid));
}
}});
});
},"gridx/modules/dnd/Avatar":function(){
define(["dojo/_base/declare","dojo/dom-class","dojo/dom-construct","dojo/_base/window","dojo/dnd/Avatar"],function(_24c,_24d,_24e,win,_24f){
return _24c(_24f,{construct:function(_250){
var t=this;
t.isA11y=_24d.contains(win.body(),"dijit_a11y");
t.node=_24e.toDom(["<table border='0' cellspacing='0' class='gridxDndAvatar' ","style='position: absolute; z-index: 1999; margin: 0'>","<tbody><tr style='opacity: 0.9;'>","<td class='gridxDnDIcon'>",t.isA11y?"<span id='a11yIcon'>"+(t.manager.copy?"+":"<")+"</span>":"","</td>","<td class='gridxDnDItemIcon ",t._getIconClass(),"'></td>","<td><span class='gridxDnDItemCount'>",t._generateText(),"</span></td>","</tr></tbody></table>"].join(""));
},_getIconClass:function(){
var info=this.manager._dndInfo;
return ["gridxDnDIcon",info.cssName,info.count===1?"Single":"Multi"].join("");
},_generateText:function(){
return "("+this.manager._dndInfo.count+")";
}});
});
},"gridx/core/model/extensions/Query":function(){
define(["dojo/_base/declare","../_Extension"],function(_251,_252){
return _251(_252,{name:"query",priority:40,constructor:function(_253,args){
this.clear();
this._mixinAPI("query");
if(args.query){
this.query(args.query,args.queryOptions);
}
},clear:function(){
},query:function(){
this.model._addCmd({name:"_cmdQuery",scope:this,args:arguments});
},_cmdQuery:function(){
var a=arguments,args=a[a.length-1],m=this.model,c=m._cache,op=c.options=c.options||{};
op.query=args[0];
op.queryOptions=args[1];
m._msg("storeChange");
c.clear();
}});
});
},"gridx/modules/HLayout":function(){
define("gridx/modules/HLayout",["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/array","dojo/dom-style","dojo/DeferredList","../core/_Module"],function(_254,_255,_256,_257,_258,_259){
return _254(_259,{name:"hLayout",getAPIPath:function(){
return {hLayout:this};
},load:function(args,_25a){
var t=this;
t.connect(t.grid,"_onResizeEnd",function(_25b,ds){
var d,dl=[];
for(d in ds){
dl.push(ds[d]);
}
new _258(dl).then(function(){
t.reLayout();
});
});
_25a.then(function(){
t._layout();
});
},lead:0,tail:0,register:function(_25c,_25d,_25e){
var r=this._regs=this._regs||[];
if(!_25c){
_25c=new _255();
_25c.callback();
}
r.push([_25c,_25d,_25e]);
},reLayout:function(){
var t=this,r=t._regs,lead=0,tail=0;
if(r){
_256.forEach(r,function(reg){
var w=reg[1].offsetWidth||_257.get(reg[1],"width");
if(reg[2]){
tail+=w;
}else{
lead+=w;
}
});
t.lead=lead;
t.tail=tail;
t.onUpdateWidth(lead,tail);
}
},onUpdateWidth:function(){
},_layout:function(){
var t=this,r=t._regs;
if(r){
var lead=0,tail=0,dl=_256.map(r,function(reg){
return reg[0];
});
new _258(dl).then(function(){
_256.forEach(r,function(reg){
var w=reg[1].offsetWidth||_257.get(reg[1],"width");
if(reg[2]){
tail+=w;
}else{
lead+=w;
}
});
t.lead=lead;
t.tail=tail;
t.loaded.callback();
});
}else{
t.loaded.callback();
}
}});
});
},"gridx/modules/dnd/_Dnd":function(){
define("gridx/modules/dnd/_Dnd",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred","dojo/dom-construct","dojo/dom-geometry","dojo/dom-class","dojo/dom-style","dojo/dom","dojo/_base/window","dojo/_base/sniff","dojo/dnd/Source","dojo/dnd/Manager","../../core/_Module","../AutoScroll"],function(_25f,lang,_260,_261,_262,_263,_264,dom,win,_265,_266,_267,_268){
var _269=lang.hitch;
return _268.register(_25f(_268,{name:"_dnd",constructor:function(){
var t=this,g=t.grid,doc=win.doc;
t.accept=[];
t._profiles={};
t._selectStatus={};
t._node=_261.create("div");
t.batchConnect([g,"onCellMouseOver","_checkDndReady"],[g,"onCellMouseOut","_dismissDndReady"],[g,"onCellMouseDown","_beginDnd"],[doc,"onmouseup","_endDnd"],[doc,"onmousemove","_onMouseMove"]);
t.subscribe("/dnd/cancel","_endDnd");
},load:function(args){
var t=this,n=t.grid.mainNode;
t._source=new _266(n,{isSource:false,accept:t.accept,getSelectedNodes:function(){
return [0];
},getItem:_269(t,"_getItem"),checkAcceptance:_269(t,"_checkAcceptance"),onDraggingOver:_269(t,"_onDraggingOver"),onDraggingOut:_269(t,"_onDraggingOut"),onDropExternal:_269(t,"_onDropExternal"),onDropInternal:_269(t,"_onDropInternal")});
if(_265("ff")){
t._fixFF(t._source,n);
}
t._source.grid=t.grid;
t._saveSelectStatus();
t.loaded.callback();
},destroy:function(){
this.inherited(arguments);
this._source.destroy();
_261.destroy(this._node);
},getAPIPath:function(){
return {dnd:{_dnd:this}};
},profile:null,register:function(name,_26a){
this._profiles[name]=_26a;
[].push.apply(this.accept,_26a.arg("accept"));
},_fixFF:function(_26b){
return this.connect(win.doc,"onmousemove",function(evt){
var pos=_262.position(_26b.node),x=evt.clientX,y=evt.clientY,_26c=_26b._alreadyIn,isIn=y>=pos.y&&y<=pos.y+pos.h&&x>=pos.x&&x<=pos.x+pos.w;
if(!_26c&&isIn){
_26b._alreadyIn=1;
_26b.onOverEvent();
}else{
if(_26c&&!isIn){
_26b._alreadyIn=0;
_26b.onOutEvent();
}
}
});
},_onMouseMove:function(evt){
var t=this;
if(t._alreadyIn&&(t._dnding||t._extDnding)){
t._markTargetAnchor(evt);
}
},_saveSelectStatus:function(_26d){
var name,_26e,_26f=this.grid.select;
if(_26f){
for(name in _26f){
_26e=_26f[name];
if(_26e&&lang.isObject(_26e)){
this._selectStatus[name]=_26e.arg("enabled");
if(_26d!==undefined){
_26e.enabled=_26d;
}
}
}
}
},_loadSelectStatus:function(){
var name,_270,_271=this.grid.select;
if(_271){
for(name in _271){
_270=_271[name];
if(_270&&lang.isObject(_270)){
_270.enabled=this._selectStatus[name];
}
}
}
},_checkDndReady:function(evt){
var t=this,name,p;
if(!t._dndReady&&!t._dnding&&!t._extDnding){
for(name in t._profiles){
p=t._profiles[name];
if(p.arg("enabled")&&p._checkDndReady(evt)){
t.profile=p;
t._saveSelectStatus(false);
_263.add(win.body(),"gridxDnDReadyCursor");
t._dndReady=1;
return;
}
}
}
},_dismissDndReady:function(){
if(this._dndReady){
this._loadSelectStatus();
this._dndReady=0;
_263.remove(win.body(),"gridxDnDReadyCursor");
}
},_beginDnd:function(evt){
var t=this;
t._checkDndReady(evt);
if(t._dndReady){
var p=t.profile,m=_267.manager();
t._source.isSource=true;
t._source.canNotDragOut=!p.arg("provide").length;
t._node.innerHTML=p._buildDndNodes();
t._oldStartDrag=m.startDrag;
m.startDrag=_269(t,"_startDrag",evt);
if(t.avatar){
t._oldMakeAvatar=m.makeAvatar;
m.makeAvatar=function(){
return new t.avatar(m);
};
}
m._dndInfo={cssName:p._cssName,count:p._getDndCount()};
p._onBeginDnd(t._source);
dom.setSelectable(t.grid.domNode,false);
}
},_endDnd:function(){
var t=this,m=_267.manager();
t._source.isSource=false;
t._alreadyIn=0;
delete m._dndInfo;
if(t._oldStartDrag){
m.startDrag=t._oldStartDrag;
delete t._oldStartDrag;
}
if(t._oldMakeAvatar){
m.makeAvatar=t._oldMakeAvatar;
delete t._oldMakeAvatar;
}
if(t._dndReady||t._dnding||t._extDnding){
t._dnding=t._extDnding=0;
t._destroyUI();
dom.setSelectable(t.grid.domNode,true);
_263.remove(win.body(),"gridxDnDReadyCursor");
t.profile._onEndDnd();
t._loadSelectStatus();
}
},_createUI:function(){
_263.add(win.body(),"gridxDnDCursor");
if(this.grid.autoScroll){
this.profile._onBeginAutoScroll();
this.grid.autoScroll.enabled=true;
}
},_destroyUI:function(){
var t=this;
t._unmarkTargetAnchor();
_263.remove(win.body(),"gridxDnDCursor");
if(t.grid.autoScroll){
t.profile._onEndAutoScroll();
t.grid.autoScroll.enabled=false;
}
},_createTargetAnchor:function(){
return _261.create("div",{"class":"gridxDnDAnchor"});
},_markTargetAnchor:function(evt){
var t=this;
if(t._extDnding||t.profile.arg("canRearrange")){
var _272=t._targetAnchor,_273=_262.position(t.grid.mainNode);
if(!_272){
_272=t._targetAnchor=t._createTargetAnchor();
_272.style.display="none";
t.grid.mainNode.appendChild(_272);
}
_263.add(_272,"gridxDnDAnchor"+t.profile._cssName);
var pos=t.profile._calcTargetAnchorPos(evt,_273);
if(pos){
_264.set(_272,pos);
_272.style.display="block";
}else{
_272.style.display="none";
}
}
},_unmarkTargetAnchor:function(){
var _274=this._targetAnchor;
if(_274){
_274.style.display="none";
_263.remove(_274,"gridxDnDAnchor"+this.profile._cssName);
}
},_startDrag:function(evt,_275,_276,copy){
var t=this;
if(t._dndReady&&_275===t._source){
t._oldStartDrag.call(_267.manager(),_275,t._node.childNodes,copy);
t._dndReady=0;
t._dnding=t._alreadyIn=1;
t._createUI();
t._markTargetAnchor(evt);
}
},_getItem:function(id){
return {type:this.profile.arg("provide"),data:this.profile._getItemData(id)};
},_checkAcceptance:function(_277,_278){
var t=this,_279=function(arr){
var res={};
for(var i=arr.length-1;i>=0;--i){
res[arr[i]]=1;
}
return res;
},_27a=_266.prototype.checkAcceptance,res=_27a.apply(t._source,arguments);
if(res){
if(_277.grid===t.grid){
return t.profile.arg("canRearrange");
}
if(!_277.canNotDragOut){
for(var name in t._profiles){
var p=t._profiles[name];
var _27b=_27a.apply({accept:_279(p.arg("accept"))},arguments);
if(p.arg("enabled")&&_27b&&(!p.checkAcceptance||p.checkAcceptance.apply(p,arguments))){
t.profile=p;
t._extDnding=1;
return true;
}
}
}
}
return false;
},_onDraggingOver:function(){
var t=this;
if(t._dnding||t._extDnding){
t._alreadyIn=1;
t._createUI();
}
},_onDraggingOut:function(){
var t=this;
if(t._dnding||t._extDnding){
t._alreadyIn=0;
t._destroyUI();
}
},_onDropInternal:function(_27c,copy){
this.profile._onDropInternal(_27c,copy);
},_onDropExternal:function(_27d,_27e,copy){
var t=this,_27f=t.profile._onDropExternal(_27d,_27e,copy);
_260.when(_27f,function(){
if(!copy){
if(_27d.grid){
_27d.grid.dnd._dnd.profile.onDraggedOut(t._source);
}else{
_27d.deleteSelectedNodes();
}
}
});
}}));
});
},"gridx/core/Cell":function(){
define("gridx/core/Cell",["dojo/_base/declare"],function(_280){
return _280([],{constructor:function(grid,row,_281){
var t=this;
t.grid=grid;
t.model=grid.model;
t.row=row;
t.column=_281;
},data:function(){
return this.model.byId(this.row.id).data[this.column.id];
},rawData:function(){
var t=this,f=t.column.field();
return f&&t.model.byId(t.row.id).rawData[f];
},setRawData:function(_282){
var obj={},_283=this.column.field();
if(_283){
obj[_283]=_282;
return this.row.setRawData(obj);
}
}});
});
},"gridx/modules/dnd/Column":function(){
define("gridx/modules/dnd/Column",["dojo/_base/declare","dojo/_base/array","dojo/dom-geometry","dojo/dom-class","dojo/_base/query","./_Base","../../core/_Module"],function(_284,_285,_286,_287,_288,_289,_28a){
return _284(_289,{name:"dndColumn",required:["_dnd","selectColumn","moveColumn"],getAPIPath:function(){
return {dnd:{column:this}};
},preload:function(){
var t=this,g=t.grid;
t.inherited(arguments);
t._selector=g.select.column;
},accept:[],provide:["grid/columns"],_checkDndReady:function(evt){
var t=this;
if(t._selector.isSelected(evt.columnId)){
t._selectedColIds=t._selector.getSelected();
t.grid.dnd._dnd.profile=t;
return true;
}
return false;
},onDraggedOut:function(){
},_cssName:"Column",_onBeginDnd:function(_28b){
_28b.delay=this.arg("delay");
},_getDndCount:function(){
return this._selectedColIds.length;
},_onEndDnd:function(){
},_buildDndNodes:function(){
var gid=this.grid.id;
return _285.map(this._selectedColIds,function(_28c){
return ["<div id='",gid,"_dndcolumn_",_28c,"' gridid='",gid,"' columnid='",_28c,"'></div>"].join("");
}).join("");
},_onBeginAutoScroll:function(){
var _28d=this.grid.autoScroll;
this._autoScrollV=_28d.vertical;
_28d.vertical=false;
},_onEndAutoScroll:function(){
this.grid.autoScroll.vertical=this._autoScrollV;
},_getItemData:function(id){
return id.substring((this.grid.id+"_dndcolumn_").length);
},_calcTargetAnchorPos:function(evt,_28e){
var node=evt.target,t=this,g=t.grid,ltr=g.isLeftToRight(),_28f=g._columns,ret={height:_28e.h+"px",width:"",top:""},func=function(n){
var id=n.getAttribute("colid"),_290=g._columnsById[id].index,_291=n,last=n,_292=_290,_293=_290;
if(t._selector.isSelected(id)){
_292=_290;
while(_292>0&&t._selector.isSelected(_28f[_292-1].id)){
--_292;
}
_291=_288(".gridxHeaderRow [colid='"+_28f[_292].id+"']",g.headerNode)[0];
_293=_290;
while(_293<_28f.length-1&&t._selector.isSelected(_28f[_293+1].id)){
++_293;
}
last=_288(".gridxHeaderRow [colid='"+_28f[_293].id+"']",g.headerNode)[0];
}
if(_291&&last){
var _294=_286.position(_291),_295=_286.position(last),_296=(_294.x+_295.x+_295.w)/2,pre=evt.clientX<_296;
if(pre){
ret.left=(_294.x-_28e.x-1)+"px";
}else{
ret.left=(_295.x+_295.w-_28e.x-1)+"px";
}
t._target=pre^ltr?_293+1:_292;
}else{
delete t._target;
}
return ret;
};
while(node){
if(_287.contains(node,"gridxCell")){
return func(node);
}
node=node.parentNode;
}
var _297=_288(".gridxRow",g.bodyNode)[0],_298=_286.position(_297.firstChild);
if(_298.x+_298.w<=evt.clientX){
ret.left=(_298.x+_298.w-_28e.x-1)+"px";
t._target=_28f.length;
}else{
if(_298.x>=evt.clientX){
ret.left=(_298.x-_28e.x-1)+"px";
t._target=0;
}else{
if(_288(".gridxCell",_297).some(function(_299){
var _29a=_286.position(_299);
if(_29a.x<=evt.clientX&&_29a.x+_29a.w>=evt.clientX){
node=_299;
return true;
}
})){
return func(node);
}
}
}
return ret;
},_onDropInternal:function(_29b,copy){
var t=this;
if(t._target>=0){
var _29c=_285.map(t._selectedColIds,function(_29d){
return t.grid._columnsById[_29d].index;
});
t.grid.move.column.move(_29c,t._target);
}
},_onDropExternal:function(){
}});
});
},"gridx/modules/Body":function(){
define("gridx/modules/Body",["dojo/_base/declare","dojo/_base/query","dojo/_base/array","dojo/_base/lang","dojo/dom-construct","dojo/dom-class","dojo/_base/Deferred","dojo/_base/sniff","dojo/keys","../core/_Module","../util","dojo/i18n!../nls/Body"],function(_29e,_29f,_2a0,lang,_2a1,_2a2,_2a3,_2a4,keys,_2a5,util,nls){
return _29e(_2a5,{name:"body",optional:["tree"],getAPIPath:function(){
return {body:this};
},constructor:function(){
var t=this,m=t.model,g=t.grid,dn=t.domNode=g.bodyNode,_2a6=function(){
t.refresh();
};
if(t.arg("rowHoverEffect")){
_2a2.add(dn,"gridxBodyRowHoverEffect");
}
g.emptyNode.innerHTML=t.arg("loadingInfo",nls.loadingInfo);
g._connectEvents(dn,"_onMouseEvent",t);
t.aspect(m,"onDelete","_onDelete");
t.aspect(m,"onSet","_onSet");
t.aspect(g,"onRowMouseOver","_onRowMouseOver");
t.aspect(g,"onCellMouseOver","_onCellMouseOver");
t.aspect(g,"onCellMouseOut","_onCellMouseOver");
t.connect(g.bodyNode,"onmouseleave",function(){
_29f("> .gridxRowOver",t.domNode).removeClass("gridxRowOver");
});
t.connect(g.bodyNode,"onmouseover",function(e){
if(e.target==g.bodyNode){
_29f("> .gridxRowOver",t.domNode).removeClass("gridxRowOver");
}
});
t.aspect(g,"setStore",_2a6);
},preload:function(){
this._initFocus();
},load:function(args){
var t=this,m=t.model,g=t.grid,_2a7=function(){
t.aspect(m,"onSizeChange","_onSizeChange");
t.loaded.callback();
};
m.when({},function(){
t.rootCount=t.rootCount||m.size();
t.visualCount=g.tree?g.tree.getVisualSize(t.rootStart,t.rootCount):t.rootCount;
_2a7();
}).then(null,function(e){
t._loadFail(e);
_2a7();
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
}},rowHoverEffect:true,stuffEmptyCell:true,getRowNode:function(args){
var _2a8=this._getRowNodeQuery(args);
return _2a8&&_29f("> "+_2a8,this.domNode)[0]||null;
},getCellNode:function(args){
var t=this,_2a9=args.colId,cols=t.grid._columns,r=t._getRowNodeQuery(args);
if(r){
if(!_2a9&&cols[args.colIndex]){
_2a9=cols[args.colIndex].id;
}
r+=" [colid='"+_2a9+"'].gridxCell";
return _29f(r,t.domNode)[0]||null;
}
return null;
},getRowInfo:function(args){
var t=this,m=t.model,g=t.grid,id=args.rowId;
if(id){
args.rowIndex=m.idToIndex(id);
args.parentId=m.parentId(id);
}
if(typeof args.rowIndex=="number"&&args.rowIndex>=0){
args.visualIndex=g.tree?g.tree.getVisualIndexByRowInfo(args.parentId,args.rowIndex,t.rootStart):args.rowIndex-t.rootStart;
}else{
if(typeof args.visualIndex=="number"&&args.visualIndex>=0){
if(g.tree){
var info=g.tree.getRowInfoByVisualIndex(args.visualIndex,t.rootStart);
args.rowIndex=info.start;
args.parentId=info.parentId;
}else{
args.rowIndex=t.rootStart+args.visualIndex;
}
}else{
return args;
}
}
args.rowId=id||m.indexToId(args.rowIndex,args.parentId);
return args;
},refresh:function(_2aa){
var t=this;
delete t._err;
return t.model.when({}).then(function(){
var rs=t.renderStart,rc=t.renderCount;
if(typeof _2aa=="number"&&_2aa>=0){
_2aa=rs>_2aa?rs:_2aa;
var _2ab=rs+rc-_2aa,n=_29f("> [visualindex=\""+_2aa+"\"]",t.domNode)[0],_2ac=[],_2ad=[];
if(n){
var rows=t._buildRows(_2aa,_2ab,_2ac,_2ad);
if(rows){
_2a1.place(rows,n,"before");
_2a0.forEach(_2ad,t.onAfterRow,t);
}
}
while(n){
var tmp=n.nextSibling,vidx=parseInt(n.getAttribute("visualindex"),10),id=n.getAttribute("rowid");
_2a1.destroy(n);
if(vidx>=_2aa+_2ab){
t.onUnrender(id);
}
n=tmp;
}
_2a3.when(t._buildUncachedRows(_2ac),function(){
t.onRender(_2aa,_2ab);
t.onForcedScroll();
});
}else{
t.renderRows(rs,rc,0,1);
t.onForcedScroll();
}
},function(e){
t._loadFail(e);
});
},refreshCell:function(_2ae,_2af){
var d=new _2a3(),t=this,m=t.model,g=t.grid,col=g._columns[_2af],_2b0=col&&t.getCellNode({visualIndex:_2ae,colId:col.id});
if(_2b0){
var _2b1,_2b2=t.getRowInfo({visualIndex:_2ae}),idx=_2b2.rowIndex,pid=_2b2.parentId;
m.when({start:idx,count:1,parentId:pid},function(){
_2b1=m.byIndex(idx,pid);
if(_2b1){
_2b2.rowId=m.indexToId(idx,pid);
var _2b3=g.tree&&_2b1.data[col.id]===undefined;
var cell=g.cell(_2b2.rowId,col.id,1);
_2b0.innerHTML=t._buildCellContent(cell,_2b3);
t.onAfterCell(cell);
}
}).then(function(){
d.callback(!!_2b1);
});
return d;
}
d.callback(false);
return d;
},rootStart:0,rootCount:0,renderStart:0,renderCount:0,visualStart:0,visualCount:0,autoUpdate:true,autoChangeSize:true,updateRootRange:function(_2b4,_2b5){
var t=this,tree=t.grid.tree,vc=t.visualCount=tree?tree.getVisualSize(_2b4,_2b5):_2b5;
t.rootStart=_2b4;
t.rootCount=_2b5;
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
},renderRows:function(_2b6,_2b7,_2b8,_2b9){
var t=this,g=t.grid,str="",_2ba=[],_2bb=[],n=t.domNode,en=g.emptyNode,_2bc=t.arg("emptyInfo",nls.emptyInfo),_2bd="";
if(t._err){
return;
}
if(_2b7>0){
en.innerHTML=t.arg("loadingInfo",nls.loadingInfo);
en.style.zIndex="";
if(_2b8!="top"&&_2b8!="bottom"){
t.model.free();
}
str=t._buildRows(_2b6,_2b7,_2ba,_2bb);
if(_2b8=="top"){
t.renderCount+=t.renderStart-_2b6;
t.renderStart=_2b6;
_2a1.place(str,n,"first");
}else{
if(_2b8=="bottom"){
t.renderCount=_2b6+_2b7-t.renderStart;
_2a1.place(str,n,"last");
}else{
t.renderStart=_2b6;
t.renderCount=_2b7;
var _2be=_2b9?n.scrollTop:0;
n.scrollTop=0;
if(_2a4("ie")){
while(n.childNodes.length){
n.removeChild(n.firstChild);
}
}
n.innerHTML=str;
if(_2be){
n.scrollTop=_2be;
}
n.scrollLeft=g.hScrollerNode.scrollLeft;
_2bd=str?"":_2bc;
if(!str){
en.style.zIndex=1;
}
t.onUnrender();
}
}
_2a0.forEach(_2bb,t.onAfterRow,t);
_2a3.when(t._buildUncachedRows(_2ba),function(){
en.innerHTML=_2bd;
t.onRender(_2b6,_2b7);
});
}else{
if(!{top:1,bottom:1}[_2b8]){
n.scrollTop=0;
n.innerHTML="";
en.innerHTML=_2bc;
en.style.zIndex=1;
t.onUnrender();
t.onEmpty();
t.model.free();
}
}
},unrenderRows:function(_2bf,_2c0){
if(_2bf>0){
var t=this,i=0,id,bn=t.domNode;
if(_2c0=="post"){
for(;i<_2bf&&bn.lastChild;++i){
id=bn.lastChild.getAttribute("rowid");
t.model.free(id);
bn.removeChild(bn.lastChild);
t.onUnrender(id);
}
}else{
var tp=bn.scrollTop;
for(;i<_2bf&&bn.firstChild;++i){
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
},_getRowNodeQuery:function(args){
var r;
if(this.model.isId(args.rowId)){
r="[rowid='"+args.rowId+"']";
}else{
if(typeof args.rowIndex=="number"&&args.rowIndex>=0){
r="[rowindex='"+args.rowIndex+"']";
if(args.parentId){
r+="[parentid='"+args.parentId+"']";
}
}else{
if(typeof args.visualIndex=="number"&&args.visualIndex>=0){
r="[visualindex='"+args.visualIndex+"']";
}
}
}
return r&&r+".gridxRow";
},_buildRows:function(_2c1,_2c2,_2c3,_2c4){
var t=this,i,end=_2c1+_2c2,s=[],g=t.grid,m=t.model,w=t.domNode.scrollWidth;
for(i=_2c1;i<end;++i){
var _2c5=t.getRowInfo({visualIndex:i}),row=g.row(_2c5.rowId,1);
s.push("<div class=\"gridxRow ",i%2?"gridxRowOdd":"","\" role=\"row\" visualindex=\"",i);
if(row){
m.keep(row.id);
s.push("\" rowid=\"",row.id,"\" rowindex=\"",_2c5.rowIndex,"\" parentid=\"",_2c5.parentId,"\">",t._buildCells(row),"</div>");
_2c4.push(row);
}else{
s.push("\"><div class=\"gridxRowDummy\" style=\"width:",w,"px;\"></div></div>");
_2c5.start=_2c5.rowIndex;
_2c5.count=1;
_2c3.push(_2c5);
}
}
return s.join("");
},_buildUncachedRows:function(_2c6){
var t=this;
return _2c6.length&&t.model.when(_2c6,function(){
try{
_2a0.forEach(_2c6,t._buildRowContent,t);
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
en.innerHTML=this.arg("loadFailInfo",nls.loadFailInfo);
en.style.zIndex=1;
this.domNode.innerHTML="";
this._err=1;
},_buildRowContent:function(_2c7){
var t=this,n=_29f("> [visualindex=\""+_2c7.visualIndex+"\"]",t.domNode)[0];
if(n){
var row=t.grid.row(_2c7.rowIndex,0,_2c7.parentId);
if(row){
t.model.keep(row.id);
n.setAttribute("rowid",row.id);
n.setAttribute("rowindex",_2c7.rowIndex);
n.setAttribute("parentid",_2c7.parentId||"");
n.innerHTML=t._buildCells(row);
t.onAfterRow(row);
}else{
throw new Error("Row is not in cache:"+_2c7.rowIndex);
}
}
},_buildCells:function(row){
var col,cell,_2c8,cls,_2c9,i,len,t=this,g=t.grid,_2ca=g._columns,_2cb=row.data(),_2cc=g.focus&&(g.focus.currentArea()=="body"),sb=["<table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>"];
for(i=0,len=_2ca.length;i<len;++i){
col=_2ca[i];
_2c8=g.tree&&_2cb[col.id]===undefined;
cell=g.cell(row.id,col.id,1);
cls=(lang.isFunction(col["class"])?col["class"](cell):col["class"])||"";
_2c9=(lang.isFunction(col.style)?col.style(cell):col.style)||"";
sb.push("<td aria-describedby=\"",g.id,"-",col.id,"\" class=\"gridxCell ");
if(_2c8){
sb.push("gridxPaddingCell");
}
if(_2cc&&t._focusCellRow===row.visualIndex()&&t._focusCellCol===i){
sb.push("gridxCellFocus");
}
sb.push(cls,"\" role=\"gridcell\" tabindex=\"-1\" colid=\"",col.id,"\" style=\"width: ",col.width,"; ",_2c9,"\">",t._buildCellContent(cell,_2c8),"</td>");
}
sb.push("</tr></table>");
return sb.join("");
},_buildCellContent:function(cell,_2cd){
var r="",col=cell.column,row=cell.row,data=cell.data();
if(!_2cd){
var s=col.decorator?col.decorator(data,row.id,row.visualIndex()):data;
r=this._wrapCellData(s,row.id,col.id);
}
return (r===""||r===null||r===undefined)&&(_2a4("ie")<8||this.arg("stuffEmptyCell"))?"&nbsp;":r;
},_wrapCellData:function(_2ce,_2cf,_2d0){
var _2d1=[];
this.collectCellWrapper(_2d1,_2cf,_2d0);
var i=_2d1.length-1;
if(i>0){
_2d1.sort(function(a,b){
a.priority=a.priority||0;
b.priority=b.priority||0;
return a.priority-b.priority;
});
}
for(;i>=0;--i){
_2ce=_2d1[i].wrap(_2ce,_2cf,_2d0);
}
return _2ce;
},_onMouseEvent:function(_2d2,e){
var g=this.grid,_2d3="onCell"+_2d2,_2d4="onRow"+_2d2;
if(g._isConnected(_2d3)||g._isConnected(_2d4)){
this._decorateEvent(e);
if(e.rowId){
if(e.columnId){
g[_2d3](e);
}
g[_2d4](e);
}
}
},_decorateEvent:function(e){
var n=e.target||e.originalTarget,g=this.grid,tag;
for(;n&&n!=g.bodyNode;n=n.parentNode){
tag=n.tagName.toLowerCase();
if(tag=="td"&&_2a2.contains(n,"gridxCell")){
var col=g._columnsById[n.getAttribute("colid")];
e.cellNode=n;
e.columnId=col.id;
e.columnIndex=col.index;
}
if(tag=="div"&&_2a2.contains(n,"gridxRow")){
e.rowId=n.getAttribute("rowid");
e.parentId=n.getAttribute("parentid");
e.rowIndex=parseInt(n.getAttribute("rowindex"),10);
e.visualIndex=parseInt(n.getAttribute("visualindex"),10);
return;
}
}
},_onSet:function(id,_2d5,_2d6,_2d7){
var t=this;
if(t.autoUpdate&&_2d6){
var g=t.grid,row=g.row(id,1),_2d8=row&&row.node();
if(_2d8){
var _2d9=_2d6.data,_2da=_2d7.data,cols=g._columns,_2db=[];
_2a0.some(cols,function(col){
if(_2d9[col.id]!==_2da[col.id]){
_2db.push(col);
}
return _2db.length>1;
});
if(_2db.length>1){
_2d8.innerHTML=t._buildCells(row);
t.onAfterRow(row);
t.onSet(row);
t.onRender(_2d5,1);
}else{
if(_2db.length==1){
var col=_2db[0],_2dc=g.tree&&_2d9[col.id]===undefined,cell=row.cell(col.id,1);
cell.node().innerHTML=t._buildCellContent(cell,_2dc);
t.onAfterCell(cell);
}
}
}
}
},_onDelete:function(id){
var t=this;
if(t.autoUpdate){
var node=t.getRowNode({rowId:id});
if(node){
var sn,_2dd=0,_2de=parseInt(node.getAttribute("rowindex"),10),pid=node.getAttribute("parentid"),pids={},_2df=[node],rid,ids=[id],vidx;
pids[id]=1;
for(sn=node.nextSibling;sn&&pids[sn.getAttribute("parentid")];sn=sn.nextSibling){
rid=sn.getAttribute("rowid");
ids.push(rid);
_2df.push(sn);
pids[rid]=1;
}
for(;sn;sn=sn.nextSibling){
if(sn.getAttribute("parentid")==pid){
sn.setAttribute("rowindex",parseInt(sn.getAttribute("rowindex"),10)-1);
}
vidx=parseInt(sn.getAttribute("visualindex"),10)-_2df.length;
sn.setAttribute("visualindex",vidx);
_2a2.toggle(sn,"gridxRowOdd",vidx%2);
++_2dd;
}
t.renderCount-=_2df.length;
_2a0.forEach(_2df,_2a1.destroy);
_2a0.forEach(ids,t.onUnrender,t);
if(t.autoChangeSize&&t.rootStart===0&&!pid){
t.updateRootRange(0,t.rootCount-1);
}
t.onDelete(id,_2de);
t.onRender(_2de,_2dd);
}
}
},_onSizeChange:function(size,_2e0){
var t=this;
if(t.autoChangeSize&&t.rootStart===0&&(t.rootCount===_2e0||_2e0<0)){
t.updateRootRange(0,size);
t.refresh();
}
},_onRowMouseOver:function(e){
var _2e1=_29f("> div.gridxRowOver",this.domNode)[0],_2e2=this.getRowNode({rowId:e.rowId});
if(_2e1!=_2e2){
if(_2e1){
_2a2.remove(_2e1,"gridxRowOver");
}
if(_2e2){
_2a2.add(_2e2,"gridxRowOver");
}
}
},_onCellMouseOver:function(e){
_2a2.toggle(e.cellNode,"gridxCellOver",e.type=="mouseover");
},_focusCellCol:0,_focusCellRow:0,_initFocus:function(){
var t=this,g=t.grid,ltr=g.isLeftToRight(),bn=g.bodyNode,_2e3=g.focus,c="connect";
if(_2e3){
_2e3.registerArea({name:"body",priority:1,focusNode:bn,scope:t,doFocus:t._doFocus,doBlur:t._blurCell,onFocus:t._onFocus,onBlur:t._blurCell});
t[c](g.mainNode,"onkeypress",function(evt){
if(_2e3.currentArea()=="body"&&(!g.tree||!evt.ctrlKey)){
_2e3._noBlur=1;
var dk=keys,arr={},dir=ltr?1:-1;
arr[dk.LEFT_ARROW]=[0,-dir,evt];
arr[dk.RIGHT_ARROW]=[0,dir,evt];
arr[dk.UP_ARROW]=[-1,0,evt];
arr[dk.DOWN_ARROW]=[1,0,evt];
t._moveFocus.apply(t,arr[evt.keyCode]||[]);
_2e3._noBlur=0;
}
});
t[c](g,"onCellClick",function(evt){
t._focusCellRow=evt.visualIndex;
t._focusCellCol=evt.columnIndex;
});
t[c](t,"onRender",function(_2e4,_2e5){
if(t._focusCellRow>=_2e4&&t._focusCellRow<_2e4+_2e5&&_2e3.currentArea()=="body"){
t._focusCell();
}
});
t[c](g.emptyNode,"onfocus",function(){
_2e3.focusArea("body");
});
}
},_doFocus:function(evt){
return this._focusCell(evt)||this._focusCell(0,-1,-1);
},_focusCell:function(evt,_2e6,_2e7){
util.stopEvent(evt);
var t=this,g=t.grid;
_2e7=_2e7>=0?_2e7:t._focusCellCol;
_2e6=_2e6>=0?_2e6:t._focusCellRow;
var _2e8=g._columns[_2e7].id,n=t.getCellNode({visualIndex:_2e6,colId:_2e8});
if(n){
var _2e9=_29f(".gridxCellFocus",t.domNode)[0];
if(n!=_2e9){
if(_2e9){
_2a2.remove(_2e9,"gridxCellFocus");
}
_2a2.add(n,"gridxCellFocus");
t._focusCellRow=_2e6;
t._focusCellCol=_2e7;
g.header._focusHeaderId=_2e8;
}
g.hScroller.scrollToColumn(_2e8);
if(_2a4("ie")<8){
var _2ea=g.bodyNode.scrollLeft;
n.focus();
g.bodyNode.scrollLeft=_2ea;
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
},_moveFocus:function(_2eb,_2ec,evt){
if(_2eb||_2ec){
util.stopEvent(evt);
var r,c,t=this,g=t.grid,cols=g._columns,vc=t.visualCount;
r=t._focusCellRow+_2eb;
r=r<0?0:(r>=vc?vc-1:r);
c=t._focusCellCol+_2ec;
c=c<0?0:(c>=cols.length?cols.length-1:c);
g.vScroller.scrollToRow(r).then(function(){
t._focusCell(0,r,c);
t.onMoveToCell(r,c,evt);
});
}
},_nextCell:function(r,c,dir,_2ed){
var d=new _2a3(),g=this.grid,cc=g._columns.length,rc=this.visualCount;
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
}while(!_2ed(r,c));
g.vScroller.scrollToRow(r).then(function(){
d.callback({r:r,c:c});
});
return d;
},_blurCell:function(){
var n=_29f(".gridxCellFocus",this.domNode)[0];
if(n){
_2a2.remove(n,"gridxCellFocus");
}
return true;
},_onFocus:function(evt){
for(var n=evt.target,t=this;n&&n!=t.domNode;n=n.parentNode){
if(_2a2.contains(n,"gridxCell")){
var _2ee=t.grid._columnsById[n.getAttribute("colid")].index;
while(!_2a2.contains(n,"gridxRow")){
n=n.parentNode;
}
return t._focusCell(0,parseInt(n.getAttribute("visualindex"),10),_2ee);
}
}
return false;
}});
});
},"gridx/core/Column":function(){
define(["dojo/_base/declare"],function(_2ef){
return _2ef([],{constructor:function(grid,id){
this.grid=grid;
this.model=grid.model;
this.id=id;
},index:function(){
var c=this.def();
return c?c.index:-1;
},def:function(){
return this.grid._columnsById[this.id];
},cell:function(row,isId,_2f0){
return this.grid.cell(row,this,isId,_2f0);
},cells:function(_2f1,_2f2,_2f3){
var t=this,g=t.grid,_2f4=[],_2f5=g.rowCount(_2f3),i=_2f1||0,end=_2f2>=0?_2f1+_2f2:_2f5;
for(;i<end&&i<_2f5;++i){
_2f4.push(g.cell(i,t,0,_2f3));
}
return _2f4;
},name:function(){
return this.def().name||"";
},setName:function(name){
this.def().name=name;
return this;
},field:function(){
return this.def().field||null;
},getWidth:function(){
return this.def().width;
}});
});
},"gridx/modules/ColumnWidth":function(){
define(["dojo/_base/declare","dojo/_base/array","dojo/_base/Deferred","dojo/_base/query","dojo/_base/sniff","dojo/dom-geometry","dojo/dom-class","dojo/dom-style","dojo/keys","../core/_Module"],function(_2f6,_2f7,_2f8,_2f9,_2fa,_2fb,_2fc,_2fd,keys,_2fe){
return _2f6(_2fe,{name:"columnWidth",forced:["hLayout"],getAPIPath:function(){
return {columnWidth:this};
},constructor:function(){
this._init();
},preload:function(){
var t=this,g=t.grid;
t._ready=new _2f8();
t.batchConnect([g.hLayout,"onUpdateWidth","_onUpdateWidth"],[g,"setColumns","_onSetColumns"]);
},load:function(){
this._adaptWidth();
this.loaded.callback();
},"default":60,autoResize:false,onUpdate:function(){
},_init:function(){
var t=this,g=t.grid,dn=g.domNode,cols=g._columns;
_2f7.forEach(cols,function(col){
if(!col.hasOwnProperty("declaredWidth")){
col.declaredWidth=col.width=col.width||"auto";
}
});
if(g.autoWidth){
_2f7.forEach(cols,function(c){
if(c.declaredWidth=="auto"){
c.width=t.arg("default")+"px";
}
});
}else{
if(t.arg("autoResize")){
_2fc.add(dn,"gridxPercentColumnWidth");
_2f7.forEach(cols,function(c){
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
var _2ff=g.hScrollerNode.style.display=="none";
t._adaptWidth(!_2ff,1);
if(!t.arg("autoResize")&&_2ff){
_2f9(".gridxCell",g.bodyNode).forEach(function(_300){
var col=g._columnsById[_300.getAttribute("colId")];
if(t.arg("autoResize")||!col.declaredWidth||col.declaredWidth=="auto"||(/%$/).test(col.declaredWidth)){
_300.style.width=col.width;
}
});
}
t.onUpdate();
}
},_adaptWidth:function(skip,_301){
var t=this,g=t.grid,dn=g.domNode,_302=g.header,ltr=g.isLeftToRight(),_303=ltr?"marginLeft":"marginRight",_304=ltr?"marginRight":"marginLeft",lead=g.hLayout.lead,tail=g.hLayout.tail,_305=_302.innerNode,bs=g.bodyNode.style,hs=_305.style,_306=(dn.clientWidth||_2fd.get(dn,"width"))-lead-tail,_307=_2f9(".gridxCell",_305)[0],_308=_307?_2fb.getMarginBox(_307).w-_2fb.getContentBox(_307).w:0,_309=!dn.offsetHeight,_30a=_307&&_2fd.get(_307,"borderCollapse")=="collapse",_30b=_30a&&lead>0?(lead-1):lead;
hs[_303]=_30b+"px";
hs[_304]=(!_30a&&tail>0?tail-1:0)+"px";
g.mainNode.style[_303]=_30b+"px";
g.mainNode.style[_304]=tail+"px";
_306=_306<0?0:_306;
if(skip){
t.onUpdate();
return;
}
if(_30a){
_308+=_309?-1:1;
}
if(g.autoWidth){
var _30c=_2f9("th.gridxCell",_305),_30d=_30a?2:0;
_30c.forEach(function(node){
var w=_2fd.get(node,"width");
if(!_2fa("safari")||!_309){
w+=_308;
}
_30d+=w;
if(_30a){
_30d--;
}
var c=g._columnsById[node.getAttribute("colid")];
if(c.width=="auto"||(/%$/).test(c.width)){
node.style.width=c.width=w+"px";
}
});
bs.width=_30d+"px";
dn.style.width=(lead+tail+_30d)+"px";
}else{
if(!t.arg("autoResize")){
var _30e=[],cols=g._columns,_30f=_30a?2:0;
_2f7.forEach(cols,function(c){
if(c.declaredWidth=="auto"){
_30e.push(c);
}else{
if(/%$/.test(c.declaredWidth)){
var w=parseInt(_306*parseFloat(c.declaredWidth,10)/100-(_2fa("safari")?(_30a?1:0):_308),10);
if(w<0){
w=0;
}
_302.getHeaderNode(c.id).style.width=c.width=w+"px";
}
}
});
_2f7.forEach(cols,function(c){
if(c.declaredWidth!="auto"){
var w=_2fa("safari")?parseFloat(_302.getHeaderNode(c.id).style.width,10):_2fd.get(_302.getHeaderNode(c.id),"width");
if(/%$/.test(c.declaredWidth)){
c.width=w+"px";
}
if(!_2fa("safari")){
w+=_308;
}
_30f+=w;
}
});
if(_30e.length){
if(_2fa("safari")){
_308=0;
}
var w=_306>_30f?((_306-_30f)/_30e.length-_308):t.arg("default"),ww=parseInt(w,10);
if(_306>_30f){
if(_30a){
w+=cols.length/_30e.length;
if(_2fa("ie")<8){
w+=cols.length/_30e.length;
}
}
ww=_306-_30f-(ww+_308)*(_30e.length-1)-_308;
}
w=parseInt(w,10);
if(w<0){
w=0;
}
if(ww<0){
ww=0;
}
_2f7.forEach(_30e,function(c,i){
_302.getHeaderNode(c.id).style.width=c.width=(i<_30e.length-1?w:ww)+"px";
});
}
}
}
g.hScroller.scroll(0);
_302._onHScroll(0);
g.vLayout.reLayout();
if(!_301){
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
},"gridx/modules/Header":function(){
define("gridx/modules/Header",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/dom-construct","dojo/dom-class","dojo/dom-geometry","dojo/_base/query","dojo/_base/sniff","dojo/keys","../util","../core/_Module"],function(_310,lang,_311,_312,_313,_314,_315,_316,keys,util,_317){
return _310(_317,{name:"header",getAPIPath:function(){
return {header:this};
},constructor:function(){
var t=this,dn=t.domNode=_312.create("div",{"class":"gridxHeaderRow",role:"presentation"}),_318=t.innerNode=_312.create("div",{"class":"gridxHeaderRowInner",role:"row"});
t.grid._connectEvents(dn,"_onMouseEvent",t);
},preload:function(args){
var t=this,g=t.grid;
t.domNode.appendChild(t.innerNode);
t._build();
g.headerNode.appendChild(t.domNode);
g.vLayout.register(t,"domNode","headerNode");
t.aspect(g,"onHScroll","_onHScroll");
t.aspect(g,"onHeaderCellMouseOver","_onHeaderCellMouseOver");
t.aspect(g,"onHeaderCellMouseOut","_onHeaderCellMouseOver");
if(g.columnResizer){
t.aspect(g.columnResizer,"onResize",function(){
if(g.hScrollerNode.style.display=="none"){
t._onHScroll(0);
}
});
}
t._initFocus();
},destroy:function(){
this.inherited(arguments);
_312.destroy(this.domNode);
},columnMixin:{headerNode:function(){
return this.grid.header.getHeaderNode(this.id);
}},hidden:false,getHeaderNode:function(id){
return _315("[colid='"+id+"']",this.domNode)[0];
},refresh:function(){
this._build();
this._onHScroll(this._scrollLeft);
this.onRender();
},onRender:function(){
},onMoveToHeaderCell:function(){
},_scrollLeft:0,_build:function(){
var t=this,g=t.grid,f=g.focus,sb=["<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>"];
_311.forEach(g._columns,function(col){
sb.push("<th id=\"",g.id,"-",col.id,"\" role=\"columnheader\" aria-readonly=\"true\" tabindex=\"-1\" colid=\"",col.id,"\" class=\"gridxCell ",f&&f.currentArea()=="header"&&col.id==t._focusHeaderId?t._focusClass:"",(lang.isFunction(col.headerClass)?col.headerClass(col):col.headerClass)||"","\" style=\"width: ",col.width,";",(lang.isFunction(col.headerStyle)?col.headerStyle(col):col.headerStyle)||"","\"><div class=\"gridxSortNode\">",col.name||"","</div></th>");
});
sb.push("</tr></table>");
t.innerNode.innerHTML=sb.join("");
_313.toggle(t.domNode,"gridxHeaderRowHidden",t.arg("hidden"));
},_onHScroll:function(left){
var ltr=this.grid.isLeftToRight();
this.innerNode.firstChild.style[ltr?"marginLeft":"marginRight"]=(!ltr&&_316("ff")?left:-left)+"px";
this._scrollLeft=left;
},_onMouseEvent:function(_319,e){
var g=this.grid,_31a="onHeaderCell"+_319,_31b="onHeader"+_319;
if(g._isConnected(_31a)||g._isConnected(_31b)){
this._decorateEvent(e);
if(e.columnIndex>=0){
g[_31a](e);
}
g[_31b](e);
}
},_decorateEvent:function(e){
for(var n=e.target,c;n&&n!==this.domNode;n=n.parentNode){
if(n.tagName.toLowerCase()=="th"){
c=this.grid._columnsById[n.getAttribute("colid")];
if(c){
e.columnId=c.id;
e.columnIndex=c.index;
}
return;
}
}
},_onHeaderCellMouseOver:function(e){
_313.toggle(this.getHeaderNode(e.columnId),"gridxHeaderCellOver",e.type=="mouseover");
},_focusHeaderId:null,_focusClass:"gridxHeaderCellFocus",_initFocus:function(){
var t=this,g=t.grid;
if(g.focus){
g.focus.registerArea({name:"header",priority:0,focusNode:t.domNode,scope:t,doFocus:t._doFocus,doBlur:t._blurNode,onBlur:t._blurNode,connects:[t.connect(g,"onHeaderCellKeyDown","_onKeyDown"),t.connect(g,"onHeaderCellMouseDown",function(evt){
t._focusNode(t.getHeaderNode(evt.columnId));
})]});
}
},_doFocus:function(evt,step){
var t=this,n=t._focusHeaderId&&t.getHeaderNode(t._focusHeaderId),r=t._focusNode(n||_315("th.gridxCell",t.domNode)[0]);
util.stopEvent(r&&evt);
return r;
},_focusNode:function(node){
if(node){
var t=this,g=t.grid,fid=t._focusHeaderId=node.getAttribute("colid");
if(fid){
t._blurNode();
if(g.hScroller){
g.hScroller.scrollToColumn(fid);
}
g.body._focusCellCol=g._columnsById[fid].index;
_313.add(node,t._focusClass);
setTimeout(function(){
if(_316("webkit")){
_313.add(node,t._focusClass);
}
node.focus();
},0);
return true;
}
}
return false;
},_blurNode:function(){
var t=this,n=_315("th."+t._focusClass,t.domNode)[0];
if(n){
_313.remove(n,t._focusClass);
}
return true;
},_onKeyDown:function(evt){
var t=this,g=t.grid,col,dir=g.isLeftToRight()?1:-1,_31c=evt.keyCode==keys.LEFT_ARROW?-dir:dir;
if(t._focusHeaderId&&!evt.ctrlKey&&!evt.altKey&&(evt.keyCode==keys.LEFT_ARROW||evt.keyCode==keys.RIGHT_ARROW)){
util.stopEvent(evt);
col=g._columnsById[t._focusHeaderId];
col=g._columns[col.index+_31c];
if(col){
t._focusNode(t.getHeaderNode(col.id));
t.onMoveToHeaderCell(col.id,evt);
}
}
}});
});
},"gridx/core/Row":function(){
define("gridx/core/Row",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred"],function(_31d,lang,_31e){
return _31d([],{constructor:function(grid,id){
this.grid=grid;
this.model=grid.model;
this.id=id;
},index:function(){
return this.model.idToIndex(this.id);
},parent:function(){
return this.grid.row(this.model.treePath(this.id).pop(),1);
},cell:function(_31f,isId){
return this.grid.cell(this,_31f,isId);
},cells:function(_320,_321){
var t=this,g=t.grid,_322=[],cols=g._columns,_323=cols.length,i=_320||0,end=_321>=0?_320+_321:_323;
for(;i<end&&i<_323;++i){
_322.push(g.cell(t.id,cols[i].id,1));
}
return _322;
},data:function(){
return this.model.byId(this.id).data;
},rawData:function(){
return this.model.byId(this.id).rawData;
},item:function(){
return this.model.byId(this.id).item;
},setRawData:function(_324){
var t=this,s=t.grid.store,item=t.item(),_325,d;
if(s.setValue){
d=new _31e();
try{
for(_325 in _324){
s.setValue(item,_325,_324[_325]);
}
s.save({onComplete:lang.hitch(d,d.callback),onError:lang.hitch(d,d.errback)});
}
catch(e){
d.errback(e);
}
}
return d||_31e.when(s.put(lang.mixin(lang.clone(item),_324)));
}});
});
},"dojo/dnd/Source":function(){
define("dojo/dnd/Source",["../_base/array","../_base/connect","../_base/declare","../_base/kernel","../_base/lang","../dom-class","../dom-geometry","../mouse","../ready","../topic","./common","./Selector","./Manager"],function(_326,_327,_328,_329,lang,_32a,_32b,_32c,_32d,_32e,dnd,_32f,_330){
if(!_329.isAsync){
_32d(0,function(){
var _331=["dojo/dnd/AutoSource","dojo/dnd/Target"];
require(_331);
});
}
var _332=_328("dojo.dnd.Source",_32f,{isSource:true,horizontal:false,copyOnly:false,selfCopy:false,selfAccept:true,skipForm:false,withHandles:false,autoSync:false,delay:0,accept:["text"],generateText:true,constructor:function(node,_333){
lang.mixin(this,lang.mixin({},_333));
var type=this.accept;
if(type.length){
this.accept={};
for(var i=0;i<type.length;++i){
this.accept[type[i]]=1;
}
}
this.isDragging=false;
this.mouseDown=false;
this.targetAnchor=null;
this.targetBox=null;
this.before=true;
this._lastX=0;
this._lastY=0;
this.sourceState="";
if(this.isSource){
_32a.add(this.node,"dojoDndSource");
}
this.targetState="";
if(this.accept){
_32a.add(this.node,"dojoDndTarget");
}
if(this.horizontal){
_32a.add(this.node,"dojoDndHorizontal");
}
this.topics=[_32e.subscribe("/dnd/source/over",lang.hitch(this,"onDndSourceOver")),_32e.subscribe("/dnd/start",lang.hitch(this,"onDndStart")),_32e.subscribe("/dnd/drop",lang.hitch(this,"onDndDrop")),_32e.subscribe("/dnd/cancel",lang.hitch(this,"onDndCancel"))];
},checkAcceptance:function(_334,_335){
if(this==_334){
return !this.copyOnly||this.selfAccept;
}
for(var i=0;i<_335.length;++i){
var type=_334.getItem(_335[i].id).type;
var flag=false;
for(var j=0;j<type.length;++j){
if(type[j] in this.accept){
flag=true;
break;
}
}
if(!flag){
return false;
}
}
return true;
},copyState:function(_336,self){
if(_336){
return true;
}
if(arguments.length<2){
self=this==_330.manager().target;
}
if(self){
if(this.copyOnly){
return this.selfCopy;
}
}else{
return this.copyOnly;
}
return false;
},destroy:function(){
_332.superclass.destroy.call(this);
_326.forEach(this.topics,function(t){
t.remove();
});
this.targetAnchor=null;
},onMouseMove:function(e){
if(this.isDragging&&this.targetState=="Disabled"){
return;
}
_332.superclass.onMouseMove.call(this,e);
var m=_330.manager();
if(!this.isDragging){
if(this.mouseDown&&this.isSource&&(Math.abs(e.pageX-this._lastX)>this.delay||Math.abs(e.pageY-this._lastY)>this.delay)){
var _337=this.getSelectedNodes();
if(_337.length){
m.startDrag(this,_337,this.copyState(dnd.getCopyKeyState(e),true));
}
}
}
if(this.isDragging){
var _338=false;
if(this.current){
if(!this.targetBox||this.targetAnchor!=this.current){
this.targetBox=_32b.position(this.current,true);
}
if(this.horizontal){
_338=(e.pageX-this.targetBox.x<this.targetBox.w/2)==_32b.isBodyLtr(this.current.ownerDocument);
}else{
_338=(e.pageY-this.targetBox.y)<(this.targetBox.h/2);
}
}
if(this.current!=this.targetAnchor||_338!=this.before){
this._markTargetAnchor(_338);
m.canDrop(!this.current||m.source!=this||!(this.current.id in this.selection));
}
}
},onMouseDown:function(e){
if(!this.mouseDown&&this._legalMouseDown(e)&&(!this.skipForm||!dnd.isFormElement(e))){
this.mouseDown=true;
this._lastX=e.pageX;
this._lastY=e.pageY;
_332.superclass.onMouseDown.call(this,e);
}
},onMouseUp:function(e){
if(this.mouseDown){
this.mouseDown=false;
_332.superclass.onMouseUp.call(this,e);
}
},onDndSourceOver:function(_339){
if(this!==_339){
this.mouseDown=false;
if(this.targetAnchor){
this._unmarkTargetAnchor();
}
}else{
if(this.isDragging){
var m=_330.manager();
m.canDrop(this.targetState!="Disabled"&&(!this.current||m.source!=this||!(this.current.id in this.selection)));
}
}
},onDndStart:function(_33a,_33b,copy){
if(this.autoSync){
this.sync();
}
if(this.isSource){
this._changeState("Source",this==_33a?(copy?"Copied":"Moved"):"");
}
var _33c=this.accept&&this.checkAcceptance(_33a,_33b);
this._changeState("Target",_33c?"":"Disabled");
if(this==_33a){
_330.manager().overSource(this);
}
this.isDragging=true;
},onDndDrop:function(_33d,_33e,copy,_33f){
if(this==_33f){
this.onDrop(_33d,_33e,copy);
}
this.onDndCancel();
},onDndCancel:function(){
if(this.targetAnchor){
this._unmarkTargetAnchor();
this.targetAnchor=null;
}
this.before=true;
this.isDragging=false;
this.mouseDown=false;
this._changeState("Source","");
this._changeState("Target","");
},onDrop:function(_340,_341,copy){
if(this!=_340){
this.onDropExternal(_340,_341,copy);
}else{
this.onDropInternal(_341,copy);
}
},onDropExternal:function(_342,_343,copy){
var _344=this._normalizedCreator;
if(this.creator){
this._normalizedCreator=function(node,hint){
return _344.call(this,_342.getItem(node.id).data,hint);
};
}else{
if(copy){
this._normalizedCreator=function(node){
var t=_342.getItem(node.id);
var n=node.cloneNode(true);
n.id=dnd.getUniqueId();
return {node:n,data:t.data,type:t.type};
};
}else{
this._normalizedCreator=function(node){
var t=_342.getItem(node.id);
_342.delItem(node.id);
return {node:node,data:t.data,type:t.type};
};
}
}
this.selectNone();
if(!copy&&!this.creator){
_342.selectNone();
}
this.insertNodes(true,_343,this.before,this.current);
if(!copy&&this.creator){
_342.deleteSelectedNodes();
}
this._normalizedCreator=_344;
},onDropInternal:function(_345,copy){
var _346=this._normalizedCreator;
if(this.current&&this.current.id in this.selection){
return;
}
if(copy){
if(this.creator){
this._normalizedCreator=function(node,hint){
return _346.call(this,this.getItem(node.id).data,hint);
};
}else{
this._normalizedCreator=function(node){
var t=this.getItem(node.id);
var n=node.cloneNode(true);
n.id=dnd.getUniqueId();
return {node:n,data:t.data,type:t.type};
};
}
}else{
if(!this.current){
return;
}
this._normalizedCreator=function(node){
var t=this.getItem(node.id);
return {node:node,data:t.data,type:t.type};
};
}
this._removeSelection();
this.insertNodes(true,_345,this.before,this.current);
this._normalizedCreator=_346;
},onDraggingOver:function(){
},onDraggingOut:function(){
},onOverEvent:function(){
_332.superclass.onOverEvent.call(this);
_330.manager().overSource(this);
if(this.isDragging&&this.targetState!="Disabled"){
this.onDraggingOver();
}
},onOutEvent:function(){
_332.superclass.onOutEvent.call(this);
_330.manager().outSource(this);
if(this.isDragging&&this.targetState!="Disabled"){
this.onDraggingOut();
}
},_markTargetAnchor:function(_347){
if(this.current==this.targetAnchor&&this.before==_347){
return;
}
if(this.targetAnchor){
this._removeItemClass(this.targetAnchor,this.before?"Before":"After");
}
this.targetAnchor=this.current;
this.targetBox=null;
this.before=_347;
if(this.targetAnchor){
this._addItemClass(this.targetAnchor,this.before?"Before":"After");
}
},_unmarkTargetAnchor:function(){
if(!this.targetAnchor){
return;
}
this._removeItemClass(this.targetAnchor,this.before?"Before":"After");
this.targetAnchor=null;
this.targetBox=null;
this.before=true;
},_markDndStatus:function(copy){
this._changeState("Source",copy?"Copied":"Moved");
},_legalMouseDown:function(e){
if(e.type!="touchstart"&&!_32c.isLeft(e)){
return false;
}
if(!this.withHandles){
return true;
}
for(var node=e.target;node&&node!==this.node;node=node.parentNode){
if(_32a.contains(node,"dojoDndHandle")){
return true;
}
if(_32a.contains(node,"dojoDndItem")||_32a.contains(node,"dojoDndIgnore")){
break;
}
}
return false;
}});
return _332;
});
},"url:gridx/templates/Grid.html":"<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\"\n\t><div class=\"gridxHeader\" role=\"presentation\" data-dojo-attach-point=\"headerNode\"></div\n\t><div class=\"gridxMain\" role=\"presentation\" data-dojo-attach-point=\"mainNode\"\n\t\t><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" data-dojo-attach-point=\"emptyNode\"></div\n\t\t><div class=\"gridxBody\" role=\"presentation\" data-dojo-attach-point=\"bodyNode\"></div\n\t\t><div class=\"gridxVScroller\" data-dojo-attach-point=\"vScrollerNode\" tabindex=\"-1\"\n\t\t\t><div style='width: 1px;'></div\n\t\t></div\n\t></div\n\t><div class=\"gridxFooter\" data-dojo-attach-point=\"footerNode\"\n\t\t><div class=\"gridxHScroller\"\n\t\t\t><div class=\"gridxHScrollerInner\" data-dojo-attach-point=\"hScrollerNode\" tabindex=\"-1\"\n\t\t\t\t><div style=\"width:1px; height: 1px;\"></div\n\t\t\t></div\n\t\t></div\n\t></div\n\t><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span\n></div>\n","gridx/core/Core":function(){
define("gridx/core/Core",["require","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","./model/Model","./Row","./Column","./Cell","./_Module"],function(_348,_349,_34a,lang,_34b,_34c,_34d,Row,_34e,Cell,_34f){
var _350=lang.delegate,_351=lang.isFunction,_352=lang.isString,_353=lang.hitch,_354=_34a.forEach;
function _355(obj){
var ret={},i;
for(i in obj){
ret[i]=obj[i];
}
return ret;
};
function _356(mod){
var p=mod.moduleClass.prototype;
return (p.forced||[]).concat(p.optional||[]);
};
function _357(_358){
var cs={},c,i,len;
if(lang.isArray(_358)){
for(i=0,len=_358.length;i<len;++i){
c=_358[i];
c.index=i;
c.id=c.id||String(i+1);
cs[c.id]=c;
}
}
return cs;
};
function _359(arr){
for(var f in _34a){
if(_351(_34a[f])){
arr[f]=lang.partial(_34a[f],arr);
}
}
return arr;
};
function _35a(base,_35b){
if(_35b){
for(var path in _35b){
var bp=base[path],ap=_35b[path];
if(bp&&lang.isObject(bp)&&!_351(bp)){
_35a(bp,ap);
}else{
base[path]=ap;
}
}
}
};
function _35c(base,_35d){
if(_35d){
for(var path in _35d){
delete base[path];
}
}
};
function _35e(args,_35f){
var mods=[],_360=_35f&&_35f.length||0;
_354(args.modules,function(m,i){
if(_351(m)||_352(m)){
m={moduleClass:m};
}
if(m){
var mc=m.moduleClass;
if(_352(mc)){
try{
mc=m.moduleClass=_348(mc);
}
catch(e){
console.error(e);
}
}
if(_351(mc)){
mods.push(m);
return;
}
}
console.error(["The ",(i+1-_360),"-th declared module can NOT be found, please require it before using it"].join(""));
});
args.modules=mods;
return args;
};
function _361(args){
var _362=_34f._modules,_363=args.modules,i,j,k,p,deps,_364,err;
for(i=0;i<_363.length;++i){
p=_363[i].moduleClass.prototype;
deps=(p.forced||[]).concat(p.required||[]);
for(j=0;j<deps.length;++j){
_364=deps[j];
for(k=_363.length-1;k>=0;--k){
if(_363[k].moduleClass.prototype.name===_364){
break;
}
}
if(k<0){
if(_362[_364]){
_363.push({moduleClass:_362[_364]});
}else{
err=1;
console.error(["Forced/Required dependent module '",_364,"' is NOT found for '",p.name,"' module."].join(""));
}
}
}
}
if(err){
throw new Error("Some forced/required dependent modules are NOT found.");
}
return args;
};
function _365(args){
var i,mods={},_366=[];
_354(args.modules,function(m){
mods[m.moduleClass.prototype.name]=m;
});
for(i in mods){
_366.push(mods[i]);
}
args.modules=_366;
return args;
};
function _367(args){
var _368=args.modules,i,m,_369,q,key,_36a=function(_36b){
for(var j=_368.length-1;j>=0;--j){
if(_368[j].moduleClass.prototype.name==_36b){
return _368[j];
}
}
return null;
};
for(i=_368.length-1;m=_368[i];--i){
_369=m.moduleClass.prototype.name;
q=_356(m);
while(q.length){
key=q.shift();
if(key==_369){
throw new Error("Module '"+key+"' is in a dependancy circle!");
}
m=_36a(key);
if(m){
q=q.concat(_356(m));
}
}
}
return args;
};
function _36c(args){
var _36d=args.modules,i,_36e;
for(i=_36d.length-1;i>=0;--i){
_36e=_36d[i].moduleClass.prototype.modelExtensions;
if(_36e){
[].push.apply(args.modelExtensions,_36e);
}
}
return args;
};
return _349([],{_reset:function(args){
var t=this,d=t._deferStartup=new _34b();
args=_355(args);
t.store=args.store;
args.modules=args.modules||[];
args.modelExtensions=args.modelExtensions||[];
t.setColumns(args.structure);
args.columns=t._columnsById;
args=_36c(_367(_365(_361(_35e(args,t.coreModules)))));
t.model=new _34d(args);
t.when=lang.hitch(t.model,t.model.when);
t._create(args);
t._preload();
t._load(d).then(_353(t,"onModulesLoaded"));
},onModulesLoaded:function(){
},setStore:function(_36f){
if(this.store!=_36f){
this.store=_36f;
this.model.setStore(_36f);
}
},setColumns:function(_370){
var t=this;
t.structure=_370;
t._columns=lang.clone(_370);
t._columnsById=_357(t._columns);
if(t.model){
t.model._cache.onSetColumns(t._columnsById);
}
},row:function(row,isId,_371){
var t=this;
if(typeof row=="number"&&!isId){
row=t.model.indexToId(row,_371);
}
if(t.model.byId(row)){
t._rowObj=t._rowObj||t._mixin(new Row(t),"row");
return _350(t._rowObj,{id:row});
}
return null;
},column:function(_372,isId){
var t=this,c,a,obj={};
if(typeof _372=="number"&&!isId){
c=t._columns[_372];
_372=c&&c.id;
}
c=t._columnsById[_372];
if(c){
t._colObj=t._colObj||t._mixin(new _34e(t),"column");
for(a in c){
if(t._colObj[a]===undefined){
obj[a]=c[a];
}
}
return _350(t._colObj,obj);
}
return null;
},cell:function(row,_373,isId,_374){
var t=this,r=row instanceof Row?row:t.row(row,isId,_374);
if(r){
var c=_373 instanceof _34e?_373:t.column(_373,isId);
if(c){
t._cellObj=t._cellObj||t._mixin(new Cell(t),"cell");
return _350(t._cellObj,{row:r,column:c});
}
}
return null;
},columnCount:function(){
return this._columns.length;
},rowCount:function(_375){
return this.model.size(_375);
},columns:function(_376,_377){
return this._arr(this._columns.length,"column",_376,_377);
},rows:function(_378,_379,_37a){
return this._arr(this.rowCount(_37a),"row",_378,_379,_37a);
},_uninit:function(){
var t=this,mods=t._modules,m;
for(m in mods){
m=mods[m].mod;
if(m.getAPIPath){
_35c(t,m.getAPIPath());
}
m.destroy();
}
if(t.model){
t.model.destroy();
}
},_arr:function(_37b,type,_37c,_37d,pid){
var i=_37c||0,end=_37d>=0?_37c+_37d:_37b,r=[];
for(;i<end&&i<_37b;++i){
r.push(this[type](i,0,pid));
}
return _359(r);
},_preload:function(){
var m,mods=this._modules;
for(m in mods){
m=mods[m];
if(m.mod.preload){
m.mod.preload(m.args);
}
}
},_load:function(_37e){
var dl=[],m;
for(m in this._modules){
dl.push(this._initMod(_37e,m));
}
return new _34c(dl,0,1);
},_mixin:function(_37f,name){
var m,a,mods=this._modules;
for(m in mods){
m=mods[m].mod;
a=m[name+"Mixin"];
if(_351(a)){
a=a.apply(m);
}
lang.mixin(_37f,a||{});
}
return _37f;
},_create:function(args){
var t=this,mods=t._modules={};
_354(args.modules,function(mod){
var m,key=mod.moduleClass.prototype.name;
if(!mods[key]){
mods[key]={args:mod,mod:m=new mod.moduleClass(t,mod),deps:_356(mod)};
if(m.getAPIPath){
_35a(t,m.getAPIPath());
}
}
});
},_initMod:function(_380,key){
var t=this,mods=t._modules,m=mods[key],mod=m.mod,d=mod.loaded;
if(!m.done){
m.done=1;
new _34c(_34a.map(_34a.filter(m.deps,function(_381){
return mods[_381];
}),_353(t,t._initMod,_380)),0,1).then(function(){
if(mod.load){
mod.load(m.args,_380);
}else{
if(d.fired<0){
d.callback();
}
}
});
}
return d;
}});
});
},"*now":function(r){
r(["dojo/i18n!*preload*gridx/nls/Grid*[\"ar\",\"ca\",\"cs\",\"da\",\"de\",\"el\",\"en-gb\",\"en-us\",\"es-es\",\"fi-fi\",\"fr-fr\",\"he-il\",\"hu\",\"it-it\",\"ja-jp\",\"ko-kr\",\"nl-nl\",\"nb\",\"pl\",\"pt-br\",\"pt-pt\",\"ru\",\"sk\",\"sl\",\"sv\",\"th\",\"tr\",\"zh-tw\",\"zh-cn\",\"ROOT\"]"]);
}}});
define("gridx/Grid",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/sniff","dojo/on","dojo/dom-class","dojo/dom-geometry","dojo/_base/query","dojox/html/metrics","dijit/_WidgetBase","dijit/_FocusMixin","dijit/_TemplatedMixin","dojo/text!./templates/Grid.html","./core/Core","./core/model/extensions/Query","./core/_Module","./modules/Header","./modules/Body","./modules/VLayout","./modules/HLayout","./modules/VScroller","./modules/HScroller","./modules/ColumnWidth"],function(_382,_383,_384,lang,has,on,_385,_386,_387,_388,_389,_38a,_38b,_38c,Core,_38d,_38e,_38f,Body,_390,_391,_392,_393,_394){
var _395=_384.forEach,_396=function(){
};
var Grid=_383("gridx.Grid",[_389,_38b,_38a,Core],{templateString:_38c,coreModules:[_38f,Body,_390,_391,_392,_393,_394],coreExtensions:[_38d],postCreate:function(){
var t=this;
t.inherited(arguments);
t._eventFlags={};
t.modules=t.coreModules.concat(t.modules||[]);
t.modelExtensions=t.coreExtensions.concat(t.modelExtensions||[]);
_385.toggle(t.domNode,"gridxRtl",!t.isLeftToRight());
t.lastFocusNode.setAttribute("tabIndex",t.domNode.getAttribute("tabIndex"));
t._initEvents(t._compNames,t._eventNames);
t._reset(t);
t.connect(_388,"onFontResize",function(){
t.resize();
});
},startup:function(){
if(!this._started){
this.inherited(arguments);
this._deferStartup.callback();
}
},destroy:function(){
this._uninit();
this.inherited(arguments);
},resize:function(_397){
var t=this,ds={};
if(_397){
if(t.autoWidth){
_397.w=undefined;
}
if(t.autoHeight){
_397.h=undefined;
}
_386.setMarginBox(t.domNode,_397);
}
t._onResizeBegin(_397,ds);
t._onResizeEnd(_397,ds);
},_onResizeBegin:function(){
},_onResizeEnd:function(){
},_compNames:["Cell","HeaderCell","Row","Header"],_eventNames:["Click","DblClick","MouseDown","MouseUp","MouseOver","MouseOut","MouseMove","ContextMenu","KeyDown","KeyPress","KeyUp"],_initEvents:function(_398,_399){
var t=this;
_395(_398,function(comp){
_395(_399,function(_39a){
var _39b="on"+comp+_39a;
t[_39b]=t[_39b]||_396;
});
});
},_connectEvents:function(node,_39c,_39d){
for(var t=this,m=t.model,_39e,_39f=t._eventNames,len=_39f.length,i=0;i<len;++i){
_39e=_39f[i];
m._cnnts.push(on(node,_39e.toLowerCase(),lang.hitch(_39d,_39c,_39e)));
}
},_isConnected:function(_3a0){
return this[_3a0]!==_396;
},_isCopyEvent:function(evt){
return has("mac")?evt.metaKey:evt.ctrlKey;
}});
Grid.markupFactory=function(_3a1,node,ctor){
if(!_3a1.structure&&node.nodeName.toLowerCase()=="table"){
_382.deprecated("Column declaration in <th> elements is deprecated,","use \"structure\" attribute in data-dojo-props instead","1.1");
var s=_3a1.structure=[];
_387("thead > tr > th",node).forEach(function(th){
var col={};
_395(_38e._markupAttrs,function(attr){
if(attr[0]=="!"){
attr=attr.slice(1);
col[attr]=eval(th.getAttribute(attr));
}else{
col[attr]=th.getAttribute(attr);
}
});
col.name=col.name||th.innerHTML;
s.push(col);
});
}
return new ctor(_3a1,node);
};
return Grid;
});
