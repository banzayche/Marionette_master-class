/*global Backbone */
'use strict';

var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	listViews.BookItemView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'book-tr',
		template: '#book-template',

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

	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'empty-collection',
		template: '#noChildView-template',
	});

	listViews.ControlForList = Backbone.Marionette.ItemView.extend({
		template: '#control-list-region-template',
		ui:{
			goVariantListView: '#goVariantList',
			genreContainer: '#filter-atributes-container',
			createBook: '#createBook',
			genreSpan: '.filter-genre'
		},
		events: {
			'click @ui.createBook' : 'goCreateBook',
			'click @ui.genreSpan' : 'setFilterAttribute',
			'click @ui.goVariantListView' : 'goVariantListView',
		},

		onShow: function(){
			this.showFilter();
			this.togleIconVariant();
		},

		showFilter: function(){
			var self = this;
			var pluckOBJ = _.pluck(self.collection.toJSON(), 'genre');
			var filter = _.uniq(pluckOBJ);
			for(var i = 0; i<filter.length; i++){
				self.ui.genreContainer
					.append('<li><a class="filter-genre">'+filter[i]+'</a></li>');
			}
		},

		goVariantListView: function(){
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				MyLibrarryApp.request('filterState').set('list_type', 'table');
			} else{
				MyLibrarryApp.request('filterState').set('list_type', 'tile');
			}
		},

		togleIconVariant: function(){
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				this.ui.goVariantListView.removeClass('glyphicon-th');
				this.ui.goVariantListView.addClass('glyphicon-th-list');
			} else{
				this.ui.goVariantListView.removeClass('glyphicon-th-list');
				this.ui.goVariantListView.addClass('glyphicon-th');
			}
		},

		goCreateBook: function(){
			Backbone.history.navigate('book/create', {trigger: true, replace: true});
		},
		setFilterAttribute: function(e){
			var attrFilter = $(e.target).html();
			myLibrarryApp.request('filterState').set('filter', attrFilter)
		},
	});

	listViews.BookListView = Backbone.Marionette.CompositeView.extend({
		tagName: 'table',
		className: 'table table-bordered',
		template: '#list-region-template',

		childView: listViews.BookItemView,
		emptyView: listViews.NoChildView,
	});

	listViews.mainLayoutView = Backbone.Marionette.LayoutView.extend({
		className: 'table-responsive',
		template: '#book-list-layout-template',
		regions: {
			listRegion: '#list-region',
			controlRegion: '#control-region',
		},
		initialize: function(){
			this.listenTo(MyLibrarryApp.request('filterState'), 'change:list_type', this.choiceVariant, this);
		},

		onShow: function(){
			this.choiceVariant();
		},
		choiceVariant: function(){
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				this.tileShow();
			} else{
				this.tableShow();
			}
			var controlListBooks = new MyLibrarryApp.listViews.ControlForList({
				collection: this.collection,
			});
			this.getRegion('controlRegion').show(controlListBooks);
		},
		tableShow: function(){
			var tableListBooks = new MyLibrarryApp.listViews.BookListView({
				collection: this.collection,
			});
			this.getRegion('listRegion').show(tableListBooks);
		},
		tileShow: function(){
			var tileListBooks = new MyLibrarryApp.TileListViews.BookListView({
				collection: this.collection,
			});
			this.getRegion('listRegion').show(tileListBooks);
		}
	});
});