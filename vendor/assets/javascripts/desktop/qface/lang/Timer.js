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
	"dojo/number"
],function(declare,lang,number) {
    var quantum = 40;

    this.runners =  Array(5);
    this.count   =  0;
    this.pid     = -1;
    for(var i = 0; i < this.runners.length; i++) this.runners[i] = { run:null };


	var Timer  = {
	    get : function(r) {
	        if (this.count > 0) {
	            for(var i=0; i < this.runners.length; i++) {
	                var c = this.runners[i];
	                if (c.run != null && c.run == r) return c;
	            }
	        }
	        return null;
	    },

	    start : function(r, startIn, repeatIn){
	        if (arguments.length < 3) repeatIn = 150;
	        if (arguments.length < 2) startIn  = 150;

	        var ps = this.runners.length;
	        if (this.count == ps) throw new Error("Out of runners limit");

	        var ci = this.get(r);
	        if (ci == null) {
	            var runners = this.runners, $this = this;
	            for(var i=0; i < ps; i++) {
	                var j = (i + this.count) % ps, c = runners[j];
	                if (c.run == null) {
	                    c.run = r;                      
	                    c.si  = startIn;
	                    c.ri  = repeatIn;
	                    break;
	                }
	            }
	            this.count++;

	            if (this.count == 1) {
	                this.pid = window.setInterval(function() {
	                    for(var i = 0; i < ps; i++) {
	                        var c = runners[i];
	                        if (c.run != null) {
	                            if (c.si <= 0) {
	                                try      { c.run.run(); }
	                                catch(e) { zebra.print(e); }
	                                c.si += c.ri;
	                            }
	                            else c.si -= quantum;
	                        }
	                    }
	                    if ($this.count === 0) { 
	                        window.clearInterval($this.pid);
	                        $this.pid = -1;
	                    }
	                }, quantum);
	            }
	        }
	        else {
	            ci.si = startIn;
	            ci.ri = repeatIn;
	        }

	        return r;
	    },

	    stop : function(l) {
	        this.get(l).run = null;
	        this.count--;
	        if (this.count == 0 && this.pid >= 0) {
	            window.clearInterval(this.pid);
	            this.pid = -1;
	        }
	    },

	   clear : function(l){
	        var c = this.get(l);
	        c.si = c.ri;
	    }
	
	};

	return Number;
	
});	