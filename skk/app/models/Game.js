App.models.PlayerGameData = Ext.regModel('PlayerGameData', {
	fields: [
		{
			name: 'player_id', // 1,2,3,4
			type: 'int'
		},
		{
			name: 'isPlayer',
			type: 'boolean'
		},
		{
			name: 'amount',
			type: 'int'
		}
	],

});

App.models.Game = Ext.regModel('Game', {
    fields: [
        {
            name: 'id',
            type: 'int'
        },
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
            type: 'string'
        }, 
		{
			name: 'gameDataP1',
			type: 'PlayerGameData',
			defaultValue: new App.models.PlayerGameData()
		},
		{
			name: 'gameDataP2',
			type: 'PlayerGameData',
			defaultValue: new App.models.PlayerGameData()
		},
		{
			name: 'gameDataP3',
			type: 'PlayerGameData',
			defaultValue: new App.models.PlayerGameData()
		},
		{
			name: 'gameDataP4',
			type: 'PlayerGameData',
			defaultValue: new App.models.PlayerGameData()
		},
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


