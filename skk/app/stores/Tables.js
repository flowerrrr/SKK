App.stores.tables = new Ext.data.Store({
    model: 'Table',
    autoLoad: true,

	// init the store with default player names if none are stored yet.
	init: function() {
		var model = this.getAt(0);
		if (!model) {
			model = new App.models.Table();
			this.create(model);
		}
		
	},
	
	modelListeners: [],
	
	addModelListener: function(fn) {
		this.modelListeners.push(fn);
	},
	
	notifyListeners: function(rec) {
		Ext.each(this.modelListeners, function(fn) {
			fn(rec);
		});
	},
	
	rates: {
		SAUSPIEL: 20,
		SOLO: 50,
		RAMSCH: 20,
	},	

});

