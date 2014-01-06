dojoConfig = {
	async:true,
	isDebug:true,
	parseOnLoad: true,
	extraLocale: ["en","en-us"],
	baseUrl:"/assets/desktop/",
	gfxRenderer:'canvas',
	packages:[
		{
			name:"dojo",
			location:"lib/dojo"
		},
		{
			name:"dijit",
			location:"lib/dijit"
		},
		{
			name:"dojox",
			location:"lib/dojox"
		},
		{
			name:"qface",
			location:"qface"
		},
		{
			name:"apps",
			location:"apps"
		},
		{
			name:"config",
			location:"config"
		},
		{
			name:"qfacex",
			location:"qfacex"
		},
		{
			name:"res",
			location:"resources"
		},
		{
			name:"tools",
			location:"qface/system/tools"
		},
		{
	    name: 'dbootstrap',									
			location: 'resources/qfacex/themes/dbootstrap'
		}
	]
};