/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array"
],function(declare,lang,array) {

	var DLNode = declare(null,{  
	    constructor : function(element, next, previous){  
	         this.element = element;  
	         this.next = next;  
	         this.previous = previous;  
	    }  
	});  
	
	var IndexOutOfBoundsException = declare(null,{  
	    constructor : function(s){  
	        this.message = s;  
	    },  
	    getMessage : function(){  
	        return this.message;  
	    }  
	});  
	  
	var NoSuchElementException = declare(null,{  
	    constructor : function(s){  
	        this.message = s;  
	    },  
	    getMessage : function(){  
	        return this.message;  
	    }  
	});  
  	

	var LinkedList  = declare(null,
	    constructor : function(){  
	        this.size = 0;  
	        this.header = new DLNode(null, null, null);  
	        this.header.next = this.header.previous = this.header;  
	    }, 
	    getSize : function(){  
	        return this.size;  
	    },  
	    add : function(e){  
	        this.addBefore(e, this.header);  
	        return true;  
	    },  
	    addFirst : function(e){  
	        this.addBefore(e, this.header.next);  
	    },  
	    addLast : function(e){  
	        this.addBefore(e, this.header);  
	    },  
	    addBefore:function(e, entry){  
	        var newEntry = new org.forever.util.DLNode(e, entry, entry.previous);  
	        newEntry.previous.next = newEntry;  
	        newEntry.next.previous = newEntry;  
	        this.size++;  
	        return newEntry;  
	    },  
	    get : function(index){  
	        return this.entry(index).element;  
	    },  
	    indexOf : function(o){  
	        var index = 0;  
	        if (o==null) {  
	            for (var e = this.header.next; e != this.header; e = e.next) {  
	                if (e.element==null)  
	                    return index;  
	                index++;  
	            }  
	        } else {  
	            for (var e = this.header.next; e != this.header; e = e.next) {  
	                if (o == e.element)  
	                    return index;  
	                index++;  
	            }  
	        }  
	        return -1;  
	    },  
	    removeFirst : function(){  
	        return this.remove(this.header.next);  
	    },  
	    removeLast : function(){  
	        return remove(header.previous);  
	    },  
	    removeAt : function(index){  
	        return this.remove(this.entry(index));  
	    },  
	    remove : function(e){  
	        if (e == this.header)  
	        throw new org.forever.util.NoSuchElementException('–v—LŒ³‘f');  
	        var result = e.element;  
	        e.previous.next = e.next;  
	        e.next.previous = e.previous;  
	        e.next = e.previous = null;  
	        e.element = null;  
	        this.size--;  
	        return result;  
	    },  
	    lastIndexOf : function(o){  
	        var index = size;  
	        if (o==null) {  
	            for (var e = this.header.previous; e != this.header; e = e.previous) {  
	                index--;  
	                if (e.element==null)  
	                    return index;  
	            }  
	        } else {  
	            for (var e = this.header.previous; e != this.header; e = e.previous) {  
	                index--;  
	                if (o == e.element)  
	                    return index;  
	            }  
	        }  
	        return -1;  
	    }, 
	    contains : function(o){  
	        return this.indexOf(o) != -1;  
	    },  
	    clear : function(){  
	        var e = this.header.next;  
	        while (e != this.header) {  
	            var next = e.next;  
	            e.next = e.previous = null;  
	            e.element = null;  
	            e = next;  
	        }  
	        this.header.next = this.header.previous = this.header;  
	        size = 0;  
	    },  
	    insert : function(index,element){  
	        this.addBefore(element, (index==this.size ? this.header : this.entry(index)));  
	    },  
	    entry : function(index){  
	        if (index < 0 || index >= this.size)  
	            throw new org.forever.util.IndexOutOfBoundsException("Index: "+index+  
	                                                ", Size: "+size);  
	        var e = this.header;  
	        if (index < (this.size >> 1)) {  
	            for (var i = 0; i <= index; i++)  
	                e = e.next;  
	        } else {  
	            for (var i = this.size; i > index; i--)  
	                e = e.previous;  
	        }  
	        return e;  
	    },  
	    toArray : function(){  
	        var result =[this.size];  
	        var i = 0;  
	        for (var e = this.header.next; e != this.header; e = e.next)  
	            result[i++] = e.element;  
	        return result;  
	    },  
	    set : function(index,e){  
	        var e = this.entry(index);  
	        var oldVal = e.element;  
	        e.element = element;  
	        return oldVal;  
	    }  
    });
	
	
	return LinkedList;
	
});	