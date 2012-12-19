(function(){
  var global = this;

  $.fn.render = function(scope){
    // todo: should be able to render multiple dom nodes contained in this jquery object
    if(!arguments.length){ throw new Error('render requires a scope'); }
    bound.proxy(scope);
    var $that = this;
    bound.autorun(function(){
      directiveRenderCount++;
      // todo: all directive computations will share a context
      _.each(directiveProcessors, function(processor){
        processor($that, scope);
      });
      _.each($that.children(), function(child){
        $(child).render(scope);
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
      var directive = $node.attr("contents");
      if(directive){
        $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
      }

    },
    attr: function($node, scope) {
      _.each($node[0].attributes, function(attribute){
        if((/^attr/).test(attribute.name)) {
          $node.attr((attribute.name).slice("attr-".length), scope[attribute.value]);
        }
      });
    }
  };

}());
