define( ["dojo/_base/declare",
        "dijit/_WidgetBase",
		"dijit/form/Select"
  ],function(declare, _WidgetBase, Select){

	return declare( _WidgetBase, {

		postCreate: function(){
			var workspace = this._workspace;
			if (workspace) {
				workspace.listProjects(dojo.hitch(this, function(projects){
					this.value = workspace.getCurrentProject(); //TODO will be modified
					this._allProjects = projects.map(function(project){ return project.name; });
				//	this.combo.startup();
				//	this.domNode.removeAttribute("dojoType");
					var items = [];
					dojo.forEach(projects, dojo.hitch(this,function(v){
						items.push({label: v.name, value: v.name});
					}));
					
					this.combo = new Select({ style: "width:100%", options:items});
					this.domNode.appendChild(this.combo.domNode);
					this.combo.set('value', this.value);
					dojo.connect(this.combo, "onChange", this, "_onChange");
						
				}));
			}	
		},
		
		onChange: function(){
			
		},
		
		_onChange: function(){
			var comboValue = dojo.attr(this.combo, "value");
			if(this.value!=comboValue){
				this.value = comboValue;
				this.onChange();
			}
		},
		
		_getValueAttr: function(){
			return this.value;
		},
		
		_getSizeAttr: function(){
			return this._allProjects.length;
		},
		
		_getProjectsAttr: function(){
			return this._allProjects;
		}
	});
});
