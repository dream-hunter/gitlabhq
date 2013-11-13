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
	"qface/lang/Object",
	"qface/lang/Array",
	"qface/data/collections/Collection",
	"qface/data/collections/Item"
],function(declare,Object,Array,Collection,Item){

	var TreeItem = Tree.TreeItem = declare(Item,{
		"-attributies-" :  {
			"id" : {
			},
			"label" : {
			},
			"data" : {
			},
			"items" : {
				type : ArrayList,
				readOnly : true
			},
			"parent" : {
				type : TreeItem,
				getter : function() {
				},
				
				setter : function(p) {
					p.items.add(this);
				}
			
			}
		},
		
		constructor : function() {
			this._items = new ArrayList();
			
		},
		
		destroy : function() {
			this._items.destory();
			this._items = null;
		}	
		
	});
	
	var Tree = declare(Collection,{
		"--privates--" :{
		},
		
		"-attributies-" :  {
			"items" : {
				type : ArrayList,
				readOnly : true
			}
		},
		"-methods-" :  {
			//Treeに格納されている要素数を取得します。
			count : function () {
				var c = 0;
				this.forEach(function(item){
					c+=1;
				});	
	        	return c;
	        },
	        
			//Treeの要素すべてをArrayにコピーします。
	        toArray : function() {
				var a = [];
				this.forEach(function(item){
					a.push(item);
				});	
	        	return a;
	        },
			//Treeの要素すべてに対してfを呼び出します。
	        forEach : function(f){
				var f2 = function(item) {
					f(item);
					if (item.forEach) {
						item.forEach(f2);
					}
				};
	        	this._items.forEach(f2);
	        }
		},		
		constructor	: function() {
			this._items = new ArrayList();
		},

		destory : function() {
			this._items.destory();
			this._items = null;
		}
		
	});
	
	Object.mixin(Tree,{
        create : function(r, p) {
            var item = new TreeItem(r.value);
            item.parent = p;
            if (r.kids) {
                for(var i = 0; i < r.kids.length; i++) {
                    item.kids[i] = pkg.TreeModel.create(r.kids[i], item);
                }
            }
            return item;
        },
	});
	
	return Tree;
	
});	