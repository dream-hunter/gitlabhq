/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"qface/lang/declare"
	"qface/lang/Object"
],function(declare,Object) {

	var URL = declare(null,{
		
		constructor	: function(url) {
	        var a = document.createElement('a');
	        a.href = url;
	        var m = purl.exec(a.href);

	        if (m == null) {
	            m = purl.exec(window.location);
	            if (m == null) throw Error("Cannot resolve '" + url + "' url");
	            var p = m[3];
	            a.href = m[1] + "//" + m[2] +  p.substring(0, p.lastIndexOf("/") + 1) + url;
	            m = purl.exec(a.href);
	        }

	        this.path     = m[3];
	        this.href     = a.href;
	        this.protocol = m[1];
	        this.host     = m[2];
	        this.path     = this.path.replace(/[\/]+/g, "/");
	        this.qs       = m[4];		
        },

		join : function(p) {
	        if (URL.isAbsolute(p)) throw new Error();
	        return p[0] == '/' ? [ this.protocol, "//", this.host, p ].join('')
                           : [ this.protocol, "//", this.host, this.path, p ].join('');
    	},
		getParentURL : function() {
	        var i = this.path.lastIndexOf("/");
	        if (i <= 0) throw new Error(this.toString() + " has no parent");
	        var p = this.path.substring(0, i+1);
	        return new pkg.URL([this.protocol, "//", this.host, p].join(''));
    	},

		toString : function() { 
			return this.href; 
		}	
	});
	
	Object.mixin(URL,{
		isAbsolute : function(u) { 
			return /^[a-zA-Z]+\:\/\//i.test(u);  
		}

	});
	
	return URL;
	
});	