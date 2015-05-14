/*global Backbone */
'use strict';

// в данном случаем модуль содержит конструкторы относящиеся к представлению списка книг плиткой. 
var TileListViews = myLibrarryApp.module('TileListViews', function(TileListViews, MyLibrarryApp, Backbone){
	
	// представление для одного экземпляра книги из коллекции
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

	// представление - заглушка, для пустой коллекции
	TileListViews.NoChildView = Backbone.Marionette.ItemView.extend({
		template: '#tile-empty-collection',
	});

	// CompositeView - специальное представление, предоставляемое Marionette.js, для представления коллекции
	// оно отображает элементы коллекции посредством поочередного добавления представления для каждой из моделей.
	// может иметь особое представление - заглушку, когда модели в коллекции отсутствуют
	// CompositeView самостоятельно поддерживает правдивое отображение коллекции, нам не нужно писать прослушку и рендер в ручную.
	TileListViews.BookListView = Backbone.Marionette.CompositeView.extend({
		template: '#tile-list',

		childView: TileListViews.BookItemView,
		emptyView: TileListViews.NoChildView,

		initialize: function(){
			this.listenTo(MyLibrarryApp.request('filterState'), 'change:filter', this.render, this);
		},

		// addChild - это стандартный метод прорисовки моделей из коллекции для CompositeView и CollectionView
		// -----изменение стандартного метода-------
		addChild: function(childModel){
			var newFilter = MyLibrarryApp.request('filterState').get('filter');
			if(childModel.accordance(newFilter)){
				// стандартный метод прорисовки моделей
				Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
			}
		},
		// -----/изменение стандартного метода-------
	});
});