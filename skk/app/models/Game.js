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
	
	isPlayer: function() {
		return this.data.isPlayer;
	},
	
	getAmount: function() {
		return this.data.amount;
	},
	
	setAmount: function(amount) {
		this.data.amount = amount;
	},
	
});

App.models.Game = Ext.regModel('Game', {
	constructor: function(config) {
		App.models.Game.superclass.constructor.call(this, config);
	},

    fields: [
        {
            name: 'id',
            type: 'int'
        },
		{
			name: 'nr',
			type: 'int',
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
            type: 'string',
			defaultValue: 'WIN',
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
	
	init: function() {
		for(var i = 1; i <= 4; i++) {
			if (this.data['gameDataP' + i] == "") {
				this.data['gameDataP' + i] = Ext.ModelMgr.create({ player_id: i }, 'PlayerGameData');
			}
		}
	},	
	
	eachPlayer: function(fn, scope) {
		for(var i = 1; i <= 4; i++) {
			var p = this.getPlayer(i);
			fn.call(scope, p);
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
		if (num) {
			return this.data['gameDataP' + num];
		} else {
			var players = [];
			this.eachPlayer(function(p) {
				if (p.isPlayer()) players.push(p);
			});
			return players;
		}
	},
	
	getNumPlayers: function() {
		var num = 0;
		num += (this.getPlayer(1).isPlayer()) ?  1 : 0;
		num += (this.getPlayer(2).isPlayer()) ?  1 : 0;
		num += (this.getPlayer(3).isPlayer()) ?  1 : 0;
		num += (this.getPlayer(4).isPlayer()) ?  1 : 0;
		return num;
	},
	
	isValidScore: function() {
		return App.isNumber(this.getScore()) && this.getScore() > 0;
	},
	
	isValidRamschScore: function() {
		// all except the loser must have positive amount set
		var valid = true;
		this.eachPlayer(function(p) {
			if (!p.isPlayer()) {
				valid = valid && App.isNumber(p.getAmount()) && p.getAmount() > 0;
			}
		});
		return valid;
	},
	
	updateScores: function() {
		for(var i = 1; i <= 4; i++) {
			var p = this.getPlayer(i);
			var pSign = ((p.isPlayer() && this.getWin() == 'WIN') || (!p.isPlayer() && this.getWin() == 'LOSS')) ? 1 : -1;
			switch (this.getType()) {
			case 'SAUSPIEL':
				p.data.amount = this.getScore() * pSign;
				break;
			case 'SOLO':
				p.data.amount = this.getScore() * pSign;
				if (p.isPlayer()) {
					p.data.amount *= 3;
				}
				break;
			default:
			}
		}
	},
	
	updateRamschScores: function() {
		// loser must pay all
		var score = 0;
		this.eachPlayer(function(p) {
			if (!p.isPlayer()) {
				score = score + parseInt(p.getAmount());
			}
		});
		var p = this.getPlayer()[0];
		p.setAmount(score);
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


