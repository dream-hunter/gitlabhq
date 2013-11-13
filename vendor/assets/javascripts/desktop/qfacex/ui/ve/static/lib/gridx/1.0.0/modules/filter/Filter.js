//>>built
define("gridx/modules/filter/Filter",["../../core/_Module","../../core/model/extensions/ClientFilter","../../core/model/extensions/Query","dojo/_base/declare","dojo/_base/array","dojo/_base/lang"],function(_1,_2,_3,_4,_5,_6){
var _7=_4(_1,{name:"filter",modelExtensions:[_2,_3],getAPIPath:function(){
return {filter:this};
},constructor:function(){
this.setFilter(this.arg("preCondition"),1);
},serverMode:false,setupFilterQuery:function(_8){
return _8;
},setFilter:function(_9,_a){
var t=this,m=t.model;
if(_9!=t._checker){
t._checker=_9;
if(t.arg("serverMode")){
m.query(t.setupFilterQuery(_9.expr));
}else{
m.filter(_9);
if(!_a){
t.grid.body.refresh();
}
}
}
},getFilter:function(){
return this._checker;
}});
function _b(d,_c,_d){
if(_6.isFunction(_d)){
d=_d(d);
}
switch(_c){
case "number":
return parseFloat(d,10);
case "boolean":
return !!d;
case "date":
d=new Date(d);
d.setHours(0);
d.setMinutes(0);
d.setSeconds(0);
d.setMilliseconds(0);
return d.getTime();
case "time":
d=new Date(d);
d.setDate(1);
d.setMonth(0);
d.setFullYear(2000);
return d.getTime();
default:
return String(d);
}
};
function _e(_f,op,_10,_11){
if(_6.isArray(_10)){
_10=_5.map(_10,function(_12){
return _12.expr;
});
}
return _6.mixin(_f,{expr:_6.mixin({op:op,data:_10},_11||{})});
};
function _13(_14,_15,_16,_17,op){
var _18=String(_15.apply(0,_14)),_19=String(_16.apply(0,_14));
if(!_17){
_18=_18.toLowerCase();
_19=_19.toLowerCase();
}
return op(_18,_19);
};
return _6.mixin(_7,{column:function(_1a,_1b,_1c,_1d){
_1b=String(_1b||"string").toLowerCase();
return _e(function(row){
return _b(row[_1d?"rawData":"data"][_1a],_1b,_1c);
},_1b,_1a,{isCol:true});
},value:function(v,_1e,_1f){
_1e=String(_1e||typeof v).toLowerCase();
v=_b(v,_1e,_1f);
return _e(function(){
return v;
},_1e,v);
},isEmpty:function(_20,_21){
return _e(function(){
var v=_20.apply(0,arguments);
if(_21){
return _5.indexOf(_21,v)>=0;
}else{
return v===""||v===null||v===undefined;
}
},"isEmpty",[_20]);
},and:function(){
var _22=_5.filter(arguments,function(arg){
return _6.isFunction(arg);
});
return _e(function(){
var _23=arguments;
return _5.every(_22,function(_24){
return _24.apply(0,_23);
});
},"and",_22);
},or:function(){
var _25=_5.filter(arguments,function(arg){
return _6.isFunction(arg);
});
return _e(function(){
var _26=arguments;
return _5.some(_25,function(_27){
return _27.apply(0,_26);
});
},"or",_25);
},not:function(_28){
return _e(function(){
return !_28.apply(0,arguments);
},"not",[_28]);
},equal:function(_29,_2a){
return _e(function(){
return _29.apply(0,arguments)===_2a.apply(0,arguments);
},"equal",[_29,_2a]);
},greater:function(_2b,_2c){
return _e(function(){
return _2b.apply(0,arguments)>_2c.apply(0,arguments);
},"greater",[_2b,_2c]);
},less:function(_2d,_2e){
return _e(function(){
return _2d.apply(0,arguments)<_2e.apply(0,arguments);
},"less",[_2d,_2e]);
},greaterEqual:function(_2f,_30){
return _e(function(){
return _2f.apply(0,arguments)>=_30.apply(0,arguments);
},"greaterEqual",[_2f,_30]);
},lessEqual:function(_31,_32){
return _e(function(){
return _31.apply(0,arguments)<=_32.apply(0,arguments);
},"lessEqual",[_31,_32]);
},match:function(_33,_34){
return _e(function(){
return String(_33.apply(0,arguments)).search(_34)>=0;
},"match",[_33,{expr:{op:"regex",data:_34}}]);
},contain:function(_35,_36,_37){
return _e(function(){
return _13(arguments,_35,_36,_37,function(_38,_39){
return _38.indexOf(_39)>=0;
});
},"contain",[_35,_36]);
},startWith:function(_3a,_3b,_3c){
return _e(function(){
return _13(arguments,_3a,_3b,_3c,function(_3d,_3e){
return _3d.substring(0,_3e.length)===_3e;
});
},"startWith",[_3a,_3b]);
},endWith:function(_3f,_40,_41){
return _e(function(){
return _13(arguments,_3f,_40,_41,function(_42,_43){
return _42.substring(_42.length-_43.length)===_43;
});
},"endWith",[_3f,_40]);
}});
});
