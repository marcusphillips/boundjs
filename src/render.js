(function(){
  var global = this;

  $.fn.render = function(scope){
    bound.render(this, scope);
    return this;
  };

  var directiveRenderCount = 0;
  bound.resetDirectiveRenderCount = function(){
    directiveRenderCount = 0;
  };

  bound.getDirectiveRenderCount = function(){
    return directiveRenderCount;
  };

  bound.render = function($node, scope){
    bound.autorun(function(){
      directiveRenderCount++;
      var directive = $node.attr("contents");
      $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive)); // last eval is global.bound
    });
  };

}());
