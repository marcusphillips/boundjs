(function(){
  var global = this;

  var bound = function(){};

  $.fn.bound = function(context){
    render(this, context);
  };

  var render = function($node, context){
    // ...?
  };

  global.bound = bound;
}());
