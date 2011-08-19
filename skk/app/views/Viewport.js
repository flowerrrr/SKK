App.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    
    initComponent: function() {
        Ext.apply(this, {
            items: [
                { xtype: 'App.views.GamesList', id: 'gamesList' },
                { xtype: 'App.views.GamesForm', id: 'gamesForm' },
				{ xtype: 'App.views.TablesForm', id: 'tablesForm' },
            ]
        });
        App.views.Viewport.superclass.initComponent.apply(this, arguments);
    },

    reveal: function(target, direction) {
		var animation = { type: 'slide' };
		if(!direction) {
			animation.direction = (target === 'gamesList') ? 'right' : 'left';
		} else if (direction == "up") {
			animation.cover = true;
		} else if (direction == "down") {
			animation.reveal = true;
		}
		animation.direction = direction;
        this.setActiveItem(App.views[target], animation);
    }
});