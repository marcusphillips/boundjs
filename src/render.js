(function(global){
  "use strict";

  $.fn.render = function(namespace){
    bound.proxy(namespace);
    renderForScope(this, bound.scope.extend(namespace))
    return this;
  };

  var renderForScope = function($that, scope){
    B.depend(function(){
      $that.each(function(){
        var $node = $(this);
        var suppressRecursion;
        _.each(directiveProcessors, function(processor){
          var result = processor($node, scope) || {};
          result.scope && (scope = result.scope);
          result.suppressRecursion && (suppressRecursion = result.suppressRecursion);
        });
        suppressRecursion || $node.children().each(function(){
          renderForScope($(this), scope);
        });
      });
    });
    return this;
  };

  var directiveRenderCount = 0;
  B.resetDirectiveRenderCount = function(){
    directiveRenderCount = 0;
  };

  B.getDirectiveRenderCount = function(){
    return directiveRenderCount;
  };

  //TODO: add bound-checked and bound-loop
  var directiveProcessors = {
    contents: function($node, scope) {
      var key = $node.attr("bound-contents");
      if(key){
        var contents = scope.lookup(key);
        typeof contents === "string" ? $node.text(contents) : $node.html(contents);
        directiveRenderCount++;
        return {suppressRecursion: true};
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

}(this));
