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
		ui: {
			cancel : '#cancel'	
		},
		events: {
			'click @ui.cancel' : 'goCancel'
		},
		goCancel: function(){
			Backbone.history.navigate('home', {trigger:true, replace:true});
		}
	});



	staticViews.EditBookView = Backbone.Marionette.ItemView.extend({
		template: '#edit-book-template',

		model: MyLibrarryApp.modelCollection.Book,
		ui: {
			cancel: '#cancel',
			save: '#save',
			title: '#title',
			author: '#author',
			genre: '#genre',
			year: '#year',
			description: '#description',
			error: '.error'	
		},
		events: {
			'click @ui.cancel' : 'goCancel',
			'click @ui.save' : 'goSave'
		},
		goCancel: function(){
			Backbone.history.navigate('home', {trigger:true, replace:true});
		},
		goSave: function(){
			var title = this.ui.title.val().trim();
			var author = this.ui.author.val().trim();
			var year = this.ui.year.val().trim();
			var genre = this.ui.genre.val().trim();
			var description = this.ui.description.val().trim();
			

			if(title && author && year && genre){
				if(this.model.isNew()){
					MyLibrarryApp.GeneralCollection.create({
						title: title,
						author: author,
						year: year,
						genre: genre,
						description: description,
					});
					Backbone.history.navigate('home', {trigger:true, replace: true });
				} else{	
					var id = this.model.get('id');			
					MyLibrarryApp.GeneralCollection.get(id).save({
						title: title,
						author: author,
						year: year,
						genre: genre,
						description: description,
					}).done(function(){
						Backbone.history.navigate('home', {trigger:true, replace: true });
					});
				}				
			} else{
				this.ui.error.show();
			}
		},
	});
});