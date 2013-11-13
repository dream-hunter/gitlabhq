//>>built
define("gridx/core/model/Model",["require","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","dojo/aspect"],function(_1,_2,_3,_4,_5,_6,_7){
var _8=_4.isArrayLike,_9=_4.isString;
return _2([],{constructor:function(_a){
var t=this,_b=_a.cacheClass;
_b=typeof _b=="string"?_1(_b):_b;
t.store=_a.store;
t._exts={};
t._cmdQueue=[];
t._model=t._cache=new _b(t,_a);
t._createExts(_a.modelExtensions||[],_a);
var m=t._model;
t._cnnts=[_7.after(m,"onDelete",_4.hitch(t,"onDelete"),1),_7.after(m,"onNew",_4.hitch(t,"onNew"),1),_7.after(m,"onSet",_4.hitch(t,"onSet"),1)];
},destroy:function(){
_3.forEach(this._cnnts,function(_c){
_c.remove();
});
for(var n in this._exts){
this._exts[n].destroy();
}
},clearCache:function(){
this._cache.clear();
},isId:function(id){
return id||id===0;
},setStore:function(_d){
this.store=_d;
this._cache.setStore(_d);
},when:function(_e,_f,_10){
this._oldSize=this.size();
this._addCmd({name:"_cmdRequest",scope:this,args:arguments,async:1});
return this._exec();
},scan:function(_11,_12){
var d=new _5,_13=_11.start||0,_14=_11.pageSize||this._cache.pageSize||1,_15=_11.count,end=_15>0?_13+_15:Infinity,_16=_11.whenScope||this,_17=_11.whenFunc||_16.when;
var f=function(s){
d.progress(s/(_15>0?s+_15:_16.size()));
_17.call(_16,{id:[],range:[{start:s,count:_14}]},function(){
var i,r,_18=[];
for(i=s;i<s+_14&&i<end;++i){
r=_16.byIndex(i);
if(r){
_18.push(r);
}else{
end=-1;
break;
}
}
if(_12(_18,s)||i==end){
end=-1;
}
}).then(function(){
if(end==-1){
d.callback();
}else{
f(s+_14);
}
});
};
f(_13);
return d;
},onDelete:function(){
},onNew:function(){
},onSet:function(){
},onSizeChange:function(){
},_msg:function(){
},_addCmd:function(_19){
var _1a=this._cmdQueue,cmd=_1a[_1a.length-1];
if(cmd&&cmd.name==_19.name&&cmd.scope==_19.scope){
cmd.args.push(_19.args||[]);
}else{
_19.args=[_19.args||[]];
_1a.push(_19);
}
},_onSizeChange:function(){
var t=this,_1b=t._oldSize,_1c=t._oldSize=t.size();
if(_1b!=_1c){
t.onSizeChange(_1c,_1b);
}
},_execEvents:function(_1d,_1e){
this._onSizeChange();
if(_1e){
_1e.call(_1d);
}
},_cmdRequest:function(){
var t=this;
return new _6(_3.map(arguments,function(_1f){
var arg=_1f[0],_20=_4.hitch(t,t._execEvents,_1f[2],_1f[1]);
if(arg===null||!_1f.length){
var d=new _5;
_20();
d.callback();
return d;
}
return t._model._call("when",[t._normArgs(arg),_20]);
}),0,1);
},_exec:function(){
var t=this,c=t._cache,d=new _5,_21=t._cmdQueue,_22=function(d,err){
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
},_23=function(){
if(_3.some(_21,function(cmd){
return cmd.name=="_cmdRequest";
})){
try{
while(_21.length){
var cmd=_21.shift(),dd=cmd.scope[cmd.name].apply(cmd.scope,cmd.args);
if(cmd.async){
_5.when(dd,_23,_4.partial(_22,d));
return;
}
}
}
catch(e){
_22(d,e);
return;
}
}
_22(d);
};
if(t._busy){
return t._busy;
}
t._busy=d;
c.skipCacheSizeCheck=1;
_23();
return d;
},_createExts:function(_24,_25){
_24=_3.filter(_24,function(ext){
ext=typeof ext=="string"?_1(ext):ext;
return ext&&ext.prototype;
});
_24.sort(function(a,b){
return a.prototype.priority-b.prototype.priority;
});
for(var i=0,len=_24.length;i<len;++i){
if(i==_24.length-1||_24[i]!=_24[i+1]){
var ext=new _24[i](this,_25);
this._exts[ext.name]=ext;
}
}
},_normArgs:function(_26){
var i,rgs=[],ids=[],res={range:rgs,id:ids},_27=function(a){
return typeof a=="number"&&a>=0;
},_28=function(a){
return a&&_27(a.start);
},f=function(a){
if(_28(a)){
rgs.push(a);
}else{
if(_27(a)){
rgs.push({start:a,count:1});
}else{
if(_8(a)){
for(i=a.length-1;i>=0;--i){
if(_27(a[i])){
rgs.push({start:a[i],count:1});
}else{
if(_28(a[i])){
rgs.push(a[i]);
}else{
if(_9(a)){
ids.push(a[i]);
}
}
}
}
}else{
if(_9(a)){
ids.push(a);
}
}
}
}
};
if(_26&&(_26.index||_26.range||_26.id)){
f(_26.index);
f(_26.range);
if(_8(_26.id)){
for(i=_26.id.length-1;i>=0;--i){
ids.push(_26.id[i]);
}
}else{
if(this.isId(_26.id)){
ids.push(_26.id);
}
}
}else{
f(_26);
}
if(!rgs.length&&!ids.length&&this.size()<0){
rgs.push({start:0,count:this._cache.pageSize||1});
}
return res;
}});
});
