(function(){
  var global = this;

  $.fn.boundRender = function(scope){
    bound.render(this, scope);
    return this;
  };

  bound.render = function($node, scope){
    bound.autorun(function(){
      var directive = $node.attr("contents");
      $node.html(bound(scope).ctrl('has', directive) ? scope.ctrl('get', directive) : bound('global', 'get', directive));
    });
  };

}());
