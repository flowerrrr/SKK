App.stores.games = new Ext.data.Store({
    model: 'Game',
    autoLoad: true,
	
	getGroupString : function(record) {
        // only one group. needed to fake list header
		return 'A';
    },
});

