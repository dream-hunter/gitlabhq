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
	"qface/lang/Array",
	"qface/data/collections/Collection"
],function(declare,Array,Collection) {

	var Martix = declare(Collection,{
		
		constructor	: function(rows,cols) {
	        this.rows = this.cols = 0;
	        this.objs = [];
	        this._ = new MatrixListeners();
	        this.setRowsCols(rows, cols);
		},

        get : function (row,col){
            return this.objs[row][col];
        },

        put : function(row,col,obj){
            if (arguments.length != 3) throw new Error();
            var nr = this.rows, nc = this.cols;
            if(row >= nr) nr += (row - nr + 1);
            if(col >= nc) nc += (col - nc + 1);
            this.setRowsCols(nr, nc);
            var old = this.objs[row] ? this.objs[row][col] : undefined;
            if (obj != old) {
                this.objs[row][col] = obj;
                this._.cellModified(this, row, col, old);
            }
        },

        puti : function(i, data){
            var p = zebra.util.index2point(i, this.cols);
            this.put(p[0], p[1], data);
        },

        setRowsCols : function(rows, cols){
            if(rows != this.rows || cols != this.cols){
                var pc = this.cols, pr = this.rows;
                this.rellocate(rows, cols);
                this.cols = cols;
                this.rows = rows;
                this._.matrixResized(this, pr, pc);
            }
        },

        rellocate : function(r, c) {
            if (r >= this.rows) {
                for(var i=this.rows; i < r; i++)  this.objs[i] = [];
            }
        },
	        
	    setRows : function (rows) { 
	    	this.setRowsCols(rows, this.cols);
	    },
	    
	    setCols : function (cols) { 
	    	this.setRowsCols(this.rows, cols); 
	    },

	    removeRows : function (begrow,count){
	        if (begrow < 0 || begrow + count > this.rows) throw new Error();
	        for(var i = (begrow + count);i < this.rows; i++, begrow++){
	            for(var j = 0;j < this.cols; j ++ ){
	                this.objs[begrow][j] = this.objs[i][j];
	                this.objs[i][j] = null;
	            }
	        }
	        this.rows -= count;
	        this._.matrixResized(this, this.rows + count, this.cols);
	    },

	    removeCols : function (begcol,count){
	        if (begcol < 0 || begcol + count > this.cols) throw new Error();
	        for(var i = (begcol + count);i < this.cols; i++, begcol++){
	            for(var j = 0;j < this.rows; j++){
	                this.objs[j][begcol] = this.objs[j][i];
	                this.objs[j][i] = null;
	            }
	        }
	        this.cols -= count;
	        this._.matrixResized(this, this.rows, this.cols + count);
	    }
        
	});
	
	
	return Martix;
	
});	