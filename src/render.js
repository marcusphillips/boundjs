(function(){
  var global = this;

  $.fn.render = function(namespace){
    bound.proxy(namespace);
    renderForScope(this, bound.scope.extend(namespace))
    return this;
  };

  var renderForScope = function($that, scope){
    bound.autorun(function(){
      $that.each(function(){
        var $node = $(this);
        _.each(directiveProcessors, function(processor){
          var result = processor($node, scope) || {};
          if(result.scope){
            scope = result.scope;
          }
        });
        $node.children().each(function(){
          renderForScope($(this), scope);
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
    contents: function($node, scope) {
      var key = $node.attr("bound-contents");
      if(key){
        var contents = scope.lookup(key);
        typeof contents === "string" ? $node.text(contents) : $node.html(contents);
        directiveRenderCount++;
      }
    },

    attr: function($node, scope) {
      _.each($node[0].attributes, function(attribute){
        if((/^bound-attr-.+/).test(attribute.name)) {
          $node.attr(attribute.name.slice("bound-attr-".length), scope.lookup(attribute.value));
          directiveRenderCount++;
        }
      });
    },

    debug: function($node, scope) {
      _.debug( $node.attr('debug') !== undefined );
    },

    'with': function($node, scope) {
      if($node.attr("bound-with")){
        directiveRenderCount++;
        return {
          scope: scope.extend(scope.lookup($node.attr("bound-with")))
        };
      }
    }
  };

}());
