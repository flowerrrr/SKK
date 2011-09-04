var debug = false;
if (debug) {
	Ext.is.iOS = true;
	Ext.is.Desktop = false;
}

App = new Ext.Application({
    name: "SKK",
	icon: 'img/favicon.png',

    launch: function() {
		App.stores.tables.init();

        this.views.viewport = new this.views.Viewport();

        this.views.gamesList = this.views.viewport.down('#gamesList');
        this.views.gamesForm = this.views.viewport.down('#gamesForm');
		this.views.tablesForm = this.views.viewport.down('#tablesForm');
		
		var developingForm = false;
		if (developingForm) {
			Ext.dispatch({
				controller: 'Games',
				action: 'newForm'
			});
		}

	}
});

App.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

window.onerror = errorHandler; 

function errorHandler(message, errorURL, lineNumber) {
	var outputMessage =
	"Message: " + message +
	"\nURL: " + errorURL +
	"\nLine Number: " + lineNumber;
	alert(outputMessage);
}
