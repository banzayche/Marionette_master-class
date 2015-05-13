/*global Backbone */
'use strict';

var modelCollection = myLibrarryApp.module('modelCollection', function(modelCollection, MyLibrarryApp, Backbone){

	modelCollection.Book = Backbone.Model.extend({
		defaults:{
			'title': undefined,
			'author': undefined,
			'year': undefined,
			'description': 'Not specified.',
			'genre': undefined,
			'id': undefined
		},

		accordance: function(filterVal){
			if( this.get('genre') === filterVal ){
				return true;
			} else if( filterVal === 'all' ){
				return true;
			} else{
				return false;
			}
		},

		urlRoot: '/api/books'
	});

	modelCollection.CollectionBook = Backbone.Collection.extend({
		model: modelCollection.Book,

		sortAttribute: 'title',
		goSort: function( sortAttribute ){
			this.sortAttribute = sortAttribute;
			this.sort();
		},
		comparator: function( model ){
			return model.get( this.sortAttribute );
		},

		url: '/api/books'
	});
});