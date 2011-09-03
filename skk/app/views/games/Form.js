App.views.GamesForm = Ext.extend(Ext.form.FormPanel, {

    initComponent: function(){
        var titlebar, backButton, saveButton;

        backButton = {
            text: 'Zur&uuml;ck',
            ui: 'back',
            handler: this.onBackAction,
            scope: this
        };

        saveButton = {
            id: 'formSaveButton',
            text: 'Speichern',
            
            handler: this.onSaveAction,
            scope: this
        };
		
        titlebar = {
            id: 'formTitlebar',
            xtype: 'toolbar',
            title: 'Spiel',
            items: [ backButton, {xtype: 'spacer'}, saveButton ]
        };

		var gameDataList = function(form) {
		
			var gameData = function(nr, form) {
				return {
					id: 'gameData' + nr,
					layout: {
						type: 'hbox',
					},
					items: [ { 
						id: 'playerName' + nr,
						label: App.stores.tables.getAt(0).getPlayer(nr),
						labelWidth: '50%',
						xtype: 'checkboxfield',
						name: 'player_' + nr,
						cls: 'checkboxfield',
						listeners: {
							check: function() { form.onPlayerChanged(nr, true) },
							uncheck: function() { form.onPlayerChanged(nr, false) },
						},
					},
					{
						id: 'amount_' + nr,
						xtype: 'numberfield',
						name: 'amount_' + nr,
						cls: 'numberfield',
						disabledCls: 'numberfield-disabled',
						listeners: {
							keyup: function() { form.onAmountChanged(nr) },
						},
					}
					]};
			}
		
			var items = [];
			for(i = 1; i <= 4; i++) {
				items.push(gameData(i, form));
			}
			return items;
		};
		
		var gameDataListItem = {
				id: 'gameDataList',
				cls: 'game-data-list',
				items: gameDataList(this),
				updatePlayer: function(rec) {
					for(var i = 1; i <= 4; i++) {
						var el = Ext.getCmp('playerName' + i);
						if (el.labelEl) {
							el.labelEl.setHTML(rec.getPlayer(i));
						} else {
							el.label = rec.getPlayer(i);
						}
					}
				},
			};

		
		var fields = [
			{
				xtype: 'hiddenfield',
				name: 'type'
			},
			{
				id: 'gameTypeButtons',
				xtype: 'segmentedbutton',
				allowDepress: false,
				cls: 'game-type-buttons',
				defaults: {
					scope: this,
					handler: this.onGameTypeHandler
				},
				items: [{
					text: 'Sauspiel',
					id: 'SAUSPIEL'
				}, {
					text: 'Solo',
					id: 'SOLO'
				}, {
					text: 'Ramsch',
					id: 'RAMSCH'
				}]
			},
			{
				xtype: 'hiddenfield',
				name: 'win'
			},
			{
				id: 'winLoseButtons',
				xtype: 'segmentedbutton',
				allowDepress: false,
				cls: 'win-lose-buttons',
				defaults: {
					scope: this,
					handler: this.onWinLoseHandler
				},
				items: [{
					text: 'Gewonnen',
					id: 'winLoseTrue',
					value: 'WIN'
				}, {
					text: 'Verloren',
					id: 'winLoseFalse',
					value: 'LOSS'
				}]

			},
			gameDataListItem,
			{
				id: 'score',
				xtype: 'numberfield',
				name: 'score',
				label: 'Spielwert',
				labelWidth: '50%',
				cls: 'score-panel',
				listeners: {
					change: function() { this.ownerCt.onScoreChanged() },
				},
			},
		];

        Ext.apply(this, {
            scroll: 'vertical',
            dockedItems: [ titlebar ],
			items: [ fields ]
        });
		
		App.stores.tables.addModelListener(gameDataListItem.updatePlayer);

        App.views.GamesForm.superclass.initComponent.call(this);
    },
		
	/**
	 * Need to push values to segmented buttons and gameData section
	 */
	load: function(model) {
		this.cancelEvent = true;
		this.reset();
		App.views.GamesForm.superclass.load.call(this, model);
		
		this.pushModel(model);
		this.updateForm();
		this.cancelEvent = false;
	},
	
	pushModel: function(model) {

		var setButton = function(id, pressed) {
			var btn = Ext.getCmp(id);
			// when called for the first time the attr. el is undefined.
			if (btn.el) {
				btn.ownerCt.setPressed(id, pressed, true);
			} else {
				btn.pressed = pressed;
			}
		};

		var buttons = Ext.getCmp('winLoseButtons');
		setButton('winLoseTrue', false);
		setButton('winLoseFalse', false);
		if (model.getWin() == 'WIN') {
			setButton('winLoseTrue', true);
		} else if (model.getWin() == 'LOSS') {
			setButton('winLoseFalse', true);
		}
		buttons = Ext.getCmp('gameTypeButtons');
		setButton('SAUSPIEL', false);
		setButton('SOLO', false);
		setButton('RAMSCH', false);
		if (model.getType() != "") {
			setButton(model.getType(), true);
		}
		
		// push values to gameData section
		var updateGameData = function(nr) {
			var el = Ext.getCmp('gameData' + nr);
			var gameData = model.getPlayer(nr);
			// set checkbox
			if (gameData.data.isPlayer == true) {
				el.items.getAt(0).check();
			} 
			// set amount
			el.items.getAt(1).setValue(gameData.data.amount);
		};
		
		for(var i = 1; i <= 4; i++) { updateGameData(i); }

		
	},
	
	onGameTypeHandler: function(btn, evt) {
		console.log('onGameTypeHandler');
		this.setValues({
			type: btn.id
		});
		var visible = this.getValues().type != 'RAMSCH';
		Ext.getCmp('winLoseButtons').setVisible(visible);
		var scoreCmp = Ext.getCmp('score');
		scoreCmp.setVisible(visible);
		// preset score if empty
		var score = parseInt(scoreCmp.getValue());
		if (isNaN(score) || score <= 0) {
			score = App.stores.tables.rates[this.getValues().type];
			if (visible) {
				scoreCmp.setValue(score);
			} else {
			}
		}
		// if ramsch clear all amounts
		this.clearScores();
		
		this.updateForm();
		
	},
	
	onScoreChanged: function() {
		console.log('onScoreChanged');
		this.updateForm();
	},
	
	onPlayerChanged: function(nr, checked) {
		if (this.cancelEvent) return;
		console.log('onPlayerChanged');
		if (checked) {
			this.cancelEvent = true;
			if (this.getValues().type != 'SAUSPIEL') {
				// uncheck previously selected player
				for (var i = 1; i <= 4; i++) {
					if (i != nr) {
						var el = Ext.getCmp('playerName' + i);
						el.uncheck();
					}
				}
			}
			this.cancelEvent = false;
		}
		this.updateForm();
	},
	
	onAmountChanged: function(nr) {
		console.log('onAmountChanged');
		this.updateForm();
	},
	
	onWinLoseHandler: function(btn, evt) {
		console.log('onWinLoseHandler');
		this.setValues({
			win: btn.value
		});
		this.updateForm();
	},

    onBackAction: function() {
        Ext.dispatch({
            controller: 'Games',
            action: 'index'
        });
    },

    onSaveAction: function() {
		var model = this.getRecord();
		
        Ext.dispatch({
			controller: 'Games',
			action: (model.phantom ? 'save' : 'update'),
			data: this.getValues(),
			record: model
		});
    },
	
	updateForm: function() {
		var valid = this.validateForm();
		Ext.getCmp('formSaveButton').setDisabled(!valid);
		
		// enable player score fields if in RAMSCH
		var ramsch = this.getValues().type == 'RAMSCH';
		for (var i = 1; i <= 4; i++) {
			var cmp = Ext.getCmp('amount_' + i);
			cmp.setDisabled(!ramsch);
		}

		if (!valid) {
			if (!ramsch) 
				// clear player amount
				this.clearScores();
			return;
		}
		var model = new App.models.Game();
		model.setValues(this.getValues());
		
		switch(model.getType())  {
		case 'SAUSPIEL':
		case 'SOLO':
			model.updateScores();
			break;
		case 'RAMSCH':
			model.updateRamschScores();
		}
		this.pushModel(model);
	},
	
	clearScores: function() {
		this.setValues( { 
			amount_1: '',
			amount_2: '',
			amount_3: '',
			amount_4: '',
		});
	},
	
	validateForm: function() {
		var isValidPlayers;
		var model = new App.models.Game();
		model.setValues(this.getValues());
		
		if (model.getType() == 'SAUSPIEL') {
			isValidPlayers = model.getNumPlayers() == 2;
			return (isValidPlayers && model.isValidScore() && model.getWin() != "");
		} else if (model.getType() == 'SOLO') {
			isValidPlayers = model.getNumPlayers() == 1;
			return (isValidPlayers && model.isValidScore() && model.getWin() != "");
		} else if (model.getType() == 'RAMSCH') {
			isValidPlayers = model.getNumPlayers() == 1;
			// im RAMSCH müssen die Gewinne der Siegerspieler eingetragen werden.
			var isValidScore = model.isValidRamschScore();
			return (isValidPlayers && isValidScore);
		} else {
			return false;
		}
	},

});



Ext.reg('App.views.GamesForm', App.views.GamesForm);