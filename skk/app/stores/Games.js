App.stores.games = new Ext.data.Store({
    model: 'Game',
    autoLoad: true,
	
	getNextGameNr: function() {
		return this.getMaxGameNr() + 1;
	},
	
	getMaxGameNr: function() {
		var max = 0;
		// TODO: use sorting to get max value.
		this.each(function(rec) {
			max = Math.max(max, rec.data.nr);
		});
		return max;
	},
	
	clearAll: function() {
		var me = this;
		this.each(function(rec) { 
			me.remove(rec); 
		});
		this.currentGameNr = 0;
		this.sync();
	},
});

