(function(){
  var global = this;

  $.fn.render = function(scope){
    bound.render(this, scope);
    return this;
  };

  bound.render = function($node, scope){
    bound.autorun(function(){
      var directive = $node.attr("contents");
      $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
    });
  };

}());
