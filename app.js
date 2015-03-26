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
			return { id: 1, text: 'Задание первое.' };
		},
		getAvailableOptions: function() {
			return [];
		}
	});

	var PollView = Backbone.View.extend({
		template: _.template($('#question').html()),
		events: {
			'click button.next': 'selectOption'
		},
		initialize: function() {
			this.model.bind('change:question', _.bind(this.render, this));
		},
		selectOption: function() {
			
		},
		render: function() {
			var question = this.model.getCurrentNode(),
				options = this.model.getAvailableOptions();
			this.$el.html(this.template(_.extend(question, options)));
		}
	});

	var ResultView = Backbone.View.extend({
		template: _.template($('#result').html()),
		render: function() {
			this.$el.html(this.template(this.model.getCurrentNode()));
		}
	});

	var StageView = Backbone.View.extend({
		el: $('#stage'),
		initialize: function(options) {
			this.model.bind('change:step', _.bind(this.render, this));
			this.$el.find('button.start').click(function() {
				options.model.set({ step: 'poll' });
			});
		},
		render: function() {
			switch (this.model.get('step')) {
				case 'poll': {
					var pollView = new PollView({
						el: this.el,
						model: this.model
					});
					pollView.render();
					break;
				}
				case 'result': {
					var resultView = new ResultView({
						el: this.el,
						model: this.model
					});
					resultView.render();
				}
			}
		}
	});

	var pollModel = new PollModel(),
		stageView = new StageView({ model: pollModel });

});