/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare",
	"qface/data/styles/Hashable",
	"qface/windows/control/primitives/ControlState"
],function(declare,Hashable) {
	var ControlStateValues	= declare(null,{
		"-attributes-"	:	{
			"states"	:	{
				type	:	Hashable,
				readOnly:	true
			}
		},
		"-methods-"	:	{
			setStateValue	:	function(/*ControlState*/state,value){
				this._states.put(state.getText(),value);
			},
			getStateValue	:	function(/*ControlState*/state){
				return this._states.get(state,true);
			},
			removeStateValue	:	function(/*ControlState*/state){
				this._states.remove(state);
			}
		},
		
		constructor	:	function(){
			this._states = new Hashable();
		},
		
		destroy	:	function(){
			this._states.clear();
			this._states = null;
		
		}
	
	});

	return ControlStateValues;
	
});	