(function(){
  var global = this;

  $.fn.boundRender = function(scope){
    bound.render(this, scope);
    return this;
  };

  bound.render = function($node, scope){
    scope.get = function(key) {
      if (bound.Context.current !== null) {
        scope.listeners.push(bound.Context.current);
      } 
      return scope[key];
    };
    scope.changed = function(key) {

    };
    scope.ctrl = function(){
      for ( i = 0; i < scope.listeners.length; i++) {
        scope.listeners[i].invalidate();
      }
    };

    scope.listeners = scope.listeners || [];

    bound.autorun(function() {
      var key = $node.attr("contents");
      $node.html(key in scope ? scope.get(key) : global[key]);
    });
  };

}());
