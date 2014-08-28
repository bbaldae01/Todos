var app = app || {};

app.AppView = Backbone.View.extend({
	
	//새로운 엘리먼트를 만드는 대신에 기존의 HTML 에 존재하는 el 을 바인딩 한다.
	el: '#todoapp',
		
	//애플리케이션 하단에 있는 통계 정보 출력란에 필요한 템플릿.
	statsTemplate: _.template($('#stats-template').html()),
	
	//신규: 새로운 아이템이 만들어질때 발생하는 이벤트나 아이템이 완료되엇을때 발생되는 이벤트의 처리를 위임한다.
	events: {
		'keypress #new-todo' : 'createOnEnter',
		'click #clear-completed' : 'clearCompleted',
		'click #toggle-all' : 'toggleAllComplete'
	},
	
	
	//initialize에서 항목이 추가되거나 변경될 때 필요한 'Todos' 컬렉션에 관련이벤트를 바인딩한다.
	initialize: function(){
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');
		
		//add 이벤트가 발생되면 addOne() 메서드가 호출 되고, 새로운 모델이 전달 된다. addOne() 메서드는 TodoView 의 인스턴스를 생성하고 렌더링하며, Todo 목록에 뷰를 추가한다.
		this.listenTo(app.Todos, 'add', this.addOne);
		//reset 이벤트가 호출되면 addAll 메서드가 호출 되고, Todo 항목들이 모두 반복되면서 개별 항목별로 addOne 메서드를 호출 한다.
		this.listenTo(app.Todos, 'reset', this.addAll);
		
		//신규
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);
		
		app.Todos.fetch();
	},
	
	//신규 통계 정보를 갱신하기 위해 어플리케이션을 다시 렌더링한다. 애플리케이션의 다른 부분은 변경이 없다.
	render: function (){
		var completed = app.Todos.completed().length;
		var remaining = app.Todos.remaining().length;
		
		if(app.Todos.length){
			this.$main.show();
			this.$footer.show();
			
			this.$footer.html(this.statsTemplate({
				completed : completed,
				remaining : remaining
			}));
			
			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/'+(app.TodoFilter || '')+'"]')
				.addClass('selected');
		}else{
			this.$main.hide();
			this.$footer.hide();
		}
		
		this.allCheckbox.checked = !remaining;
	},
	
	//항목을 추가하기 위한 뷰를 생성해서, 목록에서 단일 todo 항목을 추가하고 뷰를 <ul> 태그에 덧붙인다.
	addOne: function (todo){
		var view = new app.TodoView({model:todo});
		$('#todo-list').append(view.render().el);
	},
	
	//Todos 컬렉션에 있는 모든 아이템을 한번에 추가 한다.
	addAll: function (){
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},
	
	//신규
	filterOne: function(todo){
		todo.trigger('visible');
	},
	
	//신규
	filterAll: function(todo){
		app.Todos.each(this.filterOne, this);
	},
	
	//신규
	//새로운 todo 항목을 위한 속성을 생성한다.
	newAttributes: function(){
		alert(app.Todos.nextOrder());
		return{
			title: this.$input.val().trim(),
			order: app.Todos.nextOrder(),
			completed: false
		};
	}, 
	
	//신규
	//input 필드에서 'return' 키를 누르면
	//새로운 Todo 모델을 만들고 이를 localStorage 에 저장한다.
	createOnEnter: function(event){
		if(event.which != ENTER_KEY || !this.$input.val().trim()){
			return;
		}
		
		app.Todos.create(this.newAttributes());
		this.$input.val('');
	},
	
	//신규
	//완료된 Todo 항목들을 모두 삭제 하고, 모델도 삭제 한다.
	clearCompleted: function(){
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},
	 
	//신규
	toggleAllComplete: function(){
		 var completed = this.allCheckbox.checked;
		 
		 app.Todos.each(function(todo){
			 todo.save({
				 'completed' : completed
			 });
		 });
	}
	
});

/*
//Invoke
_.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
=> [[1, 5, 7], [1, 2, 3]]
*/