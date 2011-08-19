App.views.TablesForm = Ext.extend(Ext.form.FormPanel, {

    initComponent: function(){
        var titlebar, doneButton;

        doneButton = {
            text: 'Fertig',
            ui: 'done',
            handler: this.onSaveAction,
            scope: this
        };

        titlebar = {
            id: 'formTitlebar',
            xtype: 'toolbar',
            title: 'Spieler',
            items: [ { xtype: 'spacer' }, doneButton ]
        };

		fields = [
			{
				xtype: 'textfield',
				label: 'Spieler 1',
				name: 'p1',
			},
			{
				xtype: 'textfield',
				label: 'Spieler 2',
				name: 'p2',
			},
			{
				xtype: 'textfield',
				label: 'Spieler 3',
				name: 'p3',
			},
			{
				xtype: 'textfield',
				label: 'Spieler 4',
				name: 'p4',
			},
		];

        Ext.apply(this, {
            scroll: 'vertical',
            dockedItems: [ titlebar ],
			items: [ fields ]
        });

        App.views.TablesForm.superclass.initComponent.call(this);
    },
		
    onSaveAction: function() {
		var model = this.getRecord();
		
        Ext.dispatch({
			controller: 'Tables',
			action: 'update',
			data: this.getValues(),
			record: model
		});
    }

});

Ext.reg('App.views.TablesForm', App.views.TablesForm);