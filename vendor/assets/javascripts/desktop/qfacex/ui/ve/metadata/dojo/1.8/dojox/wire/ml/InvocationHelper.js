//>>built
define("maq-metadata-dojo/dojox/wire/ml/InvocationHelper",["qfacex/ui/ide/ve/widget"],function(_1){
var _2=function(){
};
_2.prototype={getChildrenData:function(_3,_4){
if(!_3){
return undefined;
}
if(_4&&_4.serialize&&_3.object==_3.id&&_3.method){
var _5=_3[_3.method];
if(_5){
_5=_5.toString();
var _6=_5.indexOf("{");
var _7=_5.lastIndexOf("}");
var _8=_5.substring(_6+1,_7);
var _9={type:"html.script",properties:{type:"dojo/method",event:_3.method},children:_8};
return [_9];
}
}
return _1._getChildrenData(_3,_4);
}};
return _2;
});
