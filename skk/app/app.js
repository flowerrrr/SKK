App = new Ext.Application({
    name: "SKK",

    launch: function() {
        this.views.viewport = new this.views.Viewport();

        this.views.gamesList = this.views.viewport.down('#gamesList');
        this.views.gamesForm = this.views.viewport.down('#gamesForm');
	}
});
