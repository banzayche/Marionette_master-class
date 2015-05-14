/*global Backbone */
'use strict';

// в данном случаем модуль содержит конструкторы относящиеся к представлению списка книг таблицей. 
var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	
	// представление для одного экземпляра книги из коллекции
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

	// представление - заглушка, для пустой коллекции
	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'empty-collection',
		template: '#noChildView-template',
	});

	// представление для панели управления списком книг
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

		// onShow - метод, который предоставляется Marionette.js и он позволяет производить взаимодействие с обьектом сразу после прорисовки
		// Это дает возможность, к примеру изменять атрибуты DOM элементов онтосящихся к этому представлению,
		// при этом, не опасаясь, что они еще не отрендерены.
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
	
	// CompositeView - специальное представление, предоставляемое Marionette.js, для представления коллекции
	// оно отображает элементы коллекции посредством поочередного добавления представления для каждой из моделей.
	// может иметь особое представление - заглушку, когда модели в коллекции отсутствуют
	// CompositeView самостоятельно поддерживает правдивое отображение коллекции, нам не нужно писать прослушку и рендер в ручную.
	listViews.BookListView = Backbone.Marionette.CompositeView.extend({
		tagName: 'table',
		className: 'table table-bordered',
		template: '#list-region-template',

		// childView - представление, которое используется, для отображения одной модели из коллекции 
		childView: listViews.BookItemView,
		// emptyView - представление, которое используется, для отображения заглушку, когда модели в коллекции отсутствуют 
		emptyView: listViews.NoChildView,

		initialize: function(){
			this.listenTo(MyLibrarryApp.request('filterState'), 'change:filter', this.render, this);
		},

		ui: {
			goSort : '.go-sort'
		},
		events: {
			'click @ui.goSort' : "sortOperation",
		},

		sortOperation: function(e){
			var sortAttribute = $(e.target).html().toLowerCase()
			this.collection.goSort(sortAttribute);
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
	
	// LayoutView - это представление дает возможность создавать подрегионы и оперировать ними
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
			// Обращаемся к региону, который содержится в текущем LayoutView и указываем представление для отображения
			this.getRegion('controlRegion').show(controlListBooks);
		},
		tableShow: function(){
			var tableListBooks = new MyLibrarryApp.listViews.BookListView({
				collection: this.collection,
			});
			// Обращаемся к региону, который содержится в текущем LayoutView и указываем представление для отображения
			this.getRegion('listRegion').show(tableListBooks);
		},
		tileShow: function(){
			var tileListBooks = new MyLibrarryApp.TileListViews.BookListView({
				collection: this.collection,
			});
			// Обращаемся к региону, который содержится в текущем LayoutView и указываем представление для отображения
			this.getRegion('listRegion').show(tileListBooks);
		}
	});
});