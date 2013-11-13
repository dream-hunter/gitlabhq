/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define( [
	"qface/lang/declare",
	"qface/lang/Object""
], function(declare,Object){
	// reference easeljs/geom/Matrix2D  and dojox/gfx/matrix
	
	var DEG_TO_RAD = Math.PI/180;
	var _degToRadCache = {};
	var degToRad = function(degree){
		return _degToRadCache[degree] || (_degToRadCache[degree] = (Math.PI * degree / 180));
	};
	var radToDeg = function(radian){ return radian / Math.PI * 180; };
	

	//2-D 空間での変換に使用される 3 x 3 アフィン変換行列を表します。
	//|----------|
	//|m11|m21|dx| 
	//|----------|
	//|m12|m22|dy|
	//|----------|
	//|  0|  0| 1|
	//|----------|
	
	var Matrix = declare(null,{
		"--private--" : {
			/**
			 * Initialization method.
			 * @method initialize
			 * @protected
			 * @return {Matrix2D} This matrix. Useful for chaining method calls.
			*/
			_initialize : function(m11, m12, m21, m22, dx, dy) {
				this._m11 = m11;
				this._m12 = m12;
				this._m21 = m21;
				this._m22 = m22;
				this._dx = dx;
				this._dy = dy;
				return this;
			},
			_multiplyPoint: function(p){
				// summary:
				//		applies the matrix to a point
				// p: Point
				//		a point
				// returns: Point
				var x = p.x * this.m11 + p.y * this.m21  + this.dx,
				    y = p.x * this.m12 +  p.y * this.m22 + this.dy;
				return new Point(x,y); // Point
			}
	
		},
		"--attributes--" : {
		// public attributes:

			//この Matrix の第 1 列、第 1 行にある値
			/**
			 * Position (0, 0) in a 3x3 affine transformation matrix.
			 * @property m11
			 * @type Number
			 **/
			"m11" : {
				type : Number,
				default : 1
			},
			//この Matrix の第 1 列、第 2 行にある値
			/**
			 * Position (0, 1) in a 3x3 affine transformation matrix.
			 * @property m12
			 * @type Number
			 **/
			"m12" : {
				type : Number,
				default : 0
			},
			//この Matrix の第 2 列、第 1 行にある値
			/**
			 * Position (1, 0) in a 3x3 affine transformation matrix.
			 * @property m21
			 * @type Number
			 **/
			"m21" : {
				type : Number,
				default : 0
			},
			//この Matrix の第 2 列、第 2 行にある値
			/**
			 * Position (1, 1) in a 3x3 affine transformation matrix.
			 * @property m22
			 * @type Number
			 **/
			"m22" : {
				type : Number,
				default : 1
			},
			//この Matrix の第 3 列、第 1 行にある値
			/**
			 * Position (2, 0) in a 3x3 affine transformation matrix.
			 * @property atx
			 * @type Number
			 **/
			"dx" : {
				type : Number,
				default : 0
			},
			//この Matrix の第 3 列、第 2 行にある値
			/**
			 * Position (2, 1) in a 3x3 affine transformation matrix.
			 * @property dy
			 * @type Number
			 **/
			"dy" : {
				type : Number,
				default : 0
			},

			/**
			 * Property representing the alpha that will be applied to a display object. This is not part of matrix
			 * operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
			 * @property alpha
			 * @type Number
			 **/
			alpha : 1,

			/**
			 * Property representing the shadow that will be applied to a display object. This is not part of matrix
			 * operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values.
			 * @property shadow
			 * @type Shadow
			 **/
			shadow  : null,

			/**
			 * Property representing the compositeOperation that will be applied to a display object. This is not part of
			 * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
			 * compositeOperation values. You can find a list of valid composite operations at:
			 * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
			 * @property compositeOperation
			 * @type String
			 **/
			compositeOperation : null
			
		},
		
		"--methods--" : {
		// public methods:
			/**
			 * 指定した点を Matrix で変換し、その結果を返します。
			 */
			multiplyPoint: /*Point*/function(/*Point */ p){
				// summary:
				//		applies the matrix to a point
				return this._multiplyPoint(p); // Point
			},
			/**
			 * 指定した矩形を Matrix で変換し、その結果を返します。
			 */
			multiplyRectangle: /*Rect*/function(/*Rect*/ rect){
				// summary:
				//		Applies the matrix to a rectangle.
				// returns: Rect
				if(this.isIdentity())
					return rect.clone(); // Rect
				var p0 = this.multiplyPoint(rect.leftTop),
					p1 = this.multiplyPoint(rect.leftBottom),
					p2 = this.multiplyPoint(rect.right),
					p3 = this.multiplyPoint(rect.rightBottom),
					minx = Math.min(p0.x, p1.x, p2.x, p3.x),
					miny = Math.min(p0.y, p1.y, p2.y, p3.y),
					maxx = Math.max(p0.x, p1.x, p2.x, p3.x),
					maxy = Math.max(p0.y, p1.y, p2.y, p3.y);
				return new Rect(minx,miny,maxx-minx,maxy-miny);  // Rect
			},
			/**
			 * Concatenates the specified matrix properties with this matrix. All parameters are required.
			 * 指定した Matrixをこの Matrixの前に付加します。
			 * @method prepend
			 * @param {Number} m11
			 * @param {Number} m12
			 * @param {Number} m21
			 * @param {Number} m22
			 * @param {Number} dx
			 * @param {Number} dy
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			prepend : function(m11, m12, m21, m22, dx, dy) {
				var tx1 = this.dx;
				if (m11 != 1 || m12 != 0 || m21 != 0 || m22 != 1) {
					var a1 = this.m11;
					var c1 = this.m21;
					this.m11  = a1*m11+this.m12*m21;
					this.m12  = a1*m12+this.m12*m22;
					this.m21  = c1*m11+this.m22*m21;
					this.m22  = c1*m12+this.m22*m22;
				}
				this.dx = tx1*m11+this.dy*m21+dx;
				this.dy = tx1*m12+this.dy*m22+dy;
				return this;
			},

			/**
			 * Appends the specified matrix properties with this matrix. All parameters are required.
			 * 指定した Matrixをこの Matrixに追加します。
			 * @method append
			 * @param {Number} m11
			 * @param {Number} m12
			 * @param {Number} m21
			 * @param {Number} m22
			 * @param {Number} dx
			 * @param {Number} dy
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			append : function(m11, m12, m21, m22, dx, dy) {
				var a1 = this.m11;
				var b1 = this.m12;
				var c1 = this.m21;
				var d1 = this.m22;

				this.m11  = m11*a1+m12*c1;
				this.m12  = m11*b1+m12*d1;
				this.m21  = m21*a1+m22*c1;
				this.m22  = m21*b1+m22*d1;
				this.dx = dx*a1+dy*c1+this.dx;
				this.dy = dx*b1+dy*d1+this.dy;
				return this;
			},

			/**
			 * Prepends the specified matrix with this matrix.
			 * @method prependMatrix
			 * @param {Matrix} matrix
			 **/
			prependMatrix : function(matrix) {
				this.prepend(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
				this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
				return this;
			},

			/**
			 * Appends the specified matrix with this matrix.
			 * 指定した Matrixをこの Matrixに追加します。
			 * @method appendMatrix
			 * @param {Matrix} matrix
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			appendMatrix : function(matrix) {
				this.append(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
				this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
				return this;
			},

			/**
			 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
			 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
			 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
			 * @method prependTransform
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Number} scaleX
			 * @param {Number} scaleY
			 * @param {Number} rotation
			 * @param {Number} skewX
			 * @param {Number} skewY
			 * @param {Number} regX Optional.
			 * @param {Number} regY Optional.
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			prependTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
				if (rotation%360) {
					var r = rotation*DEG_TO_RAD;
					var cos = Math.cos(r);
					var sin = Math.sin(r);
				} else {
					cos = 1;
					sin = 0;
				}

				if (regX || regY) {
					// append the registration offset:
					this.dx -= regX; this.dy -= regY;
				}
				if (skewX || skewY) {
					// TODO: can this be combined into a single prepend operation?
					skewX *= DEG_TO_RAD;
					skewY *= DEG_TO_RAD;
					this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
					this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
				} else {
					this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
				}
				return this;
			},

			/**
			 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
			 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
			 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
			 * @method appendTransform
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Number} scaleX
			 * @param {Number} scaleY
			 * @param {Number} rotation
			 * @param {Number} skewX
			 * @param {Number} skewY
			 * @param {Number} regX Optional.
			 * @param {Number} regY Optional.
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			appendTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
				if (rotation%360) {
					var r = rotation*DEG_TO_RAD;
					var cos = Math.cos(r);
					var sin = Math.sin(r);
				} else {
					cos = 1;
					sin = 0;
				}

				if (skewX || skewY) {
					// TODO: can this be combined into a single append?
					skewX *= DEG_TO_RAD;
					skewY *= DEG_TO_RAD;
					this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
					this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
				} else {
					this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
				}

				if (regX || regY) {
					// prepend the registration offset:
					this.dx -= regX*this.m11+regY*this.m21; 
					this.dy -= regX*this.m12+regY*this.m22;
				}
				return this;
			},

			/**
			 * Applies a rotation transformation to the matrix.
			 * この Matrix の原点を中心とする指定した角度の回転を適用します。
			 * @method rotate
			 * @param {Number} angle The angle in degrees.
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			rotate : function(angle) {
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);

				var a1 = this.m11;
				var c1 = this.m21;
				var tx1 = this.dx;

				this.m11 = a1*cos-this.m12*sin;
				this.m12 = a1*sin+this.m12*cos;
				this.m21 = c1*cos-this.m22*sin;
				this.m22 = c1*sin+this.m22*cos;
				this.dx = tx1*cos-this.dy*sin;
				this.dy = tx1*sin+this.dy*cos;
				return this;
			},

			/**
			 * Applies a skew transformation to the matrix.
			 * x 次元と y 次元の指定した角度の傾斜を、この Matrix に追加します。
			 * @method skew
			 * @param {Number} skewX The amount to skew horizontally in degrees.
			 * @param {Number} skewY The amount to skew vertically in degrees.
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			*/
			skew : function(skewX, skewY) {
				skewX = skewX*DEG_TO_RAD;
				skewY = skewY*DEG_TO_RAD;
				this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
				return this;
			},

			/**
			 * Applies a scale transformation to the matrix.
			 * 指定したスケールのベクターをこのMatrixに追加します。
			 * @method scale
			 * @param {Number} x
			 * @param {Number} y
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			scale : function(x, y) {
				this.m11 *= x;
				this.m22 *= y;
				this.dx *= x;
				this.dy *= y;
				return this;
			},

			/**
			 * Translates the matrix on the x and y axes.
			 * 指定したオフセットの変換をこのMatrix に追加します。
			 * @method translate
			 * @param {Number} x
			 * @param {Number} y
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			translate : function(x, y) {
				this.dx += x;
				this.dy += y;
				return this;
			},

			/**
			 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
			 * この Matrix 構造体を恒等行列に変更します。
			 * @method identity
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			identity : function() {
				this.alpha = this.m11 = this.m22 = 1;
				this.m12 = this.m21 = this.dx = this.dy = 0;
				this.shadow = this.compositeOperation = null;
				return this;
			},

			/**
			 * Inverts the matrix, causing it to perform the opposite transformation.
			 * この Matrixを反転します。
			 * @method invert
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			 **/
			invert : function() {
				var a1 = this.m11;
				var b1 = this.m12;
				var c1 = this.m21;
				var d1 = this.m22;
				var tx1 = this.dx;
				var n = a1*d1-b1*c1;

				this.m11 = d1/n;
				this.m12 = -b1/n;
				this.m21 = -c1/n;
				this.m22 = a1/n;
				this.dx = (c1*this.dy-d1*tx1)/n;
				this.dy = -(a1*this.dy-b1*tx1)/n;
				return this;
			},

			/**
			 * Returns true if the matrix is an identity matrix.
			 * @method isIdentity
			 * @return {Boolean}
			 **/
			isIdentity : function() {
				return this.dx == 0 && this.dy == 0 && this.m11 == 1 && this.m12 == 0 && this.m21 == 0 && this.m22 == 1;
			},

			/**
			 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
			 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
			 * results.
			 * @method decompose
			 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			*/
			decompose : function(target) {
				// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
				// even when scale is negative
				if (target == null) { target = {}; }
				target.x = this.dx;
				target.y = this.dy;
				target.scaleX = Math.sqrt(this.m11 * this.m11 + this.m12 * this.m12);
				target.scaleY = Math.sqrt(this.m21 * this.m21 + this.m22 * this.m22);

				var skewX = Math.atan2(-this.m21, this.m22);
				var skewY = Math.atan2(this.m12, this.m11);

				if (skewX == skewY) {
					target.rotation = skewY/DEG_TO_RAD;
					if (this.m11 < 0 && this.m22 >= 0) {
						target.rotation += (target.rotation <= 0) ? 180 : -180;
					}
					target.skewX = target.skewY = 0;
				} else {
					target.skewX = skewX/DEG_TO_RAD;
					target.skewY = skewY/DEG_TO_RAD;
				}
				return target;
			},

			/**
			 * Reinitializes all matrix properties to those specified.
			 * @method appendProperties
			 * @param {Number} m11
			 * @param {Number} m12
			 * @param {Number} m21
			 * @param {Number} m22
			 * @param {Number} dx
			 * @param {Number} dy
			 * @param {Number} alpha desired alpha value
			 * @param {Shadow} shadow desired shadow value
			 * @param {String} compositeOperation desired composite operation value
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			*/
			reinitialize : function(m11,m12,m21,m22,dx,dy,alpha,shadow,compositeOperation) {
				this._initialize(m11,m12,m21,m22,dx,dy);
				this.alpha = alpha || 1;
				this.shadow = shadow;
				this.compositeOperation = compositeOperation;
				return this;
			},

			/**
			 * Appends the specified visual properties to the current matrix.
			 * @method appendProperties
			 * @param {Number} alpha desired alpha value
			 * @param {Shadow} shadow desired shadow value
			 * @param {String} compositeOperation desired composite operation value
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			*/
			appendProperties : function(alpha, shadow, compositeOperation) {
				this.alpha *= alpha;
				this.shadow = shadow || this.shadow;
				this.compositeOperation = compositeOperation || this.compositeOperation;
				return this;
			},

			/**
			 * Prepends the specified visual properties to the current matrix.
			 * @method prependProperties
			 * @param {Number} alpha desired alpha value
			 * @param {Shadow} shadow desired shadow value
			 * @param {String} compositeOperation desired composite operation value
			 * @return {Matrix} This matrix. Useful for chaining method calls.
			*/
			prependProperties : function(alpha, shadow, compositeOperation) {
				this.alpha *= alpha;
				this.shadow = this.shadow || shadow;
				this.compositeOperation = this.compositeOperation || compositeOperation;
				return this;
			},
			/**
			 *Matrixに別の Matrix を乗算します。
			 */
			multiply: function(matrix){
				// summary:
				//		combines matrices by multiplying them sequentially in the given order
				// matrix: Matrix
				//		a 2D matrix-like object,
				//		all subsequent arguments are matrix-like objects too

				// combine matrices
				var m11 = this.m11,m12 = this.m12,m21 = this.m21,m22=this.m22,dx=this.dx,dy=this.dy;
				var r = matrix;
				this.m11 = m11 * r.m11 + m21 * r.m12;
				this.m12 = m12 * r.m11 + m22 * r.m12;
				this.m21 = m11 * r.m21 + m21 * r.m22;
				this.m22 = m12 * r.m21 + m22 * r.m22;
				this.dx =  m11 * r.dx + m21 * r.dy + dx;
				this.dy =  m12 * r.dx + m22 * r.dy + dy;
				return this // Matrix
			},

			/**
			 * Returns a clone of the Matrix instance.
			 * @method clone
			 * @return {Matrix} a clone of the Matrix instance.
			 **/
			clone : function() {
				var mtx = new Matrix(this.m11, this.m12, this.m21, this.m22, this.dx, this.dy);
				mtx.shadow = this.shadow;
				mtx.alpha = this.alpha;
				mtx.compositeOperation = this.compositeOperation;
				return mtx;
			},

			/**
			 * Returns a string representation of this object.
			 * @method toString
			 * @return {String} a string representation of the instance.
			 **/
			toString : function() {
				return "[Matrix (m11="+this.m11+" m12="+this.m12+" m21="+this.m21+" m22="+this.m22+" dx="+this.dx+" dy="+this.dy+")]";
			}
		},
		
		/**
		 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrixes.
		 * @class Matrix
		 * @constructor
		 **/
		constructor : function(m11, m12, m21, m22, dx, dy) {
			this._initialize(m11,m12,m21,m22,dx,dy);
		}
		
	});
	
	Object.mixin(Matrix,{
		translate: function(a, b){
			// summary:
			//		forms a translation matrix
			// description:
			//		The resulting matrix is used to translate (move) points by specified offsets.
			// a: Number
			//		an x coordinate value
			// b: Number
			//		a y coordinate value
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| a|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| b|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|

			return new Matrix(1,0,0,1,a,b); // Matrix
		},
		scale: function(a, b){
			// summary:
			//		forms a scaling matrix
			// description:
			//		The resulting matrix is used to scale (magnify) points by specified offsets.
			// a: Number
			//		a scaling factor used for the x coordinate
			// b: Number?
			//		a scaling factor used for the y coordinate
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  a|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   b| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			return new Matrix(a,0,0,b?b:a,0,0); // Matrix
		},
		rotate: function(angle){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |cos|-sin| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |sin| cos| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			return new Matrix(cos,sin,-sin,cos,0,0); // Matrix
		},
		rotateg: function(degree){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified degree.
			//		Seerotate() for comparison.
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// returns: Matrix
			return this.rotate(degToRad(degree)); // Matrix
		},
		skewX: function(angle) {
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1| tan| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);
			return new Matrix(1,0,tan,1); // Matrix
		},
		skewXg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox/gfx/matrix.skewX() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewX(degToRad(degree)); // dojox/gfx/matrix.Matrix
		},
		skewY: function(angle){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |tan|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);

			return new Matrix(1,tan,0,1); // Matrix
		},
		skewYg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See skewY() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewY(degToRad(degree)); // Matrix
		},
		reflect: function(a, b){
			// summary:
			//		forms a reflection matrix
			// description:
			//		The resulting matrix is used to reflect points around a vector,
			//		which goes through the origin.
			// a: dojox/gfx.Point|Number
			//		a point-like object, which specifies a vector of reflection, or an X value
			// b: Number?
			//		a Y value
			// returns: Matrix
			if(arguments.length == 1){
				b = a.y;
				a = a.x;
			}
			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx=2 * a2 / n2 - 1, 
				xy = 2 * a * b / n2,
				yx = xy,
				yy = 2 * b2 / n2 - 1;
			return new Matrix(xx,yx,xy, yy); // Matrix
		},
		project: function(a, b){
			// summary:
			//		forms an orthogonal projection matrix
			// description:
			//		The resulting matrix is used to project points orthogonally on a vector,
			//		which goes through the origin.
			// a:   Number
			//		an x coordinate value
			// b: Number?
			//		a y coordinate value
			// returns: Matrix

			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx = a2 / n2,
				xy = a * b / n2
				yx = xy,
				yy = b2 / n2;
			return new Matrix(xx,yx,xy,yy); // Matrix
		},

		// common operations

		// high level operations

		_sandwich: function(matrix, x, y){
			// summary:
			//		applies a matrix at a central point
			// matrix: Matrix
			//		a 2D matrix-like object, which is applied at a central point
			// x: Number
			//		an x component of the central point
			// y: Number
			//		a y component of the central point
			return this.translate(x, y).multiply(matrix)
			                           .multiply(this.translate(-x, -y)); // Matrix
		},
		scaleAt: function(a, b, c, d){
			// summary:
			//		scales a picture using a specified point as a center of scaling
			// description:
			//		Compare with scale().
			// a: Number
			//		a scaling factor used for the x coordinate, or a uniform scaling factor used for both coordinates
			// b: Number?
			//		a scaling factor used for the y coordinate
			// c: Number|Point
			//		an x component of a central point, or a central point
			// d: Number
			//		a y component of a central point
			// returns: Matrix
			switch(arguments.length){
				case 4:
					// a and b are scale factor components, c and d are components of a point
					return this._sandwich(this.scale(a, b), c, d); // Matrix
				case 3:
					if(typeof c == "number"){
						return this._sandwich(this.scale(a), b, c); // Matrix
					}
					return this._sandwich(this.scale(a, b), c.x, c.y); // Matrix
			}
			return this._sandwich(this.scale(a), b.x, b.y); // Matrix
		},
		rotateAt: function(angle, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotate().
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotate(angle), a, b); // Matrix
			}
			return this._sandwich(this.rotate(angle), a.x, a.y); // Matrix
		},
		rotategAt: function(degree, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotateg().
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotateg(degree), a, b); // Matrix
			}
			return this._sandwich(this.rotateg(degree), a.x, a.y); // Matrix
		},
		skewXAt: function(angle, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewX().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewX(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewX(angle), a.x, a.y); // Matrix
		},
		skewXgAt: function(degree, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewXg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewXg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewXg(degree), a.x, a.y); // Matrix
		},
		skewYAt: function(angle, a, b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewY().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewY(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewY(angle), a.x, a.y); // Matrix
		},
		skewYgAt: function(/* Number */ degree, /* Number||Point */ a, /* Number? */ b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewYg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewYg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewYg(degree), a.x, a.y); // Matrix
		}
	
	
	});

	return Matrix;
});