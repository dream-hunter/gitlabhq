//>>built
define("gridx/core/model/cache/Async",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","dojo/DeferredList","./_Cache"],function(_1,_2,_3,_4,_5,_6){
var _7=_3.hitch;
function _8(_9,_a){
if(!_a.length||!_9.length){
return _9;
}
var _b=[],f=0,r,_c=[],_d=function(_e,_f){
_b[_e]=_b[_e]||0;
_b[_e]+=_f;
},_10=function(_11,_12){
var i,r;
for(i=_11.length-1;i>=0;--i){
r=_11[i];
_d(r.start,_12);
if(r.count){
_d(r.start+r.count,-_12);
}
}
};
_10(_9,1);
_10(_a,2);
for(var i=0,len=_b.length;i<len;++i){
if(_b[i]){
f+=_b[i];
if(f===1){
_c.push({start:i});
}else{
if(f===3){
_c._overlap=true;
}
r=_c[_c.length-1];
if(r&&!r.count){
r.count=i-r.start;
}
}
}
}
return _c;
};
function _13(_14){
var _15=[],r=_14.range,i,t,a,b,c,_16;
while(r.length>0){
c=a=r.pop();
_16=0;
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
_16=1;
break;
}
if(!_16){
_15.push(c);
}
}
_14.range=_15;
return _14;
};
function _17(_18,ps){
var r=_18.range,_19=[],a,b;
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
_19.push(a);
}
if(_19.length==1&&_19[0].count<ps){
_19[0].count=ps;
}
_18.range=_19;
return _18;
};
function _1a(n){
return typeof n=="number"&&!isNaN(n);
};
return _1(_6,{isAsync:true,constructor:function(_1b,_1c){
var cs=_1c.cacheSize,ps=_1c.pageSize;
this.cacheSize=_1a(cs)?cs:-1;
this.pageSize=_1a(ps)&&ps>0?ps:100;
},when:function(_1d,_1e){
var t=this,d=_1d._def=new _4(),_1f=_7(d,d.errback),_20=function(e){
t._requests.pop();
_1f(e);
};
t._fetchById(_1d).then(function(_21){
t._fetchByIndex(_21).then(function(_22){
t._fetchByParentId(_22).then(function(_23){
_4.when(_23._req,function(){
var err;
if(_1e){
try{
_1e();
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
},_20);
},_20);
},_20);
},_1f);
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
return _2.filter(ids,function(id){
return !c[id];
});
},_searchRootLevel:function(ids){
var t=this,d=new _4(),_24=_7(d,d.errback),_25=t._struct[""],_26=[],_27,_28;
if(ids.length){
for(var i=1,len=_25.length;i<len;++i){
if(!_25[i]){
if(_28){
_27.count++;
}else{
_28=1;
_26.push(_27={start:i-1,count:1});
}
}
}
_26.push({start:_25.length<2?0:_25.length-2});
}
var _29=function(ids){
if(ids.length&&_26.length){
t._storeFetch(_26.shift()).then(function(){
_29(t._findMissingIds(ids));
},_24);
}else{
d.callback(ids);
}
};
_29(ids);
return d;
},_searchChildLevel:function(ids){
var t=this,d=new _4(),_2a=_7(d,d.errback),st=t._struct,_2b=st[""].slice(1),_2c=function(ids){
if(ids.length&&_2b.length){
var pid=_2b.shift();
t._loadChildren(pid).then(function(){
[].push.apply(_2b,st[pid].slice(1));
_2c(t._findMissingIds(ids));
},_2a);
}else{
d.callback(ids);
}
};
_2c(ids);
return d;
},_fetchById:function(_2d){
var t=this,d=new _4(),i,r,len,pid,_2e=_7(d,d.callback),_2f=_7(d,d.errback),_30=_2d.range,_31=t.store.getChildren;
_2d.pids=[];
if(_31){
for(i=_30.length-1;i>=0;--i){
r=_30[i];
pid=r.parentId;
if(t.model.isId(pid)){
_2d.id.push(pid);
_2d.pids.push(pid);
_30.splice(i,1);
}
}
}
var ids=t._findMissingIds(_2d.id),mis=[];
if(ids.length){
_2.forEach(ids,function(id){
var idx=t.idToIndex(id);
if(idx>=0&&!t.treePath(id).pop()){
_30.push({start:idx,count:1});
}else{
mis.push(id);
}
});
t._searchRootLevel(mis).then(function(ids){
if(ids.length&&_31){
t._searchChildLevel(ids).then(function(ids){
if(ids.length){
console.warn("Requested row ids are not found: ",ids);
}
_2e(_2d);
},_2f);
}else{
_2e(_2d);
}
},_2f);
}else{
_2e(_2d);
}
return d;
},_fetchByParentId:function(_32){
var t=this,d=new _4();
new _5(_2.map(_32.pids,function(pid){
return t._loadChildren(pid);
}),0,1).then(_7(d,d.callback,_32),_7(d,d.errback));
return d;
},_fetchByIndex:function(_33){
var t=this,d=new _4(),_34=t._size[""];
_33=_17(t._mergePendingRequests(t._findMissingIndexes(_13(_33))),t.pageSize);
var _35=_34>0?_2.filter(_33.range,function(r){
if(r.count>0&&_34<r.start+r.count){
r.count=_34-r.start;
}
return r.start<_34;
}):_33.range;
new _5(_2.map(_35,function(r){
return t._storeFetch(r);
}),0,1).then(_7(d,d.callback,_33),_7(d,d.errback));
return d;
},_findMissingIndexes:function(_36){
var i,j,r,end,_37,t=this,_38=[],_39=t._struct[""],_3a=t._size[""];
for(i=_36.range.length-1;i>=0;--i){
r=_36.range[i];
end=r.count?r.start+r.count:_39.length-1;
_37=1;
for(j=r.start;j<end;++j){
var id=_39[j+1];
if(!id||!t._cache[id]){
if(_37){
_38.push({start:j,count:1});
}else{
++_38[_38.length-1].count;
}
_37=0;
}else{
_37=1;
}
}
if(!r.count){
if(!_37){
delete _38[_38.length-1].count;
}else{
if(_3a<0||j<_3a){
_38.push({start:j});
}
}
}
}
_36.range=_38;
return _36;
},_mergePendingRequests:function(_3b){
var i,req,_3c=[],_3d=this._requests;
for(i=_3d.length-1;i>=0;--i){
req=_3d[i];
_3b.range=_8(_3b.range,req.range);
if(_3b.range._overlap){
_3c.push(req._def);
}
}
_3b._req=_3c.length&&new _5(_3c,0,1);
_3d.push(_3b);
return _3b;
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
