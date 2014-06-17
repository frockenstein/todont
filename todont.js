// override sync to use localStorage
Backbone.sync = function(method, model) {
  model.set('id', model.cid);
  console.log(method + ': ' + JSON.stringify(model));
}

var ToDontView = Backbone.View.extend({

});

var ToDontListView = Backbone.View.extend({

});

var ToDont = Backbone.Model.extend({

  // default properties of the model
  defaults: {
    'title': 'No title',
    'completed': false,
    'dateCompleted': null
  }

});

var ToDontList = Backbone.Collection.extend({

  // specify the model that backs this collection
  model: ToDont,

  // filter to all completed items
  completed: function() {
    return this.filter(function(model) {
      return model.get('completed');
    });
  },

  // filter to all incomplete items
  uncompleted: function() {
    return this.filter(function(model) {
      return model.get('completed') === false
    });
  }
});

$(function(){
  // add/remove/complete items in view
  // show meta about list (remaining etc)
  // sync to localstorage
});