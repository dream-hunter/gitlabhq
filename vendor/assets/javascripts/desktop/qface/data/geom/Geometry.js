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
	"qface/lang/Stateful"
],function(declare,Stateful) {
	//この抽象基本クラスから派生するクラスは、幾何学図形を定義します。 Geometry オブジェクトは、
	//2-D グラフィックス データのクリッピング、ヒット テスト、およびレンダリングに使用できます。
	var Geometry  = declare(Stateful,{
		"-attributes-" : {
			//Geometry の軸平行境界ボックスを指定する Object を取得します。
			//Object: {x:1,y:1,w:10,h:20}
			bounds : {
				getter : function(){
				}
			}
		}	
	});
	
	
	return Geometry;
	
});	
