/*global Backbone */
'use strict';

var routerController = myLibrarryApp.module('routerController', function(routerController, MyLibrarryApp, Backbone){
	routerController.GeneralRouter = Backbone.Marionette.AppRouter.extend({
		appRoutes: {			
			'book/:id/edit': 'control404_edit',
			'book/:id/detail': 'control404_detail',
			'book/create': 'control404_edit',

			'*route' : 'RouterProcessing',			
		},	
	});

	routerController.GeneralController = Backbone.Marionette.AppRouter.extend({
		control404_edit: function(id){
			this.control404_part2(id,'edit')
		},
		control404_detail: function(id){
			this.control404_part2(id,'detail')
		},

		control404_part2: function(id, direction){
			var activeModel = new MyLibrarryApp.modelCollection.Book({ id: id });
			var there = this;
			activeModel.fetch({
				success: function(){
					if(direction === 'edit'){
						there.showEditBook(id, activeModel);
					} else {
						there.showDetailBook(id, activeModel);
					}
				},
				error: function(){
					Backbone.history.navigate('page-404', {trigger:true, replace: true });
				},
			});
		},

		RouterProcessing: function(route){
			console.log('I am work with');
			switch (route) {
				case null:
				case 'home':
					var there = this;
					there.showMain();
					there.showFooter_Header();
					break;
				default:
					Backbone.history.navigate('page-404', {trigger:false, replace: false});
					this.show404();
					this.showFooter_Header();
					break;
			}
		},
		// --------------------------------------------
		showEditBook: function(id, activeModel){
			console.log('edit book coming');
			var book = new MyLibrarryApp.staticViews.EditBookView({
				model: activeModel,
			});
			MyLibrarryApp.root.showChildView('main', book);

			this.showFooter_Header();
		},

		showDetailBook: function(id, activeModel){
			var book = new MyLibrarryApp.staticViews.DetailBookView({
				model: activeModel,
			});
			MyLibrarryApp.root.showChildView('main', book);

			this.showFooter_Header();
		},

		showFooter_Header: function(){
			var header = new MyLibrarryApp.staticViews.GeneralHeaderView();
			var footer = new MyLibrarryApp.staticViews.GeneralFooterView();

			MyLibrarryApp.root.showChildView('header', header);
			MyLibrarryApp.root.showChildView('footer', footer);
		},

		showMain: function(){
			var mainView = new MyLibrarryApp.listViews.mainLayoutView({
				collection: MyLibrarryApp.GeneralCollection,
			});

			MyLibrarryApp.root.showChildView('main', mainView);
		},

		show404: function(){
			var page_404 = new MyLibrarryApp.staticViews.NotFoundView();
			MyLibrarryApp.root.showChildView('main', page_404);
		},
	});

	$(document).ready(function(){
		var generalController = new routerController.GeneralController();
		var generalRouter = new routerController.GeneralRouter({
			controller: generalController,
		});
	});
});