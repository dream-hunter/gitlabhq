define([
	"qface/lang/declare",
	"dojo/_base/lang",
	"qface/lang/Array",
	"qface/data/collections/Collection"
], function(delclare, Array,Collection){

	var ArrayList =  declare(Collection,{ 
		
		constructor : function(/*Anything[]*/ a){
			this.__a = Array.toArray(a);
		},


        get : function(i) {
            if (i < 0 || i >= this.__a.length) throw new Error("" + i);
            return this.__a[i];
        },

        add : function(item) {
            this.__a.push(item);
            this.onNew();
        };

        removeAll : function() {
            var length = this.__a.length;
            for(var i = length - 1; i >= 0; i--) {
            	this.removeAt(i);
            }	
        },

        removeAt : function(i) {
            var re = this.__a[i];
            this.__a.splice(i, 1);
            this.onDelete();
        };

        remove : function(item) {
            for(var i = 0;i < this.__a.length; i++ ) {
            	if (this.__a[i] === item) {
            		this.removeAt(i);
            	}
            }		
        },

        insert : function(item,i){
            if(i < 0 || i >= this.__a.length) {
            	throw new Error();
            }	
            this.__a.splice(i, 0, item);
            this._.elementInserted(this, item, i);
        },

        count : function () { 
        	return this.__a.length; 
        },

        set : function (item,i){
            if(i < 0 || i >= this.__a.length) throw new Error("" + i);
            var pe = this.__a[i];
            this.__a[i] = item;
            this._.onSet(this, o, pe, i);
        },

        contains : function (item){ 
        	return this.indexOf(item) >= 0; 
        },
        indexOf : function(item){ 
        	return this.__a.indexOf(item); 
        }
	});

	return ArrayList;
});
