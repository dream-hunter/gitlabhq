define( [
	"qface/lang/declare",
	"qface/windows/controls/ContentControl",
],	function(declare, Control){

	var Button = declare([ContentControl], {
		"-attributes-"	:	{
			"text"	:	{
				type	:	String
			}	
		
		}
	});
	
	return Button;
});
