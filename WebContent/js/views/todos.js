var app = app || {};

//todo 항목을 나타내는 DOM 요소
app.TodoView = Backbone.View.extend({
	//목록을 나타내는 리스트 태그
	tagName: 'li',
	
	//단일 항목을 위한 템플릿 함수 캐시
	template: _.template($('#item-template').html()),
	
	//Todo 를 제어하는 DOM 이벤트
	events: {
		'click .toggle' : 'togglecompleted', //신규
		'dblclick label' : 'edit',
		'click .destroy' : 'clear', //신규
		'keypress .edit' : 'updateOnEnter',
		'blur .edit' : 'close'
	},
	
	//TodoView 는 모델이나 렌더링의 변경을 감지하기 위해 리스닝하고 있다.
	//TODO 와 TodoView 는 1:1 로 매칭 되기 때문에
	//편의상 모델을 직접 참조하도록 설정한다.
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);//신규
		this.listenTo(this.model, 'visible', this.toggleVisible);//신규
	},
	
	//todo 항목의 제목을 렌더링
	render: function(){
		this.$el.html(this.template(this.model.toJSON())); 
		
		this.$el.toggleClass('completed', this.model.get('completed')); //신규
		this.toggleVisible();//신규
		
		this.$input = this.$('.edit');
		return this;
	},
	
	//신규 - 이 함수를 이용해서 항목을 보여주거나 숨긴다.
	toggleVisible: function(){
		this.$el.toggleClass('hidden', this.isHidden());
	},
	
	//신규 - 이 항목을 숨길 것인지 결정
	isHidden: function(){
		var isCompleted = this.model.get('completed');
		
		return( //가시성이 숨김으로 표시된 경우
			(!isCompleted && app.TodoFilter === 'completed')
			|| (isCompleted && app.TodoFilter === 'active')
		);
	},
	
	//신규 - 항목의 상태를 "completed" 로 변경
	togglecompleted: function(){
		this.model.toggle();
	},
	
	//"editing" 모드로 변경 되었을 때, input 필드를 보여주고 포커스 이동한다.
	edit: function(){
		this.$el.addClass('editing');
		this.$input.focus();
	},
	
	//editing 모드에서 나오고, 변경된 todo 항목을 저장한다.
	close: function(){
		var value = this.$input.val().trim();
		
		if(value){
			this.model.save({title : value});
		}else{
			this.clear(); //신규
		}
		
		this.$el.removeClass('editing');
	},
	
	//엔터키를 누르면 편집을 중단한다.
	updateOnEnter: function(e){
		if(e.which === ENTER_KEY){
			this.close();
		}
	},
	
	//신규 - 항목을 제거하고 localStorage 에서 모델을 삭제 하고 뷰를 제거 한다.
	clear: function(){
		this.model.destroy();
	}
});