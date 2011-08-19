App.GameCache = Ext.extend(Object, {

	cache: new Ext.util.HashMap(),

	get: function(gameId, playerNr) {
		var game = this.cache.get(gameId);
		if (game === undefined) return;
		return game[playerNr];
	},
	
	set: function(gameId, playerNr, score) {
		var game = this.cache.get(gameId);
		if (game === undefined) {
			this.cache.add(gameId, { playerNr: score });
		} else {
			game[playerNr] = score;
		}
	},
	
	clear: function(gameId) {
		var keys = this.cache.getKeys();
		for(var i in keys) {
			var key = keys[i];
			if (key >= gameId) {
				this.cache.removeByKey(key);
			}
		}
	}
});

App.ScoreBoard = Ext.extend(Object, {

	cache: new App.GameCache(),
	
	getPlayerScore: function(playerNr, game) {
		var score = this.cache.get(game.id, playerNr);
		if (score === undefined) {
			score = this.calcPlayerScore(playerNr, game);
			this.cache.set(game.id, playerNr, score);
		}
		// console.log('getPlayerScore: ' + gameId + ", " + playerNr + " = " + score);
		return score;
	},
	
	calcPlayerScore: function(playerNr, game) {
		var previousGame = this.getPreviousGame(game.id);
		var score = parseInt(game['gameDataP' + playerNr].data.amount);
		if (previousGame === undefined) {
			// first game 
			return score;
		} else {
			score = score + this.getPlayerScore(playerNr, previousGame.data);
			return score;
		}
	},
	
	getPreviousGame: function(gameId) {
		if (gameId <= 1) return;
		var previousGame = this.getGame(gameId - 1);
		if (previousGame === undefined) {
			// if there's a gap in the list of ids try next lower id
			return this.getPreviousGame(gameId - 1);
		} else {
			return previousGame;
		}
	},
	
	getGame: function(gameId) {
		return App.stores.games.getAt(gameId-1);
	},
	
	// clears cache for all games where id >= gameId
	clearCache: function(gameId) {
		this.cache.clear(gameId);
	}
});

App.scoreboard = new App.ScoreBoard();

