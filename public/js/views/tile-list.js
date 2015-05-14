/*global Backbone */
'use strict';

var TileListViews = myLibrarryApp.module('TileListViews', function(TileListViews, MyLibrarryApp, Backbone){
	
	TileListViews.BookItemView = Backbone.Marionette.ItemView.extend({
		className: 'item-book-tile col-sm-6 col-md-3 col-xs-6',
		template: '#tile-book-template',

		ui: {
			editBook: '#edit',
			deleteBook: '#delete'
		},
		events: {
			'click @ui.editBook' : 'goEdit',
			'click @ui.deleteBook' : 'goDelete',
			'dblclick' : 'goDetail'
		},

		goEdit: function(){
			Backbone.history.navigate('book/'+this.model.get('id')+'/edit', {trigger: true, replace: true});
		},
		goDetail: function(){
			Backbone.history.navigate('book/'+this.model.get('id')+'/detail', {trigger: true, replace: true});
		},
		goDelete: function(){
			this.model.destroy();
		}
	});

	TileListViews.NoChildView = Backbone.Marionette.ItemView.extend({
		template: '#tile-empty-collection',
	});

	TileListViews.BookListView = Backbone.Marionette.CompositeView.extend({
		template: '#tile-list',

		childView: TileListViews.BookItemView,
		emptyView: TileListViews.NoChildView,
	});
});