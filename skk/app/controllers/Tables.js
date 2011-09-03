Ext.regController('Tables', {
	store: App.stores.tables,

    index: function() {
        App.views.viewport.reveal('gamesList', 'down');
    },
	
	editForm: function() {
		var model = this.store.getAt(0);
		App.views.tablesForm.load(model);
		App.views.viewport.reveal('tablesForm', 'up');
	},

	update: function(params) {
		params.record.set(params.data);
		params.record.save();
		this.store.notifyListeners(params.record);
		this.index();
	}
});

