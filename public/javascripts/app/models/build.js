Travis.Models.Build = Travis.Models.Base.extend({
  initialize: function(attributes, options) {
    Travis.Models.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'set', 'url', 'commit', 'color', 'duration', 'eta', 'toJSON');
    _.extend(this, options);

    this.repository = this.repository;
    if(!this.repository && this.collection) this.repository = this.collection.repository;
    if(!this.repository && Travis.app) this.repository = Travis.app.repositories.get(this.get('repository_id'));

    if(this.attributes.matrix) {
      this.matrix = new Travis.Collections.Builds(this.attributes.matrix, { repository: this.repository });
      this.matrix.each(function(build) { build.repository = this.repository }.bind(this)); // wtf
      delete this.attributes.matrix;
    }

    if(this.collection) {
      this.bind('change', function(build) { this.collection.trigger('change', this); });
    }
  },
  parent: function(callback) {
    if(this.get('parent_id')) this.collection.getOrFetch(this.get('parent_id'), callback);
  },
  appendLog: function(chars) {
    this.attributes.log = this.attributes.log + chars;
    this.trigger('append:log', chars);
  },
  url: function() {
    return '/builds/' + this.id;
  },
  commit: function() {
    var commit = this.get('commit');
    return commit ? commit.slice(0, 7) : '';
  },
  color: function() {
    var status = this.get('status');
    return status == 0 ? 'green' : status == 1 ? 'red' : null;
  },
  duration: function() {
    return Utils.duration(this.get('started_at'), this.get('finished_at'));
  },
  eta: function() {
    var startedAt  = this.get('started_at');
    var finishedAt = this.get('finished_at');
    var lastDuration = this.repository.get('last_duration');
    if(!finishedAt && lastDuration) {
      var timestamp = new Date(startedAt).getTime();
      var eta = new Date((timestamp + lastDuration));
      return eta.toISOString();
    }
  },
  toJSON: function() {
    var json = _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      duration: this.duration(),
      commit: this.commit(),
      eta: this.eta(),
      color: this.color(),
      repository: this.repository.toJSON(),
    });
    if(this.matrix) {
      json['matrix'] = this.matrix.toJSON();
    }
    if(this.get('config')) {
      json['config_table'] = _.map(this.get('config'), function(value, key) { return { key: key, value: value } } );
      json['config'] = _.map(this.get('config'), function(value, key) { return key + ': ' + value; } ).join(', ');
    }
    return json;
  }
});

Travis.Collections.Builds = Travis.Collections.Base.extend({
  model: Travis.Models.Build,
  initialize: function(models, options) {
    Travis.Collections.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url', 'dimensions', 'set');
    _.extend(this, options);
  },
  set: function(attributes) {
    if(attributes) {
      var build = this.get(attributes.id);
      build ? build.set(attributes) : this.add(new Travis.Models.Build(attributes, { repository: this.repository }));
    }
  },
  url: function() {
    return '/repositories/' + this.repository.id + '/builds' + Utils.queryString(this.args);
  },
  dimensions: function() {
    return this.models[0] ? _(this.models[0].get('config')).keys().map(function(key) { return _.capitalize(key) }) : [];
  },
  comparator: function(build) {
    // this sorts matrix child builds below their child builds, i.e. the actual order will be like: 4, 3, 3.1, 3.2, 3.3., 2, 1
    var number = parseInt(build.get('number'));
    var fraction = parseFloat(build.get('number')) - number;
    return number - fraction;
  }
});
