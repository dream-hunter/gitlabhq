//>>built
define("gridx/modules/Focus",["dojo/_base/declare","dojo/_base/array","dojo/_base/connect","dojo/_base/lang","dojo/_base/sniff","dojo/_base/window","dojo/keys","../core/_Module","../util"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){
return _1(_8,{name:"focus",getAPIPath:function(){
return {focus:this};
},constructor:function(){
var t=this,g=t.grid;
t._areas={};
t._tabQueue=[];
t._focusNodes=[];
t._onDocFocus=function(_a){
if(!t._noBlur){
if(_5("ie")){
_a.target=_a.srcElement;
}
t._onFocus(_a);
}
};
t.batchConnect([g.domNode,"onkeydown","_onTabDown"],[g.domNode,"onfocus","_focus"],[g.lastFocusNode,"onfocus","_focus"],[g,"onBlur","_doBlur"]);
if(_5("ie")){
_6.doc.attachEvent("onfocusin",t._onDocFocus);
}else{
_6.doc.addEventListener("focus",t._onDocFocus,true);
}
},destroy:function(){
var t=this;
t._areas=null;
t._areaQueue=null;
t._focusNodes=[];
t._queueIdx=-1;
if(_5("ie")){
_6.doc.detachEvent("onfocusin",t._onDocFocus);
}else{
_6.doc.removeEventListener("focus",t._onDocFocus,true);
}
t.inherited(arguments);
},registerArea:function(_b){
if(_b&&_b.name&&typeof _b.priority=="number"){
var t=this,tq=t._tabQueue,_c=function(fn){
_b[fn]=_b[fn]?_4.hitch(_b.scope||_b,_b[fn]):function(){
return true;
};
};
if(t._areas[_b.name]){
t.removeArea(_b.name);
}
_c("doFocus");
_c("doBlur");
_c("onFocus");
_c("onBlur");
_b.connects=_b.connects||[];
t._areas[_b.name]=_b;
var i=_9.biSearch(tq,function(a){
return a.p-_b.priority;
});
if(tq[i]&&tq[i].p===_b.priority){
tq[i].stack.unshift(_b.name);
t._focusNodes[i]=_b.focusNode||t._focusNodes[i];
}else{
tq.splice(i,0,{p:_b.priority,stack:[_b.name]});
t._focusNodes.splice(i,0,_b.focusNode);
}
}
},focusArea:function(_d,_e){
var t=this,_f=t._areas[_d];
if(_f){
var _10=t._areas[t.currentArea()];
if(_10&&_10.name===_d){
if(_e){
_10.doFocus();
}
return true;
}else{
if(!_10||_10.doBlur()){
if(_10){
t.onBlurArea(_10.name);
}
if(_f.doFocus()){
t.onFocusArea(_f.name);
t._updateCurrentArea(_f);
return true;
}
t._updateCurrentArea();
}
}
}
return false;
},currentArea:function(){
var a=this._tabQueue[this._queueIdx];
return a?a.stack[this._stackIdx]:"";
},tab:function(_11,evt){
var t=this,_12=t._areas,_13=_12[t.currentArea()];
if(!_11){
return _13?_13.name:"";
}
var cai=t._queueIdx+_11,dir=_11>0?1:-1,tq=t._tabQueue;
if(_13){
var _14=_13.doBlur(evt,_11),_15=_12[_14];
if(_14){
t.onBlurArea(_13.name);
}
if(_15&&_15.doFocus(evt,_11)){
t.onFocusArea(_15.name);
t._updateCurrentArea(_15);
return _15.name;
}else{
if(!_14){
return _13.name;
}
}
}
for(;cai>=0&&cai<tq.length;cai+=dir){
var i,_16=tq[cai].stack;
for(i=0;i<_16.length;++i){
var _17=_16[i];
if(_12[_17].doFocus(evt,_11)){
t.onFocusArea(_17);
t._queueIdx=cai;
t._stackIdx=i;
return _17;
}
}
}
t._tabingOut=1;
if(_11<0){
t._queueIdx=-1;
t.grid.domNode.focus();
}else{
t._queueIdx=tq.length;
t.grid.lastFocusNode.focus();
}
return "";
},removeArea:function(_18){
var t=this,_19=t._areas[_18];
if(_19){
if(t.currentArea()===_18){
t._updateCurrentArea();
}
var i=_9.biSearch(t._tabQueue,function(a){
return a.p-_19.priority;
}),j,_1a=t._tabQueue[i].stack;
for(j=_1a.length-1;j>=0;--j){
if(_1a[j]===_19.name){
_1a.splice(j,1);
break;
}
}
if(!_1a.length){
t._tabQueue.splice(i,1);
t._focusNodes.splice(i,1);
}
_2.forEach(_19.connects,_3.disconnect);
delete t._areas[_18];
return true;
}
return false;
},onFocusArea:function(){
},onBlurArea:function(){
},_queueIdx:-1,_stackIdx:0,_onTabDown:function(evt){
if(evt.keyCode===_7.TAB){
this.tab(evt.shiftKey?-1:1,evt);
}
},_onFocus:function(evt){
var t=this,i,j,_1b,_1c,dn=t.grid.domNode,n=evt.target,_1d=t._areas[t.currentArea()];
while(n&&n!==dn){
i=_2.indexOf(t._focusNodes,n);
if(i>=0){
_1b=t._tabQueue[i].stack;
for(j=0;j<_1b.length;++j){
_1c=t._areas[_1b[j]];
if(_1c.onFocus(evt)){
if(_1d&&_1d.name!==_1c.name){
_1d.onBlur(evt);
t.onBlurArea(_1d.name);
}
t.onFocusArea(_1c.name);
t._queueIdx=i;
t._stackIdx=j;
return;
}
}
return;
}
n=n.parentNode;
}
if(n==dn&&_1d){
t._doBlur(evt,_1d);
}
},_focus:function(evt){
var t=this;
if(t._tabingOut){
t._tabingOut=0;
}else{
if(evt.target==t.grid.domNode){
t._queueIdx=-1;
t.tab(1);
}else{
if(evt.target===t.grid.lastFocusNode){
t._queueIdx=t._tabQueue.length;
t.tab(-1);
}
}
}
},_doBlur:function(evt,_1e){
var t=this;
if(!_1e&&t.currentArea()){
_1e=t._areas[t.currentArea()];
}
if(_1e){
_1e.onBlur(evt);
t.onBlurArea(_1e.name);
t._updateCurrentArea();
}
},_updateCurrentArea:function(_1f){
var t=this,tq=t._tabQueue;
if(_1f){
var i=t._queueIdx=_9.biSearch(tq,function(a){
return a.p-_1f.priority;
}),_20=tq[i].stack;
t._stackIdx=_2.indexOf(_20,_1f.name);
}else{
t._queueIdx=null;
t._stackIdx=0;
}
}});
});
