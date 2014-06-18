$(function() {

  var ToDont = Backbone.Model.extend({
    defaults: {
      'title': "Ain't no titles here",
      'dirtydog': false
    }
  });

  var ToDontList = Backbone.Collection.extend({

    model: ToDont,

    initialize: function() {
      this.listenTo(this, 'change destroy', this.sync);
    },

    done: function() {
      return this.filter(function(model) {
        return model.get('dirtydog') === true;
      });
    },

    undone: function() {
      return this.filter(function(model) {
        return model.get('dirtydog') === false;
      });
    },

    left: function() {
      return this.models.length - this.done().length;
    },

    // delegate to localStorage for saves
    sync: function() {
      if (this.models.length === 0) localStorage.removeItem('todont');
      else localStorage['todont'] = JSON.stringify(this.toJSON());
    }
  });

  var ToDontView = Backbone.View.extend({

    // tag for new item
    tagName: 'li',

    // cache the template func
    template: _.template($('#todont').html()),

    events: {
      'click input[type=checkbox]': 'toggle',
      'click a': 'destroy'
    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.append(html);
      if (this.model.get('dirtydog')) {
        this.$el.addClass('dirtydog');
        this.$el.find('input').attr('checked', true);
      }
      return this;
    },

    toggle: function(e) {
      this.model.set('dirtydog', e.target.checked);
      this.$el.toggleClass('dirtydog');
    },

    destroy: function(e) {
      e.preventDefault();
      this.model.destroy();
    }
  });

  var AppView = Backbone.View.extend({

    // bind to existing DOM
    el: $('body'),

    events: {
      'keypress input[name=entry]': 'create'
    },

    initialize: function() {

      // cache these since they're used repeatedly
      this.$ul = this.$('ul');
      this.$header = this.$('header');
      this.$meta = this.$('#meta');

      this.donts = new ToDontList();
      this.listenTo(this.donts, 'add destroy', this.render);
      this.listenTo(this.donts, 'all', this.reckoning);
      this.listenTo(this.donts, 'all', this.meta);

      // nothing stored - seed data
      if (localStorage['todont'] == null) {
        this.donts.add(new ToDont({ title: "Covet thy neighbor's shizz" }));
        this.donts.add(new ToDont({ title: "Worship graven images" }));
        this.donts.add(new ToDont({ title: "Pick thy nose" }));
      }
      else {
        var items = JSON.parse(localStorage['todont']);
        _.each(items, function(item) {
          this.donts.add(new ToDont(item));
        }, this);
        this.meta();
      }
    },

    render: function() {
      this.$ul.empty();
      this.donts.each(function(todont){
        var view = new ToDontView({ model: todont });
        this.$ul.append(view.render().el);
      }, this); // note the passed in context
    },

    reckoning: function() {
      this.$header.empty();
      if (this.donts.left() == 0) this.$header.html('<h2>You dirty dog!</h2>');
    },

    meta: function() {
      this.$meta.empty();
      this.$meta.html('Saved: <code>' + JSON.stringify(this.donts.toJSON()) + '</code>');
    },

    create: function(e) {
      if (e.keyCode !== 13) return;
      this.donts.add(new ToDont({ title: e.target.value }));
      e.target.value = '';
    }
  });

  var app = new AppView();

});