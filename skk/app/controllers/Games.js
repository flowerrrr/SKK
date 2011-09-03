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
		var model = new App.models.Game({ nr: this.store.getNextGameNr() });
		App.views.gamesForm.load(model);
        App.views.viewport.reveal('gamesForm');
    },
	
	save: function(params) {
		params.record.setValues(params.data);
		this.store.create(params.record.data);
		this.index();
	},

	update: function(params) {
		params.record.setValues(params.data);
		App.scoreboard.clearCache(params.record.data.nr);
		params.record.save();
		this.index();
	}
});
