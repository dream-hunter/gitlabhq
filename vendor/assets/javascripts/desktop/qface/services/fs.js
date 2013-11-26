define([
	"dojo/_base/declare", // declare
    "dojo/node!fs"
], function(declare,fs){
	return declare({
		write: function(filename,content){
		    fs.writeFile(filename, content, function (err) {
			  if (err) throw err;
			  console.log('It\'s saved!');
			});
			
		},

		read: function(filename){
		    fs.readFile(filename, function(err, data){
		        if(err) console.error("I was robbed!");
		        return JSON.parse(data);
		    });
			
		}
	});
});

