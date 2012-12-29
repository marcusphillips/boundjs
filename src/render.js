(function(){
  var global = this;

  $.fn.render = function(scope){
    // todo: should be able to render multiple dom nodes contained in this jquery object
    var that = this;
    bound.autorun(function(){
      directiveRenderCount++;
      // todo: all directive computations will share a context
      _.each(directiveProcessors, function(processor){
        processor(that, scope);
      });
    });
    return this;
  };

  var directiveRenderCount = 0;
  bound.resetDirectiveRenderCount = function(){
    directiveRenderCount = 0;
  };

  bound.getDirectiveRenderCount = function(){
    return directiveRenderCount;
  };

  var directiveProcessors = {
    contents: function($node, scope) {
      // todo: what if there is no contents attribute?
      var directive = $node.attr("contents");
      $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
    },
    attr: function($node, scope) {
      _.each($node[0].attributes, function(attribute){
        if((/^attr/).test(attribute.name)) {
          $node.attr((attribute.name).slice("attr-".length), scope[attribute.value]);
        }
      });
    },
    addClass: function($node, scope) {
      var boundClasses = $node.attr("bound-classes");
      $node.removeClass();  // Will remove ALL classes; need test to ensure it doesn't
      $node.addClass(scope[boundClasses]);
    }
  };

}());
