App.models.Game = Ext.regModel('Game', {
    fields: [
        {
            name: 'type',
            type: 'string'
        }, 
        {
            name: 'score',
            type: 'int'
        }, 
        {
            name: 'win',
            type: 'boolean'
        }, 
        {
            name: 'player',
            type: 'string'
        }
    ],

    proxy: {
        type: 'localstorage',
        id: 'sencha-games'
    },
	
	getWin: function() {
		return this.data.win;
	},
	
	getType: function() {
		return this.data.type;
	},
	
	getScore: function() {
		return this.data.score;
	}
	
});

