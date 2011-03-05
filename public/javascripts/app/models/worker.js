Travis.Models.Worker = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

Travis.Collections.Workers = Backbone.Collection.extend({
  model: Travis.Models.Worker,
  initialize: function(workers, options) {
    _.bindAll(this, 'add', 'remove');
  },
  url: '/workers',
  remove: function(attributes) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(attributes.id)]);
  },
  load: function(callback) {
    Backbone.sync('read', this, function(models, status, xhr) {
      _.each(models, function(model) { if(!this.get(model.id)) { this.add(model, { silent: true }); } }.bind(this));
      if(callback) callback(this);
    }.bind(this));
  },
  comparator: function(worker) {
    return worker.get('id');
  }
});


