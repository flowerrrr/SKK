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
			emptyText: '<div class="emptyText">Klicken Sie auf + um ein neues Spiel einzutragen.</div>',
            store: App.stores.games,
			listeners: {
				scope: this,
				itemtap: this.onItemTapAction,
				afterrender : function(cmp){
				   cmp.refresh();
				}				
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
					text: 'Alle Spiele l&ouml;schen',
					ui  : 'decline',
					handler: this.onClearAllDataHandler,
					// hidden: App.store.games.data.length()
				},
				{
					text: 'Spieler bearbeiten',
					handler: this.onEditPlayerHandler
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
		Ext.Msg.confirm('Achtung', 'Alle Spiele l&ouml;schen?', function(button) {
			sheet.hide();
			if(button == 'yes') {
				App.stores.games.each(function(rec) { App.stores.games.remove(rec); });
				App.stores.games.sync();
			}
		});
	},
	
	onEditPlayerHandler: function(btn, evt) {
		sheet.hide();
		Ext.dispatch({
			controller: 'Tables',
			action: 'editForm',
		});
	}
});

var actionSheet = new App.views.ActionSheet();


Ext.reg('App.views.GamesList', App.views.GamesList);