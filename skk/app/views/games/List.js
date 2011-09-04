App.views.GamesList = Ext.extend(Ext.Panel, {

	initComponent: function(){
        var actionButton, addButton, titlebar, playerbar, list, listHeader;
		
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
		
		listHeader = {
			tpl:  new Ext.XTemplate(
				'<tpl for=".">',
					'<div id="header-p{#}" class="score p{#} header">{[values]}</div>',
				'</tpl>',
				'<div style="clear:both;" ></div>'
			),
			data: App.stores.tables.getAt(0).getPlayers(),
			updateHeader: function(rec) {
				for(var i = 1; i <= 4; i++) {
					var el = Ext.get('header-p' + i);
					if (el) {
						el.setHTML(rec.getPlayer(i));
					}
				}
			},
			cls: 'x-list-header',
		},

        list = {
			id: 'gamesListList',
            xtype: 'list',
            itemTpl: new Ext.XTemplate('<tpl for="[1,2,3,4]"><div class="score p{#}">{[App.scoreboard.getPlayerScore(xindex, parent)]}</div></tpl>'),
			emptyText: '<div class="emptyText">Klicken Sie auf + um ein neues Spiel einzutragen.</div>',
			selectedItemCls: '',
            store: App.stores.games,
			listeners: {
				scope: this,
				itemtap: this.onItemTapAction,
				afterrender : function(cmp){
				   cmp.refresh();
				}				
			},
        };
		
        Ext.apply(this, {
            html: 'If you see this something is wrong.',
            layout: 'fit',
            dockedItems: [titlebar, listHeader],
            items: [list]
        });
		
		App.stores.tables.addModelListener(listHeader.updateHeader);

        App.views.GamesList.superclass.initComponent.call(this);
		
    },

    onAddAction: function() {
        Ext.dispatch({
            controller: 'Games',
            action: 'newForm'
        });
    },
	
	onActionAction: function() {
		App.views.actionSheet.show();
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
					ui: 'cancel',
					handler: function() { sheet.hide(); }
				}
			]
        });

        App.views.ActionSheet.superclass.initComponent.call(this);
	
	},
	
	listeners: {
		beforeshow: function() {
			var el = this.items.getAt(0);
			(App.stores.games.data.length == 0) ? el.hide() : el.show();
		}
	},
	

	onClearAllDataHandler: function(btn, evt) {
		Ext.Msg.confirm('Achtung', 'Alle Spiele l&ouml;schen?', function(button) {
			sheet.hide();
			if(button == 'yes') {
				App.stores.games.clearAll();
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

App.views.actionSheet = new App.views.ActionSheet();


Ext.reg('App.views.GamesList', App.views.GamesList);

