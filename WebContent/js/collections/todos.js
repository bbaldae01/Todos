var app = app || {};

var TodoList = Backbone.Collection.extend({
	model:app.Todo,
	
	//"todos-backbone" 네임스페이스 아래 모든 todo 항목들을 저장한다.
	//이 작업을 위해서는 이페이지에는
	//Backbone localstorage 플러그인이 필요하다.
	//콘솔에서 테스트가 필요한 경우에는 에러를 피하기 위해 다음 라인을 주석처리해야한다.
	localStorage: new Backbone.LocalStorage('todos-backbone'),
	
	//완료된 모든 todo 항목들을 추려낸다.
	completed:  function(){
		return this.filter(function(todo){
			return todo.get('completed');
		});
	},
	
	//완료되지 않은 todo 항목들의 목록만 추려낸다.
	remaining: function(){
		//apply 이 함수의 스코프 내에 this 를 정의 할 수 있도록 해준다.
		return this.without.apply(this, this.completed());
	},
	
	//데이터 베이스 내에 특별한 순서 없이 저장이 되었따고 해도 순번 유지 가능.
	//이는 새로운 항목을 위해 다음 순번을 생성
	nextOrder: function(){
		if(!this.length){
			return 1;
		}
		return this.last().get('order')+1;
	},
	
	//Todo 는 삽입된 순서대로 정렬된다.
	comparator: function(todo){
		return todo.get('order');
	}
});

app.Todos = new TodoList();

//컬렉션의 completed() 와 remainig() 메서드는 완료 되거나 완료되지 않은 Todo 목록을 배열로 반환한다.
/*
 * 컬렉션에 혼합된 Underscore
 * this.filter
 * 
 * 
 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
	=> [2, 4, 6]

 * 
 * this.without
 * 
 * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
	=> [2, 3, 4]

 * 
 * this.last
 * 
 * _.last([5, 4, 3, 2, 1]);
	=> 1
 */