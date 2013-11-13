//>>built
define("gridx/modules/Dod",["dojo/_base/kernel","../core/_Module","dojo/_base/declare","dojo/_base/html","dojo/_base/fx","dojo/fx","dojo/query"],function(_1,_2,_3,_4,_5,fx,_6){
return _3(_2,{name:"dod",required:["body"],useAnimation:true,duration:750,defaultShow:false,showExpando:true,autoClose:false,load:function(_7,_8){
_1.experimental("gridx/modules/Dod");
this._rowMap={};
this.connect(this.grid.body,"onAfterRow","_onAfterRow");
this.connect(this.grid.bodyNode,"onclick","_onBodyClick");
if(this.grid.columnResizer){
this.connect(this.grid.columnResizer,"onResize","_onColumnResize");
}
this.loaded.callback();
},getAPIPath:function(){
return {dod:this};
},rowMixin:{showDetail:function(){
this.grid.dod.show(this);
},hideDetail:function(){
this.grid.dod.hide(this);
},toggleDetail:function(){
this.grid.dod.toggle(this);
},refreshDetail:function(){
this.grid.dod.refreshDetail(this);
},isDetailShown:function(){
return this.grid.dod.isShown(this);
}},show:function(_9){
var _a=this._row(_9);
if(_a.dodShown||_a.inAnim||!_9.node()){
return;
}
_a.dodShown=true;
this._getExpando(_9).firstChild.innerHTML="-";
var _b=_9.node(),w=_b.scrollWidth;
if(!_a.dodLoadingNode){
_a.dodLoadingNode=_1.create("div",{className:"gridxDodLoadNode",innerHTML:"Loading..."});
}
if(!_a.dodNode){
_a.dodNode=_1.create("div",{className:"gridxDodNode"});
}
_4.place(_a.dodLoadingNode,_b,"last");
_4.place(_a.dodNode,_b,"last");
_4.style(_a.dodLoadingNode,"width",w+"px");
_4.style(_a.dodNode,"width",w+"px");
_4.addClass(_b,"gridxDodShown");
_4.style(_a.dodNode,"display","none");
if(_a.dodLoaded){
this._detailLoadComplete(_9);
return;
}else{
_4.style(_a.dodLoadingNode,"display","block");
}
if(this.grid.rowHeader){
var _c=_6("[rowid=\""+_9.id+"\"].gridxRowHeaderRow",this.grid.rowHeader.bodyNode)[0];
_1.style(_c.firstChild,"height",_1.style(_9.node(),"height")+"px");
}
var df=new _1.Deferred(),_d=this;
this.detailProvider(this.grid,_9.id,_a.dodNode,df);
df.then(_1.hitch(this,"_detailLoadComplete",_9),_1.hitch(this,"_detailLoadError",_9));
},hide:function(_e){
var _f=this._row(_e),g=this.grid;
if(!_f.dodShown||_f.inAnim||!_e.node()){
return;
}
_4.removeClass(_e.node(),"gridxDodShown");
_4.style(_f.dodLoadingNode,"display","none");
if(this.grid.rowHeader){
var _10=_6("[rowid=\""+_e.id+"\"].gridxRowHeaderRow",this.grid.rowHeader.bodyNode)[0];
_1.style(_10.firstChild,"height",_1.style(_e.node(),"height")-1+"px");
}
this._getExpando(_e).firstChild.innerHTML="+";
_f.inAnim=true;
fx.wipeOut({node:_f.dodNode,duration:this.arg("duration"),onEnd:function(){
_f.dodShown=false;
_f.inAnim=false;
g.body.onRender();
}}).play();
if(this.grid.rowHeader){
var _10=_6("[rowid=\""+_e.id+"\"].gridxRowHeaderRow",this.grid.rowHeader.bodyNode)[0];
_5.animateProperty({node:_10.firstChild,duration:this.arg("duration"),properties:{height:{start:_10.offsetHeight,end:_10.offsetHeight-_f.dodNode.scrollHeight,units:"px"},}}).play();
}
_f.defaultShow=false;
},toggle:function(row){
if(this.isShown(row)){
this.hide(row);
}else{
this.show(row);
}
},refresh:function(row){
var _11=this._row(row);
_11.dodLoaded=false;
this.show(row);
},isShown:function(row){
var _12=this._row(row);
return !!_12.dodShown;
},onShow:function(row){
},onHide:function(row){
},_rowMap:null,_lastOpen:null,_row:function(row){
var id=row.id||row;
return this._rowMap[id]||(this._rowMap[id]={});
},_onBodyClick:function(e){
if(!_4.hasClass(e.target,"gridxDodExpando")&&!_4.hasClass(e.target,"gridxDodExpandoText")){
return;
}
var _13=e.target;
while(_13&&!_4.hasClass(_13,"gridxRow")){
_13=_13.parentNode;
}
var idx=_4.attr(_13,"rowindex");
this.toggle(this.grid.row(parseInt(idx)));
},_onAfterRow:function(row){
var _14=this._row(row);
if(this.arg("showExpando")){
var tbl=_1.query("table",row.node())[0];
var _15=tbl.rows[0].cells[0];
var _16=_1.create("span",{className:"gridxDodExpando",innerHTML:"<span class=\"gridxDodExpandoText\">"+(this.defaultShow?"-":"+")+"</span>"},_15,"first");
}
if(this.isShown(row)||(this.arg("defaultShow")&&_14.dodShown===undefined)){
_14.dodShown=false;
_14.defaultShow=true;
this.show(row);
}
},_onColumnResize:function(){
_1.query(".gridxDodNode",this.grid.bodyNode).forEach(function(_17){
_4.style(_17,"width",_17.parentNode.firstChild.offsetWidth+"px");
});
},_detailLoadComplete:function(row){
var _18=this._row(row),g=this.grid;
if(!this.isShown(row)){
return;
}
_18.dodLoaded=true;
if(_18.defaultShow){
_4.style(_18.dodNode,"display","block");
g.body.onRender();
}else{
if(_1.style(_18.dodLoadingNode,"display")=="block"){
_4.marginBox(_18.dodNode,{h:_4.marginBox(_18.dodLoadingNode).h});
_4.style(_18.dodNode,"display","block");
}
_18.inAnim=true;
fx.wipeIn({node:_18.dodNode,duration:this.arg("duration"),onEnd:function(){
_18.inAnim=false;
g.body.onRender();
}}).play();
if(this.grid.rowHeader){
var _19=_6("[rowid=\""+row.id+"\"].gridxRowHeaderRow",this.grid.rowHeader.bodyNode)[0];
_5.animateProperty({node:_19.firstChild,duration:this.arg("duration"),properties:{height:{start:_19.offsetHeight,end:row.node().firstChild.offsetHeight+_18.dodNode.scrollHeight,units:"px"},}}).play();
}
}
_4.style(_18.dodLoadingNode,"display","none");
},_detailLoadError:function(row){
var _1a=this._row(row);
_1a.dodLoaded=false;
if(!this.isShown(row)){
return;
}
_1a.dodLoadingNode.innerHTML="Error: failed to load detail.";
},_showLoading:function(row){
var _1b=this._row(row);
var _1c=_1b.dodLoadingNode;
_1c.innerHTML="Loading...";
},_getExpando:function(row){
var tbl=_1.query("table",row.node())[0];
var _1d=tbl.rows[0].cells[0];
return _1d.firstChild;
},_hideLoading:function(row){
},endFunc:function(){
}});
});
