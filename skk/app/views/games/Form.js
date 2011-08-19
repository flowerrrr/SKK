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
						label: App.stores.tables.getAt(0).data['p' + nr],
						labelWidth: '50%',
						xtype: 'checkboxfield',
						name: 'player_' + nr,
						cls: 'checkboxfield',
						listeners: {
							check: function() { form.onPlayerChanged(nr) },
							uncheck: function() { form.onPlayerChanged(nr) },
						},
					},
					{
						xtype: 'numberfield',
						name: 'amount_' + nr,
						cls: 'numberfield',
					}
					]};
			}
		
			var items = [];
			for(i = 1; i <= 4; i++) {
				items.push(gameData(i, form));
			}
			return items;
		};
		
		fields = [
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
			{
				cls: 'game-data-list',
				items: gameDataList(this)
			},
			{
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
		Ext.getCmp('winLoseButtons').setDisabled(this.getValues().type == 'RAMSCH');
		this.updateForm();
		
	},
	
	onScoreChanged: function() {
		console.log('onScoreChanged');
		this.updateForm();
	},
	
	onPlayerChanged: function(nr) {
		if (this.cancelEvent) return;
		console.log('onPlayerChanged');
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

		if (!valid) {
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
			alert('not implemented');
		}
		this.pushModel(model);
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
			return (isValidPlayers && notimplemented());
		} else {
			return false;
		}
	},

});



Ext.reg('App.views.GamesForm', App.views.GamesForm);