App.models.Table = Ext.regModel('Table', {
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'p1',
            type: 'string',
			defaultValue: 'Spieler 1',
        }, 
        {
            name: 'p2',
            type: 'string',
			defaultValue: 'Spieler 2',
        }, 
        {
            name: 'p3',
            type: 'string',
			defaultValue: 'Spieler 3',
        }, 
        {
            name: 'p4',
            type: 'string',
			defaultValue: 'Spieler 4',
        }, 
    ],

    proxy: {
        type: 'localstorage',
        id: 'sencha-table'
    },
	
	getPlayer: function(i) {
		return this.data['p' + i];
	},
	
	
	
});

