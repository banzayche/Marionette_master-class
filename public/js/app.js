/*global Backbone */
'use strict';

// Создадим конструктор для нашего главного объекта приложения
var MyLibrarryApp = Marionette.Application.extend({
	// Метод onStart предоставляет Mаrionette.js и он дает нам возможность взаимодействывать
	// с объектом приложения, во время его старта
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
		// присваиваем главное (рутовое) представление,
		// это и есть главный "холст" на котором мы будем прорисовывать наше приложение
		this.root = new this.staticViews.GeneralView();
	}
});

// создадим глобальный объект приложения
window.myLibrarryApp = new MyLibrarryApp();

// эта функция, по сути, является самостоятельным модулем, но, для удобства связи мы отнесли ее к нашему 
// обьекту приложения и с помощью предоставляемых Marionette.js методов "запрос-ответ" в последующем 
// организуем работу с моделью filterState, внутри этой функции
(function(){
	var filterState = new Backbone.Model({
		filter: 'all',
		list_type: 'table'
	});

	myLibrarryApp.reqres.setHandler('filterState', function(){
		return filterState;
	});
})();