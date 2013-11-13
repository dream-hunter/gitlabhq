//>>built
require({cache:{"url:gridx/templates/FilterPane.html":"<ul class=\"gridxFilterPaneForm\">\n\t<li><label id=\"${id}_ColumnLabel\" for=\"${id}_ColumnSelect\">${i18n.columnSelectLabel}</label></li>\n\t<li name=\"sltColumn\">\n\t\t<div data-dojo-type=\"dijit.form.Select\" id=\"${id}_ColumnSelect\" aria-labelledby=\"${id}_ColumnLabel\" style=\"width:100%;\"></div>\n\t</li>\n\t<li><label id=\"${id}_ConditionLabel\" for=\"${id}_ConditionSelect\">${i18n.conditionSelectLabel}</label></li>\n\t<li name=\"sltCondition\">\n\t\t<div data-dojo-type=\"dijit.form.Select\" id=\"${id}_ConditionSelect\" style=\"width:100%;\" aria-labelledby=\"${id}_ConditionLabel\"></div>\n\t</li>\n\t<li><label id=\"${id}_ValueLabel\">${i18n.valueBoxLabel}</label></li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneTextWrapper\">\n\t\t<input type=\"text\" data-dojo-type=\"dijit.form.TextBox\" intermediateChanges=\"true\"\n\t\t style=\"width:100%;\" aria-labelledby=\"${id}_ValueLabel\"/>\n\t</li>\n\t\n<!--            dropDownClass=\"gridx.modules.filter.DistinctComboBoxMenu\"-->\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneComboWrapper\">\n\t\t<input type=\"text\" data-dojo-type=\"dijit.form.ComboBox\" \n\t\t\tintermediateChanges=\"true\" autoComplete=\"false\" queryExpr=\"*${i18n.startsWithExpr}\" \n\t\t\tstyle=\"width:100%;\"  aria-labelledby=\"${id}_ValueLabel\"/>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneNumberWrapper\">\n\t\t<input type=\"text\" data-dojo-type=\"dijit.form.NumberTextBox\"  aria-labelledby=\"${id}_ValueLabel\" intermediateChanges=\"true\" style=\"width:100%;\"/>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneDateWrapper\">\n\t\t<div data-dojo-type=\"dijit.form.DateTextBox\" aria-labelledby=\"${id}_ValueLabel\" intermediateChanges=\"true\" style=\"width: 100%\"></div>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneDateRangeWrapper\">\n\t\t<div data-dojo-type=\"dijit.form.DateTextBox\" style=\"width:44%; float: left;\" intermediateChanges=\"true\"\n\t\t\t aria-label=\"${i18n.beginDateRangeLabel}\"></div>\n\t\t<div style=\"width:10%; text-align: center; float: left;\">${i18n.rangeTo}</div>\n\t\t<div data-dojo-type=\"dijit.form.DateTextBox\" style=\"width:44%; float: right;\" intermediateChanges=\"true\"\n\t\t\t aria-label=\"${i18n.endDateRangeLabel}\"></div>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneTimeWrapper\">\n\t\t<div data-dojo-type=\"dijit.form.TimeTextBox\" aria-labelledby=\"${id}_ValueLabel\" style=\"width: 100%\" intermediateChanges=\"true\"></div>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneTimeRangeWrapper\">\n\t\t<div data-dojo-type=\"dijit.form.TimeTextBox\" style=\"width:44%; float: left;\" intermediateChanges=\"true\"\n\t\t\t aria-label=\"${i18n.beginTimeRangeLabel}\"></div>\n\t\t<div style=\"text-align: center; float: left; width: 10%;\">${i18n.rangeTo}</div>\n\t\t<div data-dojo-type=\"dijit.form.TimeTextBox\" style=\"width:44%; float: right;\" intermediateChanges=\"true\"\n\t\t\t aria-label=\"${i18n.endTimeRangeLabel}\"></div>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneRadioWrapper\">\n\t\t<span style=\"width:49%; float:left;\">\n\t\t\t<div data-dojo-type=\"dijit.form.RadioButton\" aria-label=\"${i18n.radioTrueLabel}\" checked=\"true\"></div><span>${i18n.trueLabel}</span>\n\t\t</span>\n\t\t<span style=\"width:49%; float: right;\">\n\t\t\t<div data-dojo-type=\"dijit.form.RadioButton\" aria-label=\"${i18n.radioFalseLabel}\"></div><span>${i18n.falseLabel}</span>\n\t\t</span>\n\t</li>\n\t\n\t<li class=\"gridxFilterPaneFieldWrapper gridxFilterPaneSelectWrapper\">\n\t\t<div data-dojo-type=\"dijit.form.Select\" aria-labelledby=\"${id}_ValueLabel\" style=\"width: 100%\"></div>\n\t</li>\n</ul>\n"}});
define("gridx/modules/filter/FilterPane",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/dom-construct","dojo/dom-class","dojo/string","dojo/query","dijit/registry","dojox/html/ellipsis","dojox/html/metrics","./DistinctComboBoxMenu","./Filter","dojo/text!../../templates/FilterPane.html","dojo/i18n!../../nls/FilterBar","dijit/layout/ContentPane","dijit/form/Select","dijit/form/TextBox","dijit/form/DateTextBox","dijit/form/TimeTextBox","dijit/form/RadioButton","dijit/form/NumberTextBox","dijit/form/ComboBox"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){
var _f="_gridx_any_column_value_";
function _10(_11){
return _11==_f;
};
return _1([dijit.layout.ContentPane],{sltColumn:null,sltCondition:null,grid:null,title:_e.defaultRuleTitle,postCreate:function(){
this.inherited(arguments);
this.i18n=_e;
this.set("content",_6.substitute(_d,this));
this._initFields();
this._initSltCol();
this.connect(this.sltColumn,"onChange","_onColumnChange");
this.connect(this.sltCondition,"onChange","_onConditionChange");
this.comboText.dropDownClass=_b;
this._onConditionChange();
},getData:function(){
var _12=this._getValue(),_13=this.sltColumn.get("value"),_14=this.sltCondition.get("value");
if(_14==="isEmpty"||(_12!==null&&(_14!=="range"||(_12.start&&_12.end)))){
return {colId:_10(_13)?"":_13,condition:_14,value:_14==="isEmpty"?"":_12,type:this._getType()};
}else{
return null;
}
},setData:function(_15){
if(_15===null){
return;
}
this.sltColumn.set("value",_15.colId,null);
this._onColumnChange();
this.sltCondition.set("value",_15.condition,null);
this._onConditionChange();
this._setValue(_15.value);
},close:function(){
var ac=this._getContainer();
if(ac.getChildren().length===4){
ac._contentBox.w+=_a.getScrollbar().w;
}
if(this===ac.selectedChildWidget){
var i=_3.indexOf(ac.getChildren(),this);
if(i>0){
ac.selectChild(ac.getChildren()[i-1]);
}
}
ac.removeChild(this);
_5.toggle(ac.domNode,"gridxFilterSingleRule",ac.getChildren().length===1);
this.grid.filterBar._filterDialog._updateAccordionContainerHeight();
},onChange:function(){
},_getContainer:function(){
return _8.byNode(this.domNode.parentNode.parentNode.parentNode);
},_initFields:function(){
this.sltColumn=_8.byNode(_7("li>table",this.domNode)[0]);
this.sltCondition=_8.byNode(_7("li>table",this.domNode)[1]);
var _16=this._fields=[this.tbSingle=_8.byNode(_7(".gridxFilterPaneTextWrapper > .dijitTextBox",this.domNode)[0]),this.tbNumber=_8.byNode(_7(".gridxFilterPaneNumberWrapper > .dijitTextBox",this.domNode)[0]),this.comboText=_8.byNode(_7(".gridxFilterPaneComboWrapper > .dijitComboBox",this.domNode)[0]),this.sltSingle=_8.byNode(_7(".gridxFilterPaneSelectWrapper > .dijitSelect",this.domNode)[0]),this.dtbSingle=_8.byNode(_7(".gridxFilterPaneDateWrapper > .dijitDateTextBox",this.domNode)[0]),this.dtbStart=_8.byNode(_7(".gridxFilterPaneDateRangeWrapper > .dijitDateTextBox",this.domNode)[0]),this.dtbEnd=_8.byNode(_7(".gridxFilterPaneDateRangeWrapper > .dijitDateTextBox",this.domNode)[1]),this.ttbSingle=_8.byNode(_7(".gridxFilterPaneTimeWrapper > .dijitTimeTextBox",this.domNode)[0]),this.ttbStart=_8.byNode(_7(".gridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox",this.domNode)[0]),this.ttbEnd=_8.byNode(_7(".gridxFilterPaneTimeRangeWrapper > .dijitTimeTextBox",this.domNode)[1]),this.rbTrue=_8.byNode(_7(".gridxFilterPaneRadioWrapper .dijitRadio",this.domNode)[0]),this.rbFalse=_8.byNode(_7(".gridxFilterPaneRadioWrapper .dijitRadio",this.domNode)[1])];
this.rbTrue.domNode.nextSibling.htmlFor=this.rbTrue.id;
this.rbFalse.domNode.nextSibling.htmlFor=this.rbFalse.id;
var _17="rb_name_"+Math.random();
this.rbTrue.set("name",_17);
this.rbFalse.set("name",_17);
_3.forEach(_16,function(_18){
this.connect(_18,"onChange","_onValueChange");
},this);
},_initSltCol:function(){
var _19=[{label:_e.anyColumnOption,value:_f}],fb=this.grid.filterBar,_1a=this.sltColumn;
_3.forEach(this.grid.columns(),function(col){
if(!col.isFilterable()){
return;
}
_19.push({value:col.id,label:col.name()});
},this);
_1a.addOption(_19);
},_initCloseButton:function(){
var _1b=this._buttonWidget;
var _1c=_4.create("span",{className:"gridxFilterPaneCloseButton",innerHTML:"<img src=\""+this._blankGif+"\"/>",tabIndex:0,title:"Close"},_1b.domNode,"last");
this.connect(_1c,"onclick","close");
_5.add(_1b.titleTextNode,"dojoxEllipsis");
},_onColumnChange:function(){
var _1d=this.sltColumn.get("value");
var opt=this.grid.filterBar._getConditionOptions(_10(_1d)?"":_1d);
var slt=this.sltCondition;
if(slt.options&&slt.options.length){
slt.removeOption(slt.options);
}
slt.addOption(_2.clone(opt));
this._updateTitle();
this._updateValueField();
this.onChange();
},_onConditionChange:function(){
this._updateValueField();
this._updateTitle();
this.onChange();
},_onValueChange:function(){
this._updateTitle();
this.onChange();
},_getDataType:function(){
var _1e=this.sltColumn.get("value");
var _1f="string";
if(!_10(_1e)){
_1f=this.grid.column(_1e).dataType();
}
return _1f;
},_getType:function(){
var _20={"string":"Text",number:"Number",date:"Date",time:"Time","boolean":"Radio"};
var _21=_20[this._getDataType()];
if("range"===this.sltCondition.get("value")){
_21+="Range";
}
return _21;
},_updateTitle:function(){
if(!this._buttonWidget){
return;
}
var _22,_23=this._getValue(),_24=this._getType(),_25=this.sltCondition.get("value"),_26=this._buttonWidget.titleTextNode;
if(_23&&(_25!=="range"||(_23.start&&_23.end))){
_22=this.sltColumn.get("displayedValue")+" "+this.grid.filterBar._getRuleString(_25,_23,_24);
}else{
var _27=_3.indexOf(this._getContainer().getChildren(),this)+1;
_22=_6.substitute(this.i18n.ruleTitleTemplate,{ruleNumber:_27});
}
_26.innerHTML=_22;
_26.title=_22.replace(/<\/?span[^>]*>/g,"").replace("&nbsp;"," ");
},_needComboBox:function(){
var _28=this.sltColumn.get("value");
return this._getType()==="Text"&&!_10(_28)&&this.grid._columnsById[_28].field;
},_updateValueField:function(){
var _29=this._getType(),_2a=this.sltColumn.get("value");
var _2b=this._needComboBox();
_3.forEach(["Text","Combo","Date","Number","DateRange","Time","TimeRange","Select","Radio"],function(k){
_5.remove(this.domNode,"gridxFilterPane"+k);
},this);
_5.add(this.domNode,"gridxFilterPane"+(_2b?"Combo":_29));
var _2c=this.sltCondition.get("value")==="isEmpty";
_3.forEach(this._fields,function(f){
f.set("disabled",_2c);
});
if(_2b){
if(!this._dummyCombo){
this._dummyCombo=new dijit.form.ComboBox({store:this.grid.store});
}
var col=this.grid._columnsById[_2a];
_2.mixin(this.comboText,{store:this.grid.store,searchAttr:col.field,fetchProperties:{sort:[{attribute:col.field,descending:false}]}});
}
},_getValue:function(){
var _2d=this._getType(),_2e=this._needComboBox();
switch(_2d){
case "Text":
return (_2e?this.comboText:this.tbSingle).get("value")||null;
case "Number":
return isNaN(this.tbNumber.get("value"))?null:this.tbNumber.get("value");
case "Select":
return this.sltSingle.get("value")||null;
case "Date":
return this.dtbSingle.get("value")||null;
case "DateRange":
return {start:this.dtbStart.get("value"),end:this.dtbEnd.get("value")};
case "Time":
return this.ttbSingle.get("value")||null;
case "TimeRange":
return {start:this.ttbStart.get("value"),end:this.ttbEnd.get("value")};
case "Radio":
return !!this.rbTrue.get("checked");
default:
return null;
}
},_setValue:function(_2f){
if(!_2f){
return;
}
var _30=this._getType(),_31=this._needComboBox();
switch(_30){
case "Text":
(_31?this.comboText:this.tbSingle).set("value",_2f);
break;
case "Number":
this.tbNumber.set("value",_2f);
break;
case "Select":
this.sltSingle.set("value",_2f);
break;
case "Date":
this.dtbSingle.set("value",_2f);
break;
case "DateRange":
this.dtbStart.set("value",_2f.start);
this.dtbEnd.set("value",_2f.end);
break;
case "Time":
this.ttbSingle.set("value",_2f);
break;
case "TimeRange":
this.ttbStart.set("value",_2f.start);
this.ttbEnd.set("value",_2f.end);
break;
case "Radio":
this.rbTrue.set("checked",true);
break;
}
},uninitialize:function(){
this.inherited(arguments);
if(this._dummyCombo){
this._dummyCombo.destroyRecursive();
}
}});
});
