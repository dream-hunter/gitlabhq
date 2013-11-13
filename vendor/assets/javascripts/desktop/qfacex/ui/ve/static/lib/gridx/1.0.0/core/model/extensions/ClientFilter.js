//>>built
define("gridx/core/model/extensions/ClientFilter",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/_base/Deferred","../_Extension"],function(_1,_2,_3,_4,_5){
var _6=_3.hitch,_7=_2.forEach,_8=_2.indexOf;
return _1(_5,{name:"clientFilter",priority:20,constructor:function(_9,_a){
this.pageSize=_a.pageSize||100;
this._mixinAPI("filter","hasFilter");
_9.onFilterProgress=function(){
};
this.aspect(_9,"_msg","_receiveMsg");
this.aspect(_9,"setStore","clear");
},clear:function(){
this._ids=0;
this._indexes={};
},filter:function(_b){
this.model._addCmd({name:"_cmdFilter",scope:this,args:arguments,async:1});
},hasFilter:function(){
return !!this._ids;
},byIndex:function(_c){
var t=this,_d=t._ids,_e=t.inner,id=_d&&_d[_c];
return _d?t.model.isId(id)&&_e._call("byId",[id]):_e._call("byIndex",arguments);
},byId:function(id){
return (this.ids&&this._indexes[id]===undefined)?null:this.inner._call("byId",arguments);
},indexToId:function(_f){
return this._ids?this._ids[_f]:this.inner._call("indexToId",arguments);
},idToIndex:function(id){
if(this._ids){
var idx=_8(this._ids,id);
return idx>=0?idx:undefined;
}
return this.inner._call("idToIndex",arguments);
},size:function(){
return this._ids?this._ids.length:this.inner._call("size",arguments);
},when:function(_10,_11){
var t=this,f=function(){
if(t._ids){
t._mapWhenArgs(_10);
}
return t.inner._call("when",[_10,_11]);
};
if(t._refilter){
t._refilter=0;
if(t._ids){
var d=new _4();
t._reFilter().then(function(){
f().then(_6(d,d.callback),_6(d,d.errback));
});
return d;
}
}
return f();
},_cmdFilter:function(){
var a=arguments;
return this._filter.apply(this,a[a.length-1]);
},_filter:function(_12){
var t=this,_13=t.size();
t.clear();
if(_3.isFunction(_12)){
var ids=[];
return t.model.scan({start:0,pageSize:t.pageSize,whenScope:t,whenFunc:t.when},function(_14,s){
var i,id,row,end=s+_14.length;
for(i=s;i<end;++i){
id=t.indexToId(i);
row=t.byIndex(i);
if(row){
if(_12(row,id)){
ids.push(id);
t._indexes[id]=i;
}
}else{
break;
}
}
}).then(function(){
if(ids.length==t.size()){
t.clear();
}else{
t._ids=ids;
t.model._msg("filter",ids);
}
},0,t.model.onFilterProgress);
}else{
var d=new _4();
d.callback();
return d;
}
},_mapWhenArgs:function(_15){
var t=this,_16=[],_17=t._ids.length;
_15.id=_2.filter(_15.id,function(id){
return t._indexes[id]!==undefined;
});
_7(_15.range,function(r){
if(!r.count||r.count<0){
var cnt=_17-r.start;
if(cnt<=0){
return;
}
r.count=cnt;
}
for(var i=0;i<r.count;++i){
var idx=t._mapIndex(i+r.start);
if(idx!==undefined){
_16.push({start:idx,count:1});
}
}
});
_15.range=_16;
},_mapMoveArgs:function(_18){
var t=this;
if(_18.length==3){
var _19=[];
for(var i=_18[0],end=_18[0]+_18[1];i<end;++i){
_19.push(t._mapIndex(i));
}
_18[0]=_19;
_18[1]=t._mapIndex(_18[2]);
_18.pop();
}else{
_18[0]=_2.map(_18[0],function(_1a){
return t._mapIndex(_1a);
});
_18[1]=t._mapIndex(_18[1]);
}
},_mapIndex:function(_1b){
return this._indexes[this._ids[_1b]];
},_moveFiltered:function(_1c,_1d,_1e){
var t=this,_1f=t._ids.length;
if(_1c>=0&&_1c<_1f&&_1d>0&&_1d<Infinity&&_1e>=0&&_1e<_1f&&(_1e<_1c||_1e>_1c+_1d)){
var i,len,_20=[];
for(i=_1c,len=_1c+_1d;i<len;++i){
_20.push(t._mapIndex(i));
}
t.inner._call("moveIndexes",[_20,t._mapIndex(_1e)]);
}
},_reFilter:function(){
var t=this;
return t.inner._call("when",[{id:t._ids,range:[]},function(){
_7(t._ids,function(id){
var idx=t.inner._call("idToIndex",[id]);
t._indexes[id]=idx;
});
t._ids.sort(function(a,b){
return t._indexes[a]-t._indexes[b];
});
}]);
},_onMoved:function(map){
var t=this;
_7(t._ids,function(id){
var _21=t._indexes[id];
if(map[_21]!==undefined){
t._indexes[id]=map[_21];
}
});
t._ids.sort(function(a,b){
return t._indexes[a]-t._indexes[b];
});
},_receiveMsg:function(msg,_22){
var t=this;
if(t._ids){
if(msg=="storeChange"){
t._refilter=1;
}else{
if(msg=="moved"){
t._onMoved(_22);
}else{
if(msg=="beforeMove"){
t._mapMoveArgs(_22);
}
}
}
}
},_onNew:function(id){
var t=this;
if(t._ids){
t._ids.push(id);
t._refilter=1;
}
t.onNew.apply(t,arguments);
},_onDelete:function(id,_23,row){
var t=this,_24=t._indexes,ids=t._ids;
if(ids){
var i=_8(ids,id),idx=_24[id];
if(i>=0){
ids.splice(i,1);
}
if(i>=0&&idx!==undefined){
_23=i;
for(i in _24){
if(_24[i]>idx){
--_24[i];
}
}
}else{
_23=undefined;
t._refilter=1;
}
}
t.onDelete(id,_23,row);
}});
});
