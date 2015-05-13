/*global Backbone */
'use strict';

var staticViews = myLibrarryApp.module('staticViews', function(staticViews, MyLibrarryApp, Backbone){
	staticViews.GeneralView = Backbone.Marionette.LayoutView.extend({
		el: '#general-template',
		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer'
		},

		initialize: function(){
			console.log('general view has been created');
		}
	});

	staticViews.GeneralHeaderView = Backbone.Marionette.ItemView.extend({
		className: 'container header-book',
		template: '#header-template'
	});

	staticViews.NotFoundView = Backbone.Marionette.ItemView.extend({
		className: 'page-404',
		template: '#page-404-template'
	});

	staticViews.GeneralFooterView = Backbone.Marionette.ItemView.extend({
		className: 'container footer-book',
		template: '#footer-template'
	});



	staticViews.DetailBookView = Backbone.Marionette.ItemView.extend({
		className: 'detail-book',
		template: '#book-detail-template',

		model: MyLibrarryApp.modelCollection.Book,
	});



	staticViews.EditBookView = Backbone.Marionette.ItemView.extend({
		template: '#edit-book-template',

		model: MyLibrarryApp.modelCollection.Book,
	});
});