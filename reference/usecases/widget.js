var $todoList1 = $('.todoListNode').output({
  remainingTaskCount: function(){
    return this.filter(function(){ return B(this, 'isComplete'); }).length;
  }
}).input({
  'click .done': function(){
    this.complete();
  }
}).render(todoList);

// or

var $TodoList = $.Widget('todoListTemplate').output({
  remainingTaskCount: function(){
    return this.filter(function(){ return B(this, 'isComplete'); }).length;
  }
}).input({
  'click .done': function(){
    this.complete();
  }
});

var $todoList2 = $TodoList(todoList);

/* design goals:
 * - important that the input and output functions be represented as objects, not functions, so that there is no stored state
 * - should be able to define an instance or a class of instances easily
 */
