Ext.regController('Games', {
	store: App.stores.games,

    index: function() {
        App.views.viewport.reveal('gamesList');
    },
	
	editForm: function(params) {
		var model = this.store.getAt(params.index);
		App.views.gamesForm.load(model);
		App.views.viewport.reveal('gamesForm');
	},

    newForm: function() {
		var model = new App.models.Game();
		App.views.gamesForm.load(model);
        App.views.viewport.reveal('gamesForm');
    },
	
	save: function(params) {
		params.record.set(params.data);
		this.store.create(params.data);
		this.index();
	},

	update: function(params) {
		params.record.set(params.data);
		this.store.save(params.data);
		this.index();
	}
});
