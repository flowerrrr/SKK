Ext.regController('Games', {
	store: App.stores.games,
	
    index: function(params) {
		// scroll to end of list
        App.views.viewport.reveal('gamesList');
		if (params) {
			var list = Ext.getCmp('gamesListList');
			if(params.scrollToBottom) {
				list.scroller.updateBoundary();
				list.scroller.scrollTo({x: 0, y:list.scroller.size.height}, true);
			}
			if (params.refresh) {
				list.refresh();
			}
		}
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
		this.index({ scrollToBottom: true });
	},

	update: function(params) {
		this.store.suspendEvents();
		params.record.setValues(params.data);
		App.scoreboard.clearCache(params.record.data.nr);
		params.record.save();
		this.store.resumeEvents();
		this.index({ refresh: true });
	}
});
