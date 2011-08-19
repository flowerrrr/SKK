App.views.GamesList = Ext.extend(Ext.Panel, {
    initComponent: function(){
        var actionButton, addButton, titlebar, list;
		
		actionButton = {
			itemId: 'actionButton',
			iconCls: 'action',
			iconMask: true,
			ui: 'plain',
			handler: this.onActionAction,
			scope: this
		};

        addButton = {
            itemId: 'addButton',
            iconCls: 'add',
            iconMask: true,
            ui: 'plain',
            handler: this.onAddAction,
            scope: this
        };

        titlebar = {
            dock: 'top',
            xtype: 'toolbar',
            title: 'Schafkopf Kasse',
            items: [ actionButton, { xtype: 'spacer' }, addButton ]
        };

        list = {
            xtype: 'list',
            itemTpl: '{type}, {score}, {win}, {player}',
            store: App.stores.games,
			listeners: {
				scope: this,
				itemtap: this.onItemTapAction
			}
        };

        Ext.apply(this, {
            html: 'placeholder',
            layout: 'fit',
            dockedItems: [titlebar],
            items: [list]
        });

        App.views.GamesList.superclass.initComponent.call(this);
    },

    onAddAction: function() {
        Ext.dispatch({
            controller: 'Games',
            action: 'newForm'
        });
    },
	
	onActionAction: function() {
		actionSheet.show();
	},
	
	onItemTapAction: function(list, index, item, e) {
		Ext.dispatch({
			controller: 'Games',
			action: 'editForm',
			index: index
		});
	}
	

});

// action sheet for main action icon
App.views.ActionSheet = Ext.extend(Ext.ActionSheet, {
	
    initComponent: function(){
		sheet = this;
		
        Ext.apply(this, {
			items: [
				{
					text: 'Alle Daten l&ouml;schen',
					ui  : 'decline',
					handler: this.onClearAllDataHandler
				},
				{
					text: 'Spieler hinzuf&uuml;gen',
					handler: this.onAddPlayerHandler
				},
				{
					text: 'Abbrechen',
					handler: function() { sheet.hide(); }
				}
			]
        });

        App.views.ActionSheet.superclass.initComponent.call(this);
	
	},

	onClearAllDataHandler: function(btn, evt) {
		Ext.Msg.confirm('Confirmation', 'Clear all data?', function(button) {
			sheet.hide();
			if(button == 'yes') {
				App.stores.games.data.clear();
				// App.views.gamesList.list.update();
			}
		});
	},
	
	onAddPlayerHandler: function(btn, evt) {
		sheet.hide();
		alert("Function not implemented!");
	}
});

var actionSheet = new App.views.ActionSheet();


Ext.reg('App.views.GamesList', App.views.GamesList);