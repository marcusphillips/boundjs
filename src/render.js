(function(){
  var global = this;

  $.fn.boundRender = function(context){
    bound.render(this, context);
    return this;
  };

  bound.render = function($node, context){
  };

}());
