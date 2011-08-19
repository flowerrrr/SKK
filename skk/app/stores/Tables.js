App.stores.tables = new Ext.data.Store({
    model: 'Table',
    autoLoad: true,

	// init the store with default player names if none are stored yet.
	init: function() {
		var model = this.getAt(0);
		if (!model) {
			console.log('init default player names');
			model = new App.models.Table();
			this.create(model);
		}
		
	}

});

