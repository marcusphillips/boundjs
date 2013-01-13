(function(){
  var global = this;

  $.fn.render = function(namespace){
    // todo: should be able to render multiple dom nodes contained in this jquery object
    
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
      var directive = $node.attr("contents");

      if(directive){
        htmlString = bound.proxy(namespace).bound('has', directive) ? namespace.bound('get', directive) : bound('get', directive);
        $node.html(htmlString);
        directiveRenderCount++;
      }
    },

    attr: function($node, namespace) {
      _.each($node[0].attributes, function(attribute){
        if((/^attr/).test(attribute.name)) {
          $node.attr((attribute.name).slice("attr-".length), namespace[attribute.value]);
        }
      });
    },

    'class': function($node, namespace) {
      var boundClasses = $node.attr("bound-classes");
      $node.removeClass();  // Will remove ALL classes; need test to ensure it doesn't
      $node.addClass(namespace[boundClasses]);
    }
  };

}());
