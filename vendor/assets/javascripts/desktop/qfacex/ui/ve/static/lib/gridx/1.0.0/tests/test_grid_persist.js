//>>built
require(["gridx/Grid","gridx/core/model/cache/Sync","gridx/tests/support/data/MusicData","gridx/tests/support/stores/ItemFileWriteStore","gridx/tests/support/modules","gridx/tests/support/TestPane"],function(_1,_2,_3,_4,_5,_6){
store=_4({dataSource:_3,size:100});
createGrid=function(){
if(!window.grid){
grid=new _1({id:"grid",cacheClass:_2,store:store,structure:_3.layouts[4],modules:[_5.Persist,_5.SelectColumn,_5.MoveColumn,_5.DndColumn,_5.NestedSort,_5.VirtualVScroller,_5.ColumnResizer]});
grid.placeAt("gridContainer");
grid.startup();
}
};
createGrid();
destroyGrid=function(){
if(window.grid){
grid.destroy();
window.grid=null;
}
};
enablePersist=function(){
if(window.grid){
grid.persist.enabled=true;
}
};
disablePersist=function(){
if(window.grid){
grid.persist.enabled=false;
}
};
var tp=new _6({});
tp.placeAt("ctrlPane");
tp.addTestSet("Pesistent Actions",["<div data-dojo-type=\"dijit.form.Button\" data-dojo-props=\"onClick: createGrid\">Create Grid</div><br/>","<div data-dojo-type=\"dijit.form.Button\" data-dojo-props=\"onClick: destroyGrid\">Destroy Grid</div><br/>","<div data-dojo-type=\"dijit.form.Button\" data-dojo-props=\"onClick: enablePersist\">Enable Persist</div><br/>","<div data-dojo-type=\"dijit.form.Button\" data-dojo-props=\"onClick: disablePersist\">Disable Persist</div><br/>",""].join(""));
tp.startup();
});
