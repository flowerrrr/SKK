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
			type: 'int',
		}
	],
	
});

App.models.Game = Ext.regModel('Game', {
	constructor: function(config) {
		App.models.Game.superclass.constructor.call(this, config);
		this.initModel();
		if (config) {
			if (config.init) {
				this.data.win = 'WIN';
			}
		}
	},

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
		},
		{
			name: 'gameDataP2',
			type: 'PlayerGameData',
		},
		{
			name: 'gameDataP3',
			type: 'PlayerGameData',
		},
		{
			name: 'gameDataP4',
			type: 'PlayerGameData',
		},
    ],
	
	initModel: function() {
		for(var i = 1; i <= 4; i++) {
			if (this.data['gameDataP' + i] == "") {
				this.data['gameDataP' + i] = Ext.ModelMgr.create({ player_id: i }, 'PlayerGameData');
			}
		}
	},	

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
	},
	
	getPlayer: function(num) {
		return this.data['gameDataP' + num];
	},
	
	getNumPlayers: function() {
		var num = 0;
		num += (this.getPlayer(1).data.isPlayer) ?  1 : 0;
		num += (this.getPlayer(2).data.isPlayer) ?  1 : 0;
		num += (this.getPlayer(3).data.isPlayer) ?  1 : 0;
		num += (this.getPlayer(4).data.isPlayer) ?  1 : 0;
		return num;
	},
	
	isValidScore: function() {
		return App.isNumber(this.getScore()) && this.getScore() > 0;
	},
	
	updateScores: function() {
		for(var i = 1; i <= 4; i++) {
			var p = this.getPlayer(i);
			var pSign = ((p.data.isPlayer && this.getWin() == 'WIN') || (!p.data.isPlayer && this.getWin() == 'LOSS')) ? 1 : -1;
			switch (this.getType()) {
			case 'SAUSPIEL':
				p.data.amount = this.getScore() * pSign;
				break;
			case 'SOLO':
				p.data.amount = this.getScore() * pSign;
				if (p.data.isPlayer) {
					p.data.amount *= 3;
				}
				break;
			default:
			}
		}
	},
	
	setValues: function(values) {
		this.set(values);
		for(var i = 1; i <= 4; i++) {
			this.setPlayer(i, values);
		}
	},
	
	setPlayer: function(nr, values) {
		var p = this.getPlayer(nr);
		p.data.isPlayer = (values['player_' + p.data.player_id] != null);
		p.data.amount = values['amount_' + p.data.player_id];
	},
	
});


