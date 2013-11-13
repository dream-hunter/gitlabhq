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
	"qface/lang/Stateful",
	"qface/lang/Enum"
],function(declare,Array,Stateful,Enum) {
	
	var ElementOperationType = Collection.ElementOperationType =  Enum.declare(["Added","Removed","Cleared","PositionChanged"];
	
	
	var Collection = declare(Stateful,{

		//Collection‚ÉŠi”[‚³‚ê‚Ä‚¢‚é—v‘f”‚ðŽæ“¾‚µ‚Ü‚·B
		count : /*Number*/function () {
			throw new Error('Unimplemented API: qface/data/collections/Collection.count');
		},
		 
		//Collection‚©‚ç‚·‚×‚Ä‚Ì—v‘f‚ðíœ‚µ‚Ü‚·B
		clear : function () {  
			throw new Error('Unimplemented API: qface/data/collections/Collection.clear');
		},
		
		//‚ ‚é—v‘f‚ª ArrayList “à‚É‘¶Ý‚·‚é‚©‚Ç‚¤‚©‚ð”»’f‚µ‚Ü‚·B
        contains : /*Boolean*/function (item){ 
			throw new Error('Unimplemented API: qface/data/collections/Collection.contains');
        },

		//Collection‚Ì—v‘f‚·‚×‚Ä‚ðArray‚ÉƒRƒs[‚µ‚Ü‚·B
		toArray : /*Array*/function() {
			throw new Error('Unimplemented API: qface/data/collections/Collection.count');
		},
		
		//Collection‚Ì—v‘f‚·‚×‚Ä‚É‘Î‚µ‚Äf‚ðŒÄ‚Ño‚µ‚Ü‚·B
		forEach : function(f){
			throw new Error('Unimplemented API: qface/data/collections/Collection.forEach');
		}
	});
	
	
	return Collection;
	
});	