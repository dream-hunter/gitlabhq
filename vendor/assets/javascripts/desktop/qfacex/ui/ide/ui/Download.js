require({cache:{
'url:qfacex/ui/ide/ui/templates/download.html':"<div class='downloadDialog'>\t \r\n\t<div class=\"dijitDialogPaneContentArea\">\r\n\t\t<div style=\"margin-bottom: 20px\">\r\n\t\t  ${fileName}: <input dojoType='dijit.form.ValidationTextBox' type=\"text\" maxLength='${_fileNameMaxLength}' dojoAttachPoint=\"__fileName\" value='workspace1.zip' data-dojo-props=\"regExp:'${_fileNameValidationRegExp}', required:true, invalidMessage:'${invalidDownloadFileName}'\"></input>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div dojoAttachPoint=\"_selectionDiv\"></div>\r\n\t\t<div dojoAttachPoint=\"_tableDiv\"></div>\r\n\r\n\t\t<div style=\"margin-top: 8px\">\r\n\t\t  Select: <a href=\"javascript:;\" data-dojo-attach-event=\"onclick: _selectAll\">${selectAll}</a> / <a href=\"javascript:;\" data-dojo-attach-event=\"onclick: _selectNone\">${selectNone}</a>\r\n\t\t</div>\r\n\r\n\t\t<div style=\"margin-top: 20px\">\r\n\t\t\t<input dojoType='dijit.form.CheckBox' type=\"text\" dojoAttachPoint=\"__fullSource\" data-dojo-props=\"\"></input><span style='padding-left: 3px;'>${downloadFullSource}</span>\r\n\t\t\t<br>\r\n\t\t\t<input dojoType='dijit.form.CheckBox' type=\"text\" dojoAttachPoint=\"__optimize\" data-dojo-props=\"\"></input><span style='padding-left: 3px;'>${optimizeOption}</span>\r\n\t\t</div>\r\n  </div>\r\n\t<div class=\"dijitDialogPaneActionBar\">\r\n\t\t<button dojoType='dijit.form.Button' dojoAttachPoint=\"_okButton\" dojoAttachEvent='onClick:okButton' label='${downloadButtonLabel}' class=\"maqPrimaryButton\" type=\"submit\"></button>\r\n\t\t<button dojoType='dijit.form.Button' dojoAttachEvent='onClick:cancelButton' label='${buttonCancel}' class=\"maqSecondaryButton\"></button>\r\n\t</div>\r\n</div>"}});
define("qfacex/ui/ide/ui/Download", ["dojo/_base/declare",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase",
        "dijit/_WidgetsInTemplateMixin",
        "qfacex/ui/workbench/WorkbenchPart",
        "dojo/promise/all",
        "dojo/parser",
        "qfacex/ui/ide/ve/RebaseDownload",
        "dojo/i18n!./nls/ui",
        "dojo/i18n!dijit/nls/common",
        "dojo/text!./templates/download.html",
        "dijit/form/Button",
        "dijit/form/ValidationTextBox",
        "dijit/form/TextBox"
],function(declare, _TemplatedMixin, _WidgetBase, _WidgetsInTemplateMixin, WorkbenchPart, all, parser,  RebaseDownload, uiNLS, commonNLS, templateString){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,WorkbenchPart], {
		templateString: templateString,
		
		_fileNameValidationRegExp: "[a-zA-z0-9_.]+", //Numbers, letters, "_", and "."
		_fileNameMaxLength: 50, 
		
		postMixInProperties: function() {
			dojo.mixin(this, uiNLS);
			dojo.mixin(this, commonNLS);
			this.inherited(arguments);
		},
		/* templated attach points, custom input section */
		
		/* check box for rewrite dojo */
		__rewriteDojo : null,
		__rewriteDojoURL : null,
		__fileName : null,
		__optimize: null, //TODO: make sticky
		__fullSource:null,
		_selectionDiv : null,
		_okButton : null,
		_tableDiv : null,
	
		buildRendering: function(){
			this.inherited(arguments);
			
			this._handles = [];
			this._userLibs = [];//Library.getUserLibs(this.getRoot()); modified by LWF 
			var uiArray = [];
			
			uiArray.push("<table cellspacing='0' cellpadding='0' width='100%' class='dwnloadLibTable'><tr><td class='header'>"+uiNLS.library+"</td><td class='header'>"+uiNLS.version+"</td><td class='header'>"+uiNLS.include+"<br>"+uiNLS.source+"</td><td class='header'>"+uiNLS.baseLocation+"</td></tr>");
			uiArray.push("<tr><td colspan='4'><hr></hr></td></tr>");
			this.libraries = {};
			/* build UI table */
			for(var i =0;i<this._userLibs.length;i++){
				this._userLibs[i].initRoot = this._getLibRoot(this._userLibs[i].id,this._userLibs[i].version);
				var name = this._userLibs[i].id; // may want to use a better name here eventually
				
				if(this._userLibs[i].initRoot==null) {
					continue;
				}
				
				if(this._userLibs[i].required){
					uiArray.push("<tr libPath='"+i+"' style='display:none'>");
					
				}else{
					uiArray.push("<tr libPath='"+i+"'>");
				}
				
				uiArray.push("<td class='columna'>" + name + "</td>");
				uiArray.push("<td class='columnb'>" + this._userLibs[i].version + "</td>");
				uiArray.push("<td class='columnc'><input type='checkbox' dojoType='dijit.form.CheckBox' checked></input></td>");

				uiArray.push("<td class='columnd'><input type='text' dojoType='dijit.form.TextBox' value='" + this._userLibs[i].initRoot + "'></input></td>");
				
				uiArray.push("</tr>");
				
			}
			uiArray.push("</table>");
			var html =  uiArray.join("");
			dojo.place(html, this._tableDiv);

			// parse dijits
			dojo.parser.parse(this._tableDiv);
		},
	
		_getLibRoot: function(id,version){
			for(var i=0;i<this._userLibs.length;i++){
				if(this._userLibs[i].id==id && this._userLibs[i].version==version)
					return this._userLibs[i].root;
			}
			
		},
		
		_getLibs: function(){
			var rows = dojo.query("tr[libPath]", this.domNode);

			var userLibs = [];

			for(var i =0;i<rows.length;i++){
				var textBox = dijit.byNode(dojo.query(".dijitTextBox", rows[i])[0]);
				var checkBox = dijit.byNode(dojo.query(".dijitCheckBox", rows[i])[0]);

				var element = parseInt(dojo.attr(rows[i], "libPath"));
				var value = checkBox.get("checked");
				var libLocation = textBox.get("value") || this._userLibs[element].root;
				userLibs.push({id: this._userLibs[element].id,
							   version: this._userLibs[element].version,
							   root: libLocation,
							   includeSrc: value});
			}
			
			return userLibs;
		},
		
		getRoot: function(){
			if(this._workbench.singleProjectMode()){
				return this._workbench.getProject();
			}
		},
		
		_getResources: function(){
			return {userFiles: [this._workbench.getProject()], userLibs: this._getLibs()};
		},
		
		_rewriteUrls: function(){
			var resources = this._getResources(),
				promises = [];
			
			var pageBuilder = new RebaseDownload(resources.userLibs);
			var allResources = [];
			var workspace = this._workbench.getUserWorkspace();
			for(var i=0;i<resources.userFiles.length;i++){
				
				var resource = workspace.findSync(resources.userFiles[i]);
				if(resource.elementType=="Folder"){
					allResources = workspace.findSync("*.html", true, resource, true);
				}else if(resource.extension=="html"){
					allResources = [resource];
				}
				//FIXME: is it possible allResources will be repeated from the last time through the loop?
				allResources.forEach(function(res){
					if(!Theme.isThemeHTML(res)) {
						promises.push(pageBuilder.rebuildSource(res.getContentSync(), res).then(function (newSource) {
							res.setContent(newSource, true);						
						}));
					}
				});
			}
			return all(promises);
		},

		_select: function(value) {
			var rows = dojo.query("tr[libPath]", this.domNode);

			dojo.forEach(rows, function(row) {
				var checkBox = dijit.byNode(dojo.query(".dijitCheckBox", row)[0]);
				if (checkBox) {
					checkBox.set("checked", value);
				}
			});

			return false;
		},

		_selectAll: function() {
			this._select(true);
		},

		_selectNone: function() {
			this._select(false);
		},
		
		okButton: function(){
			var workspace = this._workbench.getUserWorkspace();
			if (this.__fileName.isValid()) {
				function makeTimeoutFunction(downloadFiles, fileName, root, libs, options){
					return function(){
						var files = downloadFiles;
						var fn = fileName;

						workspace.download(files, fn, root, libs, options);		
						/*
						for(var i=0;i<pgs.length;i++){
							pgs[i].removeWorkingCopy();
						}
						*/
						
					}
				}
				var fileName = dojo.attr( this.__fileName, "value");
				if (fileName.slice(-4) != ".zip") {
					fileName = fileName + ".zip";
				}
				this._rewriteUrls().then(function() {
					var allFiles = this._getResources();
					var pages = this._noRewrite ? [] : this._pages;
					/* have to close the dialog before the download call starts */
					var actualLibs = allFiles.userLibs.filter(function(lib){
						return lib.includeSrc;
					});
		
					var options = {};
					if (this.__optimize.getValue()) {
						options.build = "1";
					}
					if (this.__fullSource.getValue()) {
						options.fullsource = "1";
					}
					
					setTimeout(makeTimeoutFunction(allFiles.userFiles, fileName, this.getRoot(), actualLibs, options), 300);					
				}.bind(this));
			}
		},
		
		cancelButton: function(){
			this.cancel = true;
			this.onClose();
		}
	});
});
