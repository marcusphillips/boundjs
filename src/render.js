(function(){
  var global = this;

  $.fn.render = function(namespace){
    if (!namespace) throw true;
    bound.proxy(namespace);
    var $that = this;
    bound.autorun(function(){
      $that.each(function(){
        var $node = $(this);
          // todo: all directive computations will share a context
        _.each(directiveProcessors, function(processor){
          processor($node, namespace);
        });
        $node.children().each(function(){
          $(this).render(namespace);
        });
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
    contents: function($node, namespace) {
      var directive = $node.attr("bound-contents");
      if(directive){
        var contents = bound.proxy(namespace).bound('has', directive) ? namespace.bound('get', directive) : bound('get', directive);
        typeof contents === "string" ? $node.text(contents) : $node.html(contents);
        directiveRenderCount++;
      }
    },

    attr: function($node, namespace) {
      _.each($node[0].attributes, function(attribute){
        if((/^bound-attr-.+/).test(attribute.name)) {
          $node.attr((attribute.name).slice("bound-attr-".length), namespace[attribute.value]);
          directiveRenderCount++;  
        }
      });
    },

    'class': function($node, namespace) {
      var boundClasses = $node.attr("bound-classes");
      $node.removeClass();
      $node.addClass(namespace[boundClasses]);
      // directiveRenderCount++;
    }
  };

}());
