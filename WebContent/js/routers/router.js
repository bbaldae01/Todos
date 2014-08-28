var app = app || {};

var Workspace = Backbone.Router.extend({
	routes : {
		'*filter' : 'setFilter'
	},
	
	setFilter : function(param){
		//현재 사용디는 필터를 설정한다.
		app.TodoFilter = param || '';
		//각 Todo 뷰의 항목들을 숨김 여부를 나타내는
		//컬렉션 필터 이벤트를 트리거 시킨다.
		window.app.Todos.trigger('filter');
	}
});

app.TodoRouter = new Workspace();
Backbone.history.start();