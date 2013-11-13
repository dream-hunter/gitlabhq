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
	"qface/windows/control/ItemsControl"
],function(declare,ItemsControl) {
	
	var HeaderedItemsControl  = declare(ItemsControl,{
		//<<summary
		//複数の項目で構成され、ヘッダーを持つコントロールを表します。
		//summary>>
		"-privates-" : {
		},
		
		"-attributes-" : {
			"hasHeader"	: {
				//<<summary
				//この HeaderedItemsControl にヘッダーがあるかどうかを示す値を取得します。
				//summary>>
				type : Boolean
			},
			"header" : {
				//<<summary
				//コントロールにラベルを付ける項目を取得または設定します。
				//summary>>
				type : Object
			},
			
			headerTemplate : {
			}
			
		},
		
		"-methods-" : {
			
		},
		
		constructor	: function() {
		}
	});
	
	
	return HeaderedItemsControl;
	
});	
