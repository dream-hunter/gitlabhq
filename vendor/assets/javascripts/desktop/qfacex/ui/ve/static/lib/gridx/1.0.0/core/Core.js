//>>built
define("gridx/core/Core",["require","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","./model/Model","./Row","./Column","./Cell","./_Module"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b){
var _c=_4.delegate,_d=_4.isFunction,_e=_4.isString,_f=_4.hitch,_10=_3.forEach;
function _11(obj){
var ret={},i;
for(i in obj){
ret[i]=obj[i];
}
return ret;
};
function _12(mod){
var p=mod.moduleClass.prototype;
return (p.forced||[]).concat(p.optional||[]);
};
function _13(_14){
var cs={},c,i,len;
if(_4.isArray(_14)){
for(i=0,len=_14.length;i<len;++i){
c=_14[i];
c.index=i;
c.id=c.id||String(i+1);
cs[c.id]=c;
}
}
return cs;
};
function _15(arr){
for(var f in _3){
if(_d(_3[f])){
arr[f]=_4.partial(_3[f],arr);
}
}
return arr;
};
function _16(_17,_18){
if(_18){
for(var _19 in _18){
var bp=_17[_19],ap=_18[_19];
if(bp&&_4.isObject(bp)&&!_d(bp)){
_16(bp,ap);
}else{
_17[_19]=ap;
}
}
}
};
function _1a(_1b,_1c){
if(_1c){
for(var _1d in _1c){
delete _1b[_1d];
}
}
};
function _1e(_1f,_20){
var _21=[],_22=_20&&_20.length||0;
_10(_1f.modules,function(m,i){
if(_d(m)||_e(m)){
m={moduleClass:m};
}
if(m){
var mc=m.moduleClass;
if(_e(mc)){
try{
mc=m.moduleClass=_1(mc);
}
catch(e){
console.error(e);
}
}
if(_d(mc)){
_21.push(m);
return;
}
}
console.error(["The ",(i+1-_22),"-th declared module can NOT be found, please require it before using it"].join(""));
});
_1f.modules=_21;
return _1f;
};
function _23(_24){
var _25=_b._modules,_26=_24.modules,i,j,k,p,_27,_28,err;
for(i=0;i<_26.length;++i){
p=_26[i].moduleClass.prototype;
_27=(p.forced||[]).concat(p.required||[]);
for(j=0;j<_27.length;++j){
_28=_27[j];
for(k=_26.length-1;k>=0;--k){
if(_26[k].moduleClass.prototype.name===_28){
break;
}
}
if(k<0){
if(_25[_28]){
_26.push({moduleClass:_25[_28]});
}else{
err=1;
console.error(["Forced/Required dependent module '",_28,"' is NOT found for '",p.name,"' module."].join(""));
}
}
}
}
if(err){
throw new Error("Some forced/required dependent modules are NOT found.");
}
return _24;
};
function _29(_2a){
var i,_2b={},_2c=[];
_10(_2a.modules,function(m){
_2b[m.moduleClass.prototype.name]=m;
});
for(i in _2b){
_2c.push(_2b[i]);
}
_2a.modules=_2c;
return _2a;
};
function _2d(_2e){
var _2f=_2e.modules,i,m,_30,q,key,_31=function(_32){
for(var j=_2f.length-1;j>=0;--j){
if(_2f[j].moduleClass.prototype.name==_32){
return _2f[j];
}
}
return null;
};
for(i=_2f.length-1;m=_2f[i];--i){
_30=m.moduleClass.prototype.name;
q=_12(m);
while(q.length){
key=q.shift();
if(key==_30){
throw new Error("Module '"+key+"' is in a dependancy circle!");
}
m=_31(key);
if(m){
q=q.concat(_12(m));
}
}
}
return _2e;
};
function _33(_34){
var _35=_34.modules,i,_36;
for(i=_35.length-1;i>=0;--i){
_36=_35[i].moduleClass.prototype.modelExtensions;
if(_36){
[].push.apply(_34.modelExtensions,_36);
}
}
return _34;
};
return _2([],{_reset:function(_37){
var t=this,d=t._deferStartup=new _5();
_37=_11(_37);
t.store=_37.store;
_37.modules=_37.modules||[];
_37.modelExtensions=_37.modelExtensions||[];
t.setColumns(_37.structure);
_37.columns=t._columnsById;
_37=_33(_2d(_29(_23(_1e(_37,t.coreModules)))));
t.model=new _7(_37);
t.when=_4.hitch(t.model,t.model.when);
t._create(_37);
t._preload();
t._load(d).then(_f(t,"onModulesLoaded"));
},onModulesLoaded:function(){
},setStore:function(_38){
if(this.store!=_38){
this.store=_38;
this.model.setStore(_38);
}
},setColumns:function(_39){
var t=this;
t.structure=_39;
t._columns=_4.clone(_39);
t._columnsById=_13(t._columns);
if(t.model){
t.model._cache.onSetColumns(t._columnsById);
}
},row:function(row,_3a,_3b){
var t=this;
if(typeof row=="number"&&!_3a){
row=t.model.indexToId(row,_3b);
}
if(t.model.byId(row)){
t._rowObj=t._rowObj||t._mixin(new _8(t),"row");
return _c(t._rowObj,{id:row});
}
return null;
},column:function(_3c,_3d){
var t=this,c,a,obj={};
if(typeof _3c=="number"&&!_3d){
c=t._columns[_3c];
_3c=c&&c.id;
}
c=t._columnsById[_3c];
if(c){
t._colObj=t._colObj||t._mixin(new _9(t),"column");
for(a in c){
if(t._colObj[a]===undefined){
obj[a]=c[a];
}
}
return _c(t._colObj,obj);
}
return null;
},cell:function(row,_3e,_3f,_40){
var t=this,r=row instanceof _8?row:t.row(row,_3f,_40);
if(r){
var c=_3e instanceof _9?_3e:t.column(_3e,_3f);
if(c){
t._cellObj=t._cellObj||t._mixin(new _a(t),"cell");
return _c(t._cellObj,{row:r,column:c});
}
}
return null;
},columnCount:function(){
return this._columns.length;
},rowCount:function(_41){
return this.model.size(_41);
},columns:function(_42,_43){
return this._arr(this._columns.length,"column",_42,_43);
},rows:function(_44,_45,_46){
return this._arr(this.rowCount(_46),"row",_44,_45,_46);
},_uninit:function(){
var t=this,_47=t._modules,m;
for(m in _47){
m=_47[m].mod;
if(m.getAPIPath){
_1a(t,m.getAPIPath());
}
m.destroy();
}
if(t.model){
t.model.destroy();
}
},_arr:function(_48,_49,_4a,_4b,pid){
var i=_4a||0,end=_4b>=0?_4a+_4b:_48,r=[];
for(;i<end&&i<_48;++i){
r.push(this[_49](i,0,pid));
}
return _15(r);
},_preload:function(){
var m,_4c=this._modules;
for(m in _4c){
m=_4c[m];
if(m.mod.preload){
m.mod.preload(m.args);
}
}
},_load:function(_4d){
var dl=[],m;
for(m in this._modules){
dl.push(this._initMod(_4d,m));
}
return new _6(dl,0,1);
},_mixin:function(_4e,_4f){
var m,a,_50=this._modules;
for(m in _50){
m=_50[m].mod;
a=m[_4f+"Mixin"];
if(_d(a)){
a=a.apply(m);
}
_4.mixin(_4e,a||{});
}
return _4e;
},_create:function(_51){
var t=this,_52=t._modules={};
_10(_51.modules,function(mod){
var m,key=mod.moduleClass.prototype.name;
if(!_52[key]){
_52[key]={args:mod,mod:m=new mod.moduleClass(t,mod),deps:_12(mod)};
if(m.getAPIPath){
_16(t,m.getAPIPath());
}
}
});
},_initMod:function(_53,key){
var t=this,_54=t._modules,m=_54[key],mod=m.mod,d=mod.loaded;
if(!m.done){
m.done=1;
new _6(_3.map(_3.filter(m.deps,function(_55){
return _54[_55];
}),_f(t,t._initMod,_53)),0,1).then(function(){
if(mod.load){
mod.load(m.args,_53);
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
