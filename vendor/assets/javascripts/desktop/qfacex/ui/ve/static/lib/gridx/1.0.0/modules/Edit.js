//>>built
define("gridx/modules/Edit",["dojo/_base/declare","dojo/_base/lang","dojo/_base/json","dojo/_base/Deferred","dojo/_base/sniff","dojo/DeferredList","dojo/dom-class","dojo/keys","../core/_Module","../util","dojo/date/locale","dijit/form/TextBox"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b){
function _c(_d,_e,_f){
if(_d.storePattern&&(_d.dataType=="date"||_d.dataType=="time")){
return _b.parse(_e,_d.storePattern);
}
return _f;
};
function _10(_11,_12,_13,_14){
var d=_b.parse(_14[_11],_12);
return d?_b.format(d,_13):_14[_11];
};
function _15(_16){
return _16&&function(_17,_18,_19){
var _1a=_19.gridCellEditField,_1b=_19.cell,_1c=_1b.column.editorArgs;
_1a.set(_1c&&_1c.valueField||"value",_16(_18,_17,_1b,_1a));
};
};
_9._markupAttrs.push("!editable","!alwaysEditing","editor","!editorArgs","applyWhen");
return _1(_9,{name:"edit",forced:["cellWidget"],constructor:function(){
this._init();
},getAPIPath:function(){
return {edit:this};
},preload:function(){
var t=this;
t.grid.domNode.removeAttribute("aria-readonly");
t.connect(t.grid,"onCellDblClick","_onUIBegin");
t.connect(t.grid.cellWidget,"onCellWidgetCreated","_onCellWidgetCreated");
t._initFocus();
},cellMixin:{beginEdit:function(){
return this.grid.edit.begin(this.row.id,this.column.id);
},cancelEdit:function(){
this.grid.edit.cancel(this.row.id,this.column.id);
return this;
},applyEdit:function(){
return this.grid.edit.apply(this.row.id,this.column.id);
},isEditing:function(){
return this.grid.edit.isEditing(this.row.id,this.column.id);
},editor:function(){
var cw=this.grid.cellWidget.getCellWidget(this.row.id,this.column.id);
return cw&&cw.gridCellEditField;
}},columnMixin:{isEditable:function(){
var col=this.grid._columnsById[this.id];
return col.editable;
},isAlwaysEditing:function(){
return this.grid._columnsById[this.id].alwaysEditing;
},setEditable:function(_1d){
this.grid._columnsById[this.id].editable=!!_1d;
return this;
},editor:function(){
return this.grid._columnsById[this.id].editor;
},setEditor:function(_1e,_1f){
this.grid.edit.setEditor(this.id,_1e,_1f);
return this;
}},begin:function(_20,_21){
var d=new _4(),t=this,g=t.grid;
if(!t.isEditing(_20,_21)){
var row=g.row(_20,1),col=g._columnsById[_21];
if(row&&col.editable){
g.cellWidget.setCellDecorator(_20,_21,t._getDecorator(_21),_15((col.editorArgs&&col.editorArgs.toEditor)||_2.partial(_c,col)));
t._record(_20,_21);
g.body.refreshCell(row.visualIndex(),col.index).then(function(){
t._focusEditor(_20,_21);
d.callback(true);
t.onBegin(g.cell(_20,_21,1));
});
}else{
d.callback(false);
}
}else{
t._record(_20,_21);
t._focusEditor(_20,_21);
d.callback(true);
t.onBegin(g.cell(_20,_21,1));
}
return d;
},cancel:function(_22,_23){
var d=new _4(),t=this,g=t.grid,m=t.model,row=g.row(_22,1);
if(row){
var cw=g.cellWidget,col=g._columnsById[_23];
if(col){
if(col.alwaysEditing){
var _24=m.byId(_22);
cw=cw.getCellWidget(_22,_23);
cw.setValue(_24.data[_23],_24.rawData[col.field]);
d.callback();
t.onCancel(g.cell(_22,_23,1));
}else{
t._erase(_22,_23);
cw.restoreCellDecorator(_22,_23);
g.body.refreshCell(row.visualIndex(),col.index).then(function(){
d.callback();
t.onCancel(g.cell(_22,_23,1));
});
}
}
}else{
d.callback();
}
return d;
},apply:function(_25,_26){
var d=new _4(),t=this,g=t.grid,_27=g.cell(_25,_26,1);
if(_27){
var _28=g.cellWidget.getCellWidget(_25,_26),_29=_28&&_28.gridCellEditField;
if(_29&&(!_2.isFunction(_29.isValid)||_29.isValid())){
var _2a=_27.column.editorArgs,_2b=_2a&&_2a.valueField||"value",v=_29.get(_2b),_2c=function(_2d){
t._erase(_25,_26);
if(_27.column.alwaysEditing){
d.callback(_2d);
t.onApply(_27,_2d);
}else{
g.cellWidget.restoreCellDecorator(_25,_26);
g.body.refreshCell(_27.row.visualIndex(),_27.column.index()).then(function(){
d.callback(_2d);
t.onApply(_27,_2d);
});
}
};
try{
if(_2a&&_2a.fromEditor){
v=_2a.fromEditor(v,_28.cell);
}else{
if(_27.column.storePattern){
v=_b.format(v,_27.column.storePattern);
}
}
if(_27.rawData()===v){
_2c(true);
}else{
_4.when(_27.setRawData(v),function(_2e){
_2c(true);
});
}
}
catch(e){
console.warn("Can not apply change! Error message: ",e);
_2c(false);
return d;
}
return d;
}
}
d.callback(false);
return d;
},isEditing:function(_2f,_30){
var col=this.grid._columnsById[_30];
if(col&&col.alwaysEditing){
return true;
}
var _31=this.grid.cellWidget.getCellWidget(_2f,_30);
return !!_31&&!!_31.gridCellEditField;
},setEditor:function(_32,_33,_34){
var col=this.grid._columnsById[_32],_35=col.editorArgs=col.editorArgs||{};
col.editor=_33;
if(_34){
_35.toEditor=_34.toEditor;
_35.fromEditor=_34.fromEditor;
_35.dijitProperties=_34.dijitProperties;
}
},onBegin:function(){
},onApply:function(){
},onCancel:function(){
},_init:function(){
this._editingCells={};
for(var i=0,_36=this.grid._columns,len=_36.length;i<len;++i){
var c=_36[i];
if(c.storePattern&&c.field&&(c.dataType=="date"||c.dataType=="time")){
c.gridPattern=c.gridPattern||(!_2.isFunction(c.formatter)&&(_2.isObject(c.formatter)||typeof c.formatter=="string")&&c.formatter)||c.storePattern;
var _37;
if(_2.isString(c.storePattern)){
_37=c.storePattern;
c.storePattern={};
c.storePattern[c.dataType+"Pattern"]=_37;
}
c.storePattern.selector=c.dataType;
if(_2.isString(c.gridPattern)){
_37=c.gridPattern;
c.gridPattern={};
c.gridPattern[c.dataType+"Pattern"]=_37;
}
c.gridPattern.selector=c.dataType;
c.formatter=_2.partial(_10,c.field,c.storePattern,c.gridPattern);
}
}
this._initAlwaysEdit();
},_initAlwaysEdit:function(){
for(var t=this,_38=t.grid._columns,i=_38.length-1;i>=0;--i){
var col=_38[i];
if(col.alwaysEditing){
col.editable=true;
col.navigable=true;
col.userDecorator=t._getDecorator(col.id);
col.setCellValue=_15((col.editorArgs&&col.editorArgs.toEditor)||_2.partial(_c,col));
col.decorator=function(){
return "";
};
col._cellWidgets={};
col._backupWidgets=[];
}
}
},_getColumnEditor:function(_39){
var _3a=this.grid._columnsById[_39].editor;
if(_2.isFunction(_3a)){
return _3a.prototype.declaredClass;
}else{
if(_2.isString(_3a)){
return _3a;
}else{
return "dijit.form.TextBox";
}
}
},_onCellWidgetCreated:function(_3b,_3c){
var t=this,_3d=_3c.column,_3e=_3b.gridCellEditField;
if(_3e&&_3d.alwaysEditing){
_3b.connect(_3e,"onChange",function(){
var rn=_3b.domNode.parentNode;
while(rn&&!_7.contains(rn,"gridxRow")){
rn=rn.parentNode;
}
if(rn){
var _3f=_3d.editorArgs&&_3d.editorArgs.applyDelay||500;
clearTimeout(_3e._timeoutApply);
_3e._timeoutApply=setTimeout(function(){
t.apply(rn.getAttribute("rowid"),_3d.id);
},_3f);
}
});
}
},_focusEditor:function(_40,_41){
var cw=this.grid.cellWidget,_42=function(){
var _43=cw.getCellWidget(_40,_41),_44=_43&&_43.gridCellEditField;
if(_44&&!_44.focused){
_44.focus();
}
};
if(_5("webkit")){
_42();
}else{
setTimeout(_42,1);
}
},_getDecorator:function(_45){
var _46=this._getColumnEditor(_45),p,_47,col=this.grid._columnsById[_45],_48=col.editorArgs,_49=_48&&_48.constraints||{},_4a=_48&&_48.props||"",_4b=col.gridPattern||col.storePattern;
if(_4b){
_49=_2.mixin({},_4b,_49);
}
_49=_3.toJson(_49);
_49=_49.substring(1,_49.length-1);
if(_4a&&_49){
_4a+=", ";
}
return function(){
return ["<div data-dojo-type='",_46,"' ","data-dojo-attach-point='gridCellEditField' ","class='gridxCellEditor gridxHasGridCellValue gridxUseStoreData' ","data-dojo-props='",_4a,_49,"'></div>"].join("");
};
},_record:function(_4c,_4d){
var _4e=this._editingCells,r=_4e[_4c];
if(!r){
r=_4e[_4c]={};
}
r[_4d]=1;
},_erase:function(_4f,_50){
var _51=this._editingCells,r=_51[_4f];
if(r){
delete r[_50];
}
},_applyAll:function(){
var _52=this._editingCells,r,c;
for(r in _52){
for(c in _52[r]){
this.apply(r,c);
}
}
},_onUIBegin:function(evt){
if(!this.isEditing(evt.rowId,evt.columnId)){
this._applyAll();
}
return this.begin(evt.rowId,evt.columnId);
},_initFocus:function(){
var t=this,g=t.grid,f=g.focus;
if(f){
f.registerArea({name:"edit",priority:1,scope:t,doFocus:t._onFocus,doBlur:t._doBlur,onFocus:t._onFocus,onBlur:t._onBlur,connects:[t.connect(g,"onCellKeyDown","_onKey"),t.connect(t,"_focusEditor","_focus")]});
}else{
t.connect(g,"onCellMouseDown",function(e){
var _53=t._editingCells;
if(!_53[e.rowId]||!_53[e.rowId][e.columnId]){
t._applyAll();
}
});
}
},_onFocus:function(evt){
var t=this;
if(evt){
var n=evt.target;
while(n&&!_7.contains(n,"gridxCell")){
n=n.parentNode;
}
if(n){
var _54=n.getAttribute("colid"),_55=n.parentNode.parentNode.parentNode.parentNode.getAttribute("rowid");
if(t.isEditing(_55,_54)){
t._record(_55,_54);
return true;
}
}
return false;
}
return t._editing;
},_doBlur:function(evt,_56){
var t=this,g=t.grid,_57=g.body;
if(t._editing&&_56){
var _58=_57.getRowInfo({parentId:t.model.treePath(t._focusCellRow).pop(),rowIndex:t.model.idToIndex(t._focusCellRow)}).visualIndex,_59=g._columnsById[t._focusCellCol].index,dir=_56>0?1:-1,_5a=function(r,c){
return g._columns[c].editable;
};
_57._nextCell(_58,_59,dir,_5a).then(function(obj){
_a.stopEvent(evt);
t._applyAll();
t._focusCellCol=g._columns[obj.c].id;
var _5b=_57.getRowInfo({visualIndex:obj.r});
t._focusCellRow=t.model.indexToId(_5b.rowIndex,_5b.parentId);
_57._focusCellCol=obj.c;
_57._focusCellRow=obj.r;
t.begin(t._focusCellRow,t._focusCellCol);
});
return false;
}
return true;
},_onBlur:function(){
this._applyAll();
return true;
},_focus:function(_5c,_5d){
var t=this;
t._editing=true;
t._focusCellCol=_5d;
t._focusCellRow=_5c;
t.grid.focus.focusArea("edit");
},_blur:function(){
this._editing=false;
var _5e=this.grid.focus;
if(_5e){
if(_5("ie")){
setTimeout(function(){
_5e.focusArea("body");
},1);
}else{
_5e.focusArea("body");
}
}
},_onKey:function(e){
var t=this,g=t.grid,col=g._columnsById[e.columnId];
if(col.editable){
var _5f=t.isEditing(e.rowId,e.columnId);
if(e.keyCode==_8.ENTER){
if(_5f){
t.apply(e.rowId,e.columnId).then(function(_60){
if(_60){
t._blur();
}
if(col.alwaysEditing){
t._focusEditor(e.rowId,e.columnId);
}
});
}else{
if(g.focus.currentArea()=="body"){
_a.stopEvent(e);
t._onUIBegin(e);
}
}
}else{
if(e.keyCode==_8.ESCAPE&&_5f){
t.cancel(e.rowId,e.columnId).then(_2.hitch(t,t._blur)).then(function(){
g.focus.focusArea("body");
});
}
}
}
if(t._editing&&e.keyCode!==_8.TAB){
e.stopPropagation();
}
}});
});
