//>>built
define("gridx/core/model/cache/Sync",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred","./_Cache"],function(_1,_2,_3,_4){
return _1(_4,{keep:function(){
},free:function(){
},when:function(_5,_6){
var d=new _3();
try{
if(_6){
_6();
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
var s=this._struct,_7=s[""].slice(1),_8,_9=function(_a){
[].push.apply(_7,s[_a].slice(1));
};
while(_7.length){
_8=_7.shift();
_3.when(this._loadChildren(_8),_2.partial(_9,_8));
}
}});
});
