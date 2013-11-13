/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
	"require",
	"dojo/_base/declare", // lang.trim
	"dojo/_base/lang", // lang.trim
	"dojo/Deferred",
	"qface/lang/Enum",
	"qface/system/desktop/_Desktop"
],function(require,declare,lang,Deferred,Enum,_Desktop) {
	var desktop;

	require.on("error", function(error){
	  console.log(error.src, error.id);
	});
	
	var Runtime = declare(null,{

	});
			
	Runtime.TermMode = _Desktop.TermMode;


	var timer = new (function() {
	    var quantum = 40;

	    this.runners =  Array(5);
	    this.count   =  0;
	    this.pid     = -1;
	    for(var i = 0; i < this.runners.length; i++) this.runners[i] = { run:null };

	    this.get = function(r) {
	        if (this.count > 0) {
	            for(var i=0; i < this.runners.length; i++) {
	                var c = this.runners[i];
	                if (c.run != null && c.run == r) return c;
	            }
	        }
	        return null;
	    };

	    this.start = function(r, startIn, repeatIn){
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
	    };

	    this.stop = function(l) {
	        this.get(l).run = null;
	        this.count--;
	        if (this.count == 0 && this.pid >= 0) {
	            window.clearInterval(this.pid);
	            this.pid = -1;
	        }
	    };

	    this.clear = function(l){
	        var c = this.get(l);
	        c.si = c.ri;
	    };
	})();

 	lang.mixin(Runtime, { 		
 		run : function(Desktop,config,callback) {
 			desktop = new Desktop();
 			
 			desktop.init(config).then(
 				function() {
 					desktop.start();
 					if (callback) {
 						callback();
 					}	
 				}
 			);		
 			
 		},
 	
		log : function(/*String*/str){
			//	summary:
			//		logs a string onto any console that is open
			//	
			//	str:
			//		the string to log onto the consoles
			desktop.log(str);
		},
		
		getTermMode : function() {
			return desktop.getTermMode();
		},
		
		changeTermMode : function(termMode) {
			desktop.changeTermMode(termMode);
		},
		
		addDojoCss : function(/*String*/path){
		 	desktop.addDojoCss(path);
		},
    
		addDojoJs : function(/*String*/path){
	     	desktop.addDojoCss(path);
	    },

		getTheme : function(scene) {
			return desktop.getTheme(scene);
		},
		
		changeTheme: function(scene,/*String*/theme)	{
			desktop.changeTheme(scene,theme);
		},
		
		
		enableTheme: function(/*String*/theme)	{
			return desktop.enableTheme(theme);
		},

		disableTheme: function(/*String*/theme)	{
			desktop.disableTheme(theme);
		},

		listThemes : function() {
			return desktop.listThemes();
		}
			
	});
	
	
	return Runtime;
});	
