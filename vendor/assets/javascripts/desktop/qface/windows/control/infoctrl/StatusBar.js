
define( [
	"qface/lang/declare",
	"qface/windows/controls/Control",
	"dijit/form/CheckBox"
],	function(declare, DijitCheckBox){

pkg.StatusBar = Class(pkg.Panel, [
    function () { this.$this(2); },

    function (gap){
        this.setPaddings(gap, 0, 0, 0);
        this.$super(new L.PercentLayout(Layout.HORIZONTAL, gap));
    },

    function setBorderView(v){
        if(v != this.borderView){
            this.borderView = v;
            for(var i = 0;i < this.kids.length; i++) this.kids[i].setBorder(this.borderView);
            this.repaint();
        }
    },

    function insert(i,s,d){
        d.setBorder(this.borderView);
        this.$super(i, s, d);
    }
]);

});
