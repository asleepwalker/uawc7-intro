(function() {

	var nodes, links;

	$.getJSON('data.json', function(data) {
		nodes = new Backbone.Collection(data.nodes);
		links = new Backbone.Collection(data.links);
	});

})();