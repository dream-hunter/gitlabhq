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
	"qface/lang/Array"
],function(declare,Array) {

	var Container = declare(null,{
		"-privates-" : {
			_children   : null
		},
		
		"-attributes-" : {
			"children" : {
				type		:	Array,
				readOnly	:	true,
				getter		:	function(){
					return Array.toArray(this._children);
				}
			},
			"layout" : {
				setter	: function(m) {
					if (m == null) throw new Error("Null layout");

					if(this.layout != m){
						var pl = this.layout;
						this.layout = m;
						this.invalidate();
					}
				},
			},
			
			clientLeft : {
				type 		:	Number,
				default		:	0,
				readOnly	:	true
			},
			clientTop : {
				type 		:	Number,
				default		:	0,
				readOnly	:	true
			},
			clientRight : {
				type 		:	Number,
				default		:	0,
				readOnly	:	true
			},
			clientBottom : {
				type 		:	Number,
				default		:	0,
				readOnly	:	true
			}
		},
		
		"-events-"	:	{
			"childAdded"	:	{
				type	:	ChildAddedEvent
			},
			"childRemoved"	:	{
				type	:	ChildRemovedEvent
			}
		},
		
		"-methods-" : {
			/**
			 * Adds a child to the top of the display list. You can also add multiple children, such as "addChild(child1, child2, ...);".
			 * Returns the child that was added, or the last child if multiple children were added.
			 *
			 * <h4>Example</h4>
			 *      container.addChild(bitmapInstance, shapeInstance);
			 *
			 * @method addChild
			 * @param {Contained} child The contained object to add.
			 * @return {Contained} The child that was added, or the last child if multiple children were added.
			 **/
			addChild : function(child) {
				if (child == null) { return child; }
				var l = arguments.length;
				if (l > 1) {
					for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
					return arguments[l-1];
				}
				if (child.parent) { child.parent.removeChild(child); }
				child.parent = this;
				this._children.push(child);
				return child;
			},

			/**
			 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and setting
			 * its parent to this Container. You can also add multiple children, such as "addChildAt(child1, child2, ..., index);". The
			 * index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use:
			 * container.addChildAt(myShape, container.getChildIndex(otherShape)). This would also bump otherShape's index up by one.
			 * Returns the last child that was added, or the last child if multiple children were added. Fails silently if the index 
			 * is out of range.
			 * @method addChildAt
			 * @param {DisplayObject} child The display object to add.
			 * @param {Number} index The index to add the child at.
			 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
			 **/
			addChildAt : function(child, index) {
				var l = arguments.length;
				var indx = arguments[l-1]; // can't use the same name as the index param or it replaces arguments[1]
				if (indx < 0 || indx > this.children.length) { return arguments[l-2]; }
				if (l > 2) {
					for (var i=0; i<l-1; i++) { this.addChildAt(arguments[i], indx+i); }
					return arguments[l-2];
				}
				if (child.parent) { child.parent.removeChild(child); }
				child.parent = this;
				this.children.splice(index, 0, child);
				return child;
			},

			/**
			 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is already
			 * known. You can also remove multiple children, such as "removeChild(child1, child2, ...);". Returns true if the child
			 * (or children) was removed, or false if it was not in the display list.
			 * @method removeChild
			 * @param {DisplayObject} child The child to remove.
			 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
			 **/
			removeChild : function(child) {
				var l = arguments.length;
				if (l > 1) {
					var good = true;
					for (var i=0; i<l; i++) { good = good && this.removeChild(arguments[i]); }
					return good;
				}
				return this.removeChildAt(this.children.indexOf(child));
			},

			/**
			 * Removes the child at the specified index from the display list, and sets its parent to null. You can also remove multiple
			 * children, such as "removeChildAt(2, 7, ...);". Returns true if the child (or children) was removed, or false if any index
			 * was out of range.
			 * @param {Number} index The index of the child to remove.
			 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
			 **/
			removeChildAt : function(index) {
				var l = arguments.length;
				if (l > 1) {
					var a = [];
					for (var i=0; i<l; i++) { a[i] = arguments[i]; }
					a.sort(function(a, b) { return b-a; });
					var good = true;
					for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
					return good;
				}
				if (index < 0 || index > this.children.length-1) { return false; }
				var child = this.children[index];
				if (child) { child.parent = null; }
				this.children.splice(index, 1);
				return true;
			},

			/**
			 * Removes all children from the display list.
			 * @method removeAllChildren
			 **/
			removeAllChildren : function() {
				var kids = this.children;
				while (kids.length) { kids.pop().parent = null; }
			},

			/**
			 * Returns the child at the specified index.
			 * @method getChildAt
			 * @param {Number} index The index of the child to return.
			 * @return {DisplayObject} The child at the specified index.
			 **/
			getChildAt : function(index) {
				return this.children[index];
			},
			
			/**
			 * Returns the child with the specified name.
			 * @method getChildByName
			 * @param {String} name The name of the child to return.
			 * @return {DisplayObject} The child with the specified name.
			 **/
			getChildByName : function(name) {
				var kids = this.children;
				for (var i=0,l=kids.length;i<l;i++) {
					if(kids[i].name == name) { return kids[i]; }
				}
				return null;
			},

			/**
			 * Performs an array sort operation on the child list.
			 * @method sortChildren
			 * @param {Function} sortFunction the function to use to sort the child list. See javascript's Array.sort documentation
			 * for details.
			 **/
			sortChildren : function(sortFunction) {
				this.children.sort(sortFunction);
			},

			/**
			 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
			 * @method getChildIndex
			 * @param {DisplayObject} child The child to return the index of.
			 * @return {Number} The index of the specified child. -1 if the child is not found.
			 **/
			getChildIndex : function(child) {
				return this.children.indexOf(child);
			},

			/**
			 * Returns the number of children in the display list.
			 * @method getNumChildren
			 * @return {Number} The number of children in the display list.
			 **/
			getNumChildren : function() {
				return this.children.length;
			},
			
			/**
			 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
			 * @param {Number} index1
			 * @param {Number} index2
			 * @method swapChildrenAt
			 **/
			swapChildrenAt : function(index1, index2) {
				var kids = this.children;
				var o1 = kids[index1];
				var o2 = kids[index2];
				if (!o1 || !o2) { return; }
				kids[index1] = o2;
				kids[index2] = o1;
			},
			
			/**
			 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this Container.
			 * @param {DisplayObject} child1
			 * @param {DisplayObject} child2
			 * @method swapChildren
			 **/
			swapChildren : function(child1, child2) {
				var kids = this.children;
				var index1,index2;
				for (var i=0,l=kids.length;i<l;i++) {
					if (kids[i] == child1) { index1 = i; }
					if (kids[i] == child2) { index2 = i; }
					if (index1 != null && index2 != null) { break; }
				}
				if (i==l) { return; } // TODO: throw error?
				kids[index1] = child2;
				kids[index2] = child1;
			},
			
			/**
			 * Returns true if the specified display object either is this container or is a descendent.
			 * (child, grandchild, etc) of this container.
			 * @method contains
			 * @param {DisplayObject} child The DisplayObject to be checked.
			 * @return {Boolean} true if the specified display object either is this container or is a descendent.
			 **/
			contains : function(child) {
				while (child) {
					if (child == this) { return true; }
					child = child.parent;
				}
				return false;
			},

			indexOfChild: function(/*Contained*/ child){
				// summary:
				//		Gets the index of the child in this container or -1 if not found
				return Array.indexOf(this._children, child);	// int
			}
			
		}
		
		constructor	: function(x,y) {	        
			this._children = new Array();
	        
		},
		
		destroy : {
			this._children = null;
		},
		
		find	: function(path) {
            var res = null;
            zebra.util.findInTree(this, path,
                                function(node, name) { return node.getClazz().$name == name; },
                                function(kid) {
                                   res = kid;
                                   return true;
                                });
            return res;
		},

		findAll	: function(path, callback) {
            var res = [];
            if (callback == null) {
                callback =  function(kid) {
                    res.push(kid);
                    return false;
                };
            }
            zebra.util.findInTree(this, path,
                                  function(node, name) { return node.getClazz().$name == name; },
                                  callback);
            return res;
		},
		
		validateMetric	: function() {
            if (this.isValid === false){
                if (this.recalc) this.recalc();
                this.isValid = true;
            }
		},
		invalidateLayout	: function() {
            this.isLayoutValid = false;
            if (this.parent != null) this.parent.invalidateLayout();
		},
		invalidate	: function() {
            this.isValid = this.isLayoutValid = false;
            this.cachedWidth =  -1;
            if (this.parent != null) this.parent.invalidate();
		},
		validate	: function() {
            this.validateMetric();
            if (this.width > 0 && this.height > 0 && this.isLayoutValid === false && this.isVisible) {
                this.layout.doLayout(this);
                Array.forEach(this.children,function(child){
                	child.validate();
                });	
                this.isLayoutValid = true;
                if (this.laidout) this.laidout();
            }
		},
		calcPreferredSize	: function(target) {
			return { width:10, height:10 };
		},
		doLayout	: function() {
		},
		insert	: function(i,constr,d) {
            d.setParent(this);
            if (d.constraints) constr = d.constraints;
            else               d.constraints = constr;

            if (i == this.kids.length) this.kids.push(d);
            else this.kids.splice(i, 0, d);

            if (this.kidAdded) this.kidAdded(i, constr, d);
            this.invalidate();
            return d;
		},
		setBounds	: function(x, y, w, h) {
            this.setLocation(x, y);
            this.setSize(w, h);
		},
		setSize	: function( w, h) {
            if (w != this.width || h != this.height){
                var pw = this.width, ph = this.height;
                this.width = w;
                this.height = h;
                this.isLayoutValid = false;
                if (this.resized) this.resized(pw, ph);
            }
		},
		getByConstraints	: function(c) {
            if(this.kids.length > 0){
                for(var i = 0;i < this.kids.length; i++ ){
                    var l = this.kids[i];
                    if (c == l.constraints) return l;
                }
            }
            return null;
		},
		setPreferredSize	: function(w,h) {
            if (w != this.psWidth || h != this.psHeight){
                this.psWidth  = w;
                this.psHeight = h;
                this.invalidate();
            }
		},
		set	: function(constr, d) {
            var pd = this.getByConstraints(constr);
            if (pd != null) this.remove(pd);
            if (d  != null) this.add(constr, d);
		},


		_getSiblingOfChild: function(/*dijit/_WidgetBase*/ child, /*int*/ dir){
			// summary:
			//		Get the next or previous widget sibling of child
			// dir:
			//		if 1, get the next sibling
			//		if -1, get the previous sibling
			// tags:
			//		private
			var children = this.getChildren(),
				idx = array.indexOf(this.getChildren(), child);	// int
			return children[idx + dir];
		},


	});
	
	
	return Container;
	
});	
