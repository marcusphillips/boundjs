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
      _.each(directiveProcessors, function(processor){
        processor($node, scope);
      });
    });
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
    }
>>>>>>> development
  };

}());
