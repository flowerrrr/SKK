App.GameCache = Ext.extend(Object, {

	cache: new Ext.util.HashMap(),

	get: function(gameNr, playerNr) {
		var game = this.cache.get(gameNr);
		if (game === undefined) return;
		return game[playerNr];
	},
	
	set: function(gameNr, playerNr, score) {
		var game = this.cache.get(gameNr);
		if (game === undefined) {
			this.cache.add(gameNr, { playerNr: score });
		} else {
			game[playerNr] = score;
		}
	},
	
	clear: function(gameNr) {
		var keys = this.cache.getKeys();
		for(var i in keys) {
			var key = keys[i];
			if (key >= gameNr) {
				this.cache.removeByKey(key);
			}
		}
	}
});

App.ScoreBoard = Ext.extend(Object, {

	store: App.stores.games,

	cache: new App.GameCache(),
	
	getPlayerScore: function(playerNr, game) {
		console.group('getPlayerScore: game.nr=' + game.nr + ", playerNr=" + playerNr);
		var score = this.cache.get(game.nr, playerNr);
		if (score === undefined) {
			score = this.calcPlayerScore(playerNr, game);
			this.cache.set(game.nr, playerNr, score);
		}
		console.info('getPlayerScore: score=' + score);
		console.groupEnd();
		return score;
	},
	
	calcPlayerScore: function(playerNr, game) {
		console.debug('calcPlayerScore: game.nr=' + game.nr + ", playerNr=" + playerNr);
		var previousGame = this.getPreviousGame(game.nr);
		var score = parseInt(game['gameDataP' + playerNr].data.amount);
		if (previousGame === undefined) {
			// first game 
			return score;
		} else {
			score = score + this.getPlayerScore(playerNr, previousGame.data);
			return score;
		}
	},
	
	getPreviousGame: function(gameNr) {
		console.debug('getPreviousGame: gameNr=' + gameNr);
		if (gameNr <= 1) return;
		var previousGame = this.getGame(gameNr - 1);
		if (previousGame === undefined) {
			// if there's a gap in the list of ids try next lower id
			return this.getPreviousGame(gameNr - 1);
		} else {
			return previousGame;
		}
	},
	
	getGame: function(gameNr) {
		var index = this.store.findExact('nr', gameNr);
		if (index == -1) return;
		return this.store.getAt(index);
	},
	
	// clears cache for all games where id >= gameNr
	clearCache: function(gameNr) {
		this.cache.clear(gameNr);
	}
});

App.scoreboard = new App.ScoreBoard();

