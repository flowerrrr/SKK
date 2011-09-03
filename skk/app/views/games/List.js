App.views.GamesList = Ext.extend(Ext.Panel, {
    initComponent: function(){
        var actionButton, addButton, titlebar, playerbar, list;
		
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
            itemTpl: new Ext.XTemplate('<tpl for="[1,2,3,4]"><div class="score p{#}">{[App.scoreboard.getPlayerScore(xindex, parent)]}</div></tpl>'),
			emptyText: '<div class="emptyText">Klicken Sie auf + um ein neues Spiel einzutragen.</div>',
            store: App.stores.games,
			listeners: {
				scope: this,
				itemtap: this.onItemTapAction,
				afterrender : function(cmp){
				   cmp.refresh();
				}				
			},
			grouped: true,
			groupTpl : [
				'<tpl for=".">',
					'<div class="x-list-group x-group-{id}">',
						'<h3 class="x-list-header">{[App.getListHeader()]}</h3>',
						'<div class="x-list-group-items">',
							'{items}',
						'</div>',
					'</div>',
				'</tpl>',
			],
			getHeader: function() {
				var s = '';
				for(var i = 1; i <= 4; i++) {
					var player = App.stores.tables.getAt(0).getPlayer(i);
					s += '<div id="header-p' + i + '" class="score p' + i + ' header">' + player + '</div>';
				}
				s += '<div style="clear:both;" ></div>';
				return s;
			},
			updateHeader: function(rec) {
				for(var i = 1; i <= 4; i++) {
					var el = Ext.get('header-p' + i);
					if (el) {
						el.setHTML(rec.getPlayer(i));
					}
				}
			},
        };
		
		App.getListHeader = list.getHeader;

        Ext.apply(this, {
            html: 'If you see this something is wrong.',
            layout: 'fit',
            dockedItems: [titlebar],
            items: [list]
        });
		
		App.stores.tables.addModelListener(list.updateHeader);

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

