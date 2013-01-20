(function(global){
  "use strict";

  $.fn.render = function(namespace){
    bound.proxy(namespace);
    bound.autorun(function(){
      this.each(function(){
        var $node = $(this);
        var suppressRecursion;
        // todo: all directive computations will share a context
        _.each(directiveProcessors, function(processor, key){
          var result = processor($node, namespace) || {};
          if(result.scope){
            namespace = result.scope;
          }
          if(result.suppressRecursion){
            suppressRecursion = result.suppressRecursion;
          }
        });
        suppressRecursion || $node.children().each(function(){
          $(this).render(namespace);
        });
      });
    }, this);
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
      var key = $node.attr("bound-contents");
      if(key){
        var contents = bound.proxy(namespace).bound('has', key) ? namespace.bound('get', key) : window.bound('get', key);
        typeof contents === "string" ? $node.text(contents) : $node.html(contents);
        directiveRenderCount++;
        return {suppressRecursion: true};
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

    debug: function($node, scope) {
      _.debug( $node.attr('debug') !== undefined );
    },

    'with': function($node, scope) {
      return {
        scope: $node.attr("bound-with") ? scope[$node.attr("bound-with")] : scope
      };
    }
  };

}(this));
