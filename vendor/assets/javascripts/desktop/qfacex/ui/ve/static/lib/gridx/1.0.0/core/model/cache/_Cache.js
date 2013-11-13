//>>built
define("gridx/core/model/cache/_Cache",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","../_Extension"],function(_1,_2,_3,_4,_5){
var _6=_3.hitch,_7=_3.mixin,_8=_2.indexOf;
return _1(_5,{constructor:function(_9,_a){
var t=this;
t.setStore(_a.store);
t.columns=_a.columns;
t._mixinAPI("byIndex","byId","indexToId","idToIndex","size","treePath","parentId","hasChildren","children","keep","free");
},destroy:function(){
this.inherited(arguments);
this.clear();
},setStore:function(_b){
var t=this,c="aspect",_c=_b.fetch;
t.clear();
t.store=_b;
if(!_c&&_b.notify){
t[c](_b,"notify",function(_d,id){
if(_d===undefined){
t._onDelete(id);
}else{
if(id===undefined){
t._onNew(_d);
}else{
t._onSet(_d);
}
}
});
}else{
t[c](_b,_c?"onSet":"put","_onSet");
t[c](_b,_c?"onNew":"add","_onNew");
t[c](_b,_c?"onDelete":"remove","_onDelete");
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
},byIndex:function(_e,_f){
this._init("byIndex",arguments);
return this._cache[this.indexToId(_e,_f)];
},byId:function(id){
this._init("byId",arguments);
return this._cache[id];
},indexToId:function(_10,_11){
this._init("indexToId",arguments);
var _12=this._struct[this.model.isId(_11)?_11:""];
return typeof _10=="number"&&_10>=0?_12&&_12[_10+1]:undefined;
},idToIndex:function(id){
this._init("idToIndex",arguments);
var s=this._struct,pid=s[id]&&s[id][0],_13=_8(s[pid]||[],id);
return _13>0?_13-1:-1;
},treePath:function(id){
this._init("treePath",arguments);
var s=this._struct,_14=[];
while(id!==undefined){
_14.unshift(id);
id=s[id]&&s[id][0];
}
if(_14[0]!==""){
_14=[];
}else{
_14.pop();
}
return _14;
},parentId:function(id){
return this.treePath(id).pop();
},hasChildren:function(id){
var t=this,s=t.store,c;
t._init("hasChildren",arguments);
c=t.byId(id);
return s.hasChildren&&s.hasChildren(id,c&&c.item);
},children:function(_15){
this._init("children",arguments);
_15=this.model.isId(_15)?_15:"";
var _16=this._size[_15],_17=[];
for(var i=0;i<_16;++i){
_17.push(this.indexToId(i,_15));
}
return _17;
},size:function(_18){
this._init("size",arguments);
var s=this._size[this.model.isId(_18)?_18:""];
return s>=0?s:-1;
},onBeforeFetch:function(){
},onAfterFetch:function(){
},onLoadRow:function(){
},onSetColumns:function(_19){
var t=this,id,c,_1a,col;
t.columns=_19;
for(id in t._cache){
c=t._cache[id];
for(_1a in _19){
col=_19[_1a];
c.data[_1a]=t._formatCell(col.id,c.rawData);
}
}
},_itemToObject:function(_1b){
var s=this.store;
if(s.fetch){
var obj={};
_2.forEach(s.getAttributes(_1b),function(_1c){
obj[_1c]=s.getValue(_1b,_1c);
});
return obj;
}
return _1b;
},_formatCell:function(_1d,_1e){
var col=this.columns[_1d];
return col.formatter?col.formatter(_1e):_1e[col.field||_1d];
},_formatRow:function(_1f){
var _20=this.columns,res={},_21;
for(_21 in _20){
res[_21]=this._formatCell(_21,_1f);
}
return res;
},_addRow:function(id,_22,_23,_24,_25){
var t=this,st=t._struct,pr=t._priority,pid=t.model.isId(_25)?_25:"",ids=st[pid],i;
if(!ids){
throw new Error("Fatal error of cache._addRow: parent item "+pid+" of "+id+" is not loaded");
}
if(!ids[_22+1]){
ids[_22+1]=id;
}else{
if(ids[_22+1]!==id){
throw new Error("Fatal error of cache._addRow: different row id "+id+" and "+ids[_22+1]+" for same row index "+_22);
}
}
st[id]=st[id]||[pid];
if(pid===""){
i=_8(pr,id);
if(i>=0){
pr.splice(i,1);
}
pr.push(id);
}
t._cache[id]={data:t._formatRow(_23),rawData:_23,item:_24};
t.onLoadRow(id);
},_loadChildren:function(_26){
var t=this,d=new _4(),s=t.store,row=t.byId(_26),_27=row&&s.getChildren&&s.getChildren(row.item)||[];
_4.when(_27,function(_28){
var i=0,_29,len=t._size[_26]=_28.length;
for(;i<len;++i){
_29=_28[i];
t._addRow(s.getIdentity(_29),i,t._itemToObject(_29),_29,_26);
}
d.callback();
},_6(d,d.errback));
return d;
},_onBegin:function(_2a){
this._size[""]=parseInt(_2a,10);
},_onComplete:function(d,_2b,_2c){
try{
var t=this,i=0,_2d;
for(;_2d=_2c[i];++i){
t._addRow(t.store.getIdentity(_2d),_2b+i,t._itemToObject(_2d),_2d);
}
d.callback();
}
catch(e){
d.errback(e);
}
},_storeFetch:function(_2e,_2f){
var t=this,s=t.store,d=new _4(),req=_7({},t.options||{},_2e),_30=_6(t,t._onBegin),_31=_6(t,t._onComplete,d,_2e.start),_32=_6(d,d.errback);
t._filled=1;
t.onBeforeFetch();
if(s.fetch){
s.fetch(_7(req,{onBegin:_30,onComplete:_31,onError:_32}));
}else{
var _33=s.query(req.query,req);
_4.when(_33.total,_30);
_4.when(_33,_31,_32);
}
d.then(_6(t,t.onAfterFetch));
return d;
},_onSet:function(_34){
var t=this,id=t.store.getIdentity(_34),_35=t.idToIndex(id),_36=t.treePath(id),old=t._cache[id];
if(_36.length){
t._addRow(id,_35,t._itemToObject(_34),_34,_36.pop());
}
t.onSet(id,_35,t._cache[id],old);
},_onNew:function(_37,_38){
var t=this,s=t.store,row=t._itemToObject(_37),_39=_38&&_38[s.fetch?"item":"parent"],_3a=_39?s.getIdentity(_39):"",_3b=t._size[""];
t.clear();
t.onNew(s.getIdentity(_37),0,{data:t._formatRow(row),rawData:row,item:_37});
if(!_39&&_3b>=0){
t._size[""]=_3b+1;
t.model._onSizeChange();
}
},_onDelete:function(_3c){
var t=this,s=t.store,st=t._struct,id=s.fetch?s.getIdentity(_3c):_3c,_3d=t.treePath(id);
if(_3d.length){
var _3e,i,j,ids=[id],_3f=_3d.pop(),sz=t._size,_40=sz[""],_41=_8(st[_3f],id);
st[_3f].splice(_41,1);
--sz[_3f];
for(i=0;i<ids.length;++i){
_3e=st[ids[i]];
if(_3e){
for(j=_3e.length-1;j>0;--j){
ids.push(_3e[j]);
}
}
}
for(i=ids.length-1;i>=0;--i){
j=ids[i];
delete t._cache[j];
delete st[j];
delete sz[j];
}
i=_8(t._priority,id);
if(i>=0){
t._priority.splice(i,1);
}
t.onDelete(id,_41-1);
if(!_3f&&_40>=0){
sz[""]=_40-1;
t.model._onSizeChange();
}
}else{
t.onDelete(id);
}
}});
});
