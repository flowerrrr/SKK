App.views.GamesForm = Ext.extend(Ext.form.FormPanel, {

    initComponent: function(){
        var titlebar, backButton, buttonbar, saveButton;

        backButton = {
            text: 'Zur&uuml;ck',
            ui: 'back',
            handler: this.onBackAction,
            scope: this
        };

        titlebar = {
            id: 'formTitlebar',
            xtype: 'toolbar',
            title: 'Spiel',
            items: [ backButton ]
        };

        saveButton = {
            id: 'formSaveButton',
            text: 'save',
            ui: 'confirm',
            handler: this.onSaveAction,
            scope: this
        };

        buttonbar = {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{xtype: 'spacer'}, saveButton]
        };
		
		var gameDataList = function() {
		
			var gameData = function(nr) {
				return {
					id: 'gameData' + nr,
					items: [ { 
						label: eval('App.stores.tables.getAt(0).data.p' + nr),
						xtype: 'checkboxfield',
						name: 'player_' + nr,
					},
					{
						xtype: 'numberfield',
						name: 'amount_' + nr
					}
					]};
			}
		
			var items = [];
			for(i = 1; i <= 4; i++) {
				items.push(gameData(i));
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
				xtype: 'numberfield',
				name: 'score',
				label: 'Spielwert'
			},
			{
				items: gameDataList()
			},
			{
				xtype: 'hiddenfield',
				name: 'win'
			},
			{
				id: 'winLoseButtons',
				xtype: 'segmentedbutton',
				allowDepress: false,
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
				html: 'Save | New game'
			}		
		];

        Ext.apply(this, {
            scroll: 'vertical',
            dockedItems: [ titlebar, buttonbar ],
			items: [ fields ]
        });

        App.views.GamesForm.superclass.initComponent.call(this);
    },
		
	/**
	 * Need to push values to segmented buttons and gameData section
	 */
	load: function(model) {
		this.reset();
		App.views.GamesForm.superclass.load.call(this, model);
		
		pushModel

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
		buttons.setPressed('winLoseTrue', false, true);
		buttons.setPressed('winLoseFalse', false, true);
		if (model.getWin() == 'WIN') {
			setButton('winLoseTrue', true);
		} else if (model.getWin() == 'LOSS') {
			setButton('winLoseFalse', true);
		}
		buttons = Ext.getCmp('gameTypeButtons');
		buttons.setPressed('SAUSPIEL', false, true);
		buttons.setPressed('SOLO', false, true);
		buttons.setPressed('RAMSCH', false, true);
		if (model.getType() != "") {
			setButton(model.getType(), true);
		}
		
		// push values to gameData section
		var updateGameData = function(nr) {
			var el = Ext.getCmp('gameData' + nr);
			var gameData = model.data['gameDataP' + nr];
			// set checkbox
			if (gameData.data.isPlayer == true) {
				el.items.getAt(0).check();
			}
			// set amount
			el.items.getAt(1).setValue(gameData.data.amount);
		};
		
		for(i = 1; i <= 4; i++) { updateGameData(i); }
	},
	
	onGameTypeHandler: function(btn, evt) {
		this.setValues({
			type: btn.id
		});
	},
	
	onWinLoseHandler: function(btn, evt) {
		this.setValues({
			win: btn.value
		});
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
    }

});

Ext.reg('App.views.GamesForm', App.views.GamesForm);