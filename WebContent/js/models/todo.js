var app = app || {};

//todo model
//우리의 기본 Todo 모델은 title, order, completed 속성을 가진다.
app.Todo = Backbone.Model.extend({
	defaults: {
		title: '',
		completed: false
	},
	
	toggle: function(){
		this.save({
			completed: !this.get('completed')
		});
	}
});