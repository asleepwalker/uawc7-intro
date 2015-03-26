$(function() {

	var PollModel = Backbone.Model.extend({
		defaults: {
			step: 'intro',
			question: 1
		},
		constructor: function() {
			var model = this;
			$.getJSON('data.json', function(data) {
				model.nodes = new Backbone.Collection(data.nodes);
				model.links = new Backbone.Collection(data.links);
			});
			Backbone.Model.apply(this, arguments);
		},
		getCurrentNode: function() {
			return this.nodes.get(this.get('question'));
		},
		getAvailableOptions: function() {
			return this.links.where({ source: this.get('question') });
		},
		setQuestion: function(id) {
			var target = this.nodes.get(id);
			this.set('question', target.get('id'));
			if (target.get('type') == 'result') {
				this.set('step', 'result');
			}
		}
	});

	var OptionView = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<button><%= text %></button>'),
		events: {
			'click button': 'selectOption',
		},
		initialize: function(params) {
			this.option = params.option;
			this.render();
			return this;
		},
		selectOption: function() {
			this.model.setQuestion(this.option.get('target'));
		},
		render: function() {
			this.$el.html(this.template(this.option.toJSON()));
		}
	});

	var PollView = Backbone.View.extend({
		template: _.template($('#question').html()),
		events: {
			'click button': 'selectOption'
		},
		initialize: function() {
			this.model.bind('change:question', _.bind(this.render, this));
			this.render();
		},
		render: function() {
			var question = this.model.getCurrentNode(),
				options = this.model.getAvailableOptions();
			this.$el.html(this.template(question.toJSON()));
			_.each(options, function(option) {
				var optionView = new OptionView({ model: this.model, option: option });
				this.$el.find('.options').append(optionView.el);
			}, this);
		}
	});

	var ResultView = Backbone.View.extend({
		template: _.template($('#result').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.getCurrentNode().toJSON()));
		}
	});

	var StageView = Backbone.View.extend({
		el: $('#stage'),
		initialize: function(options) {
			this.model.bind('change:step', _.bind(this.render, this));
			this.$el.find('button.start').click(function() {
				options.model.set('step','poll');
			});
		},
		render: function() {
			switch (this.model.get('step')) {
				case 'poll': {
					var pollView = new PollView({
						el: this.el,
						model: this.model
					});
					break;
				}
				case 'result': {
					var resultView = new ResultView({
						el: this.el,
						model: this.model
					});
				}
			}
		}
	});

	var pollModel = new PollModel(),
		stageView = new StageView({ model: pollModel });

});