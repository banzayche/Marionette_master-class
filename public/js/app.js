/*global Backbone */
'use strict';

var MyLibrarryApp = Marionette.Application.extend({
	onStart: function(){
		this.setRootLayout();
		
		this.GeneralCollection = new this.modelCollection.CollectionBook();
		this.GeneralCollection
			.fetch()
			.done(function(){
				Backbone.history.start({pushState: true});
			});
	},

	setRootLayout: function(){
		this.root = new this.staticViews.GeneralView();
	}
});

window.myLibrarryApp = new MyLibrarryApp();

(function(){
	var filterState = new Backbone.Model({
		filter: 'all',
		list_type: 'table'
	});

	myLibrarryApp.reqres.setHandler('filterState', function(){
		return filterState;
	});
})();