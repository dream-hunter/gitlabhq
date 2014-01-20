define([
  "dojo/json",
  "qface/Runtime",
  "dojo/text!config/fontAwesome.json"
],function(json,qRun,fontJson){
	qRun.addDojoCss("res/font-awesome-4.0.3/css/font-awesome.min.css");
	return json.parse(fontJson);
});
