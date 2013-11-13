// wrapped by build app
define("qfacex/ui/ide/skeletons/callbacks", ["dijit","dojo","dojox"], function(dijit,dojo,dojox){
/**
 * THIS FILE IS FOR REFERENCE/DOCUMENTATION ONLY.  Do not use directly, but feel
 * free to copy for use, update and strip out the unnecessary functions.
 */

(function() {

	return {
		/**
		 * [onDocInit description]
		 * @param  {qfacex/ui/ide/ve/Context} context
		 */
		onDocInit: function(context) {},
		
		/**
		 * Called before a widget from this library is added to page and no other
		 * widget from this library exists on page.
		 * 
		 * @param  {String} type    Type identifier of widget being added.
		 * @param  {qfacex/ui/ide/ve/Context} context
		 */
		onFirstAdd: function(type, context) {},

		/**
		 * A widget from this library will be added to page.
		 * 
		 * @param  {String} type    Type identifier of widget being added.
		 * @param  {qfacex/ui/ide/ve/Context} context
		 */
		onAdd: function(type, context) {},

		/**
		 * Called after a widget is removed from page and that widget was the only
		 * remaining widget from this library on the page.
		 * 
		 * @param  {String} type    Type identifier of widget being removed.
		 * @param  {qfacex/ui/ide/ve/Context} context
		 */
		onLastRemove: function(type, context) {},

		/**
		 * A widget from this library has been removed.
		 * 
		 * @param  {String} type    Type identifier of widget being removed.
		 * @param  {qfacex/ui/ide/ve/Context} context
		 */
		onRemove: function(type, context) {}
	};

})();
});
