(function(){
  var global = this;

  $.fn.render = function(scope){
    // todo: should be able to render multiple dom nodes contained in this jquery object
    if(!arguments.length){ throw new Error('render requires a scope'); }
    bound.proxy(scope);
    var $that = this;
    bound.autorun(function(){
    _.each($that, function($nodeObject){
        directiveRenderCount++;
        // todo: all directive computations will share a context
        _.each(directiveProcessors, function(processor){
          processor($($nodeObject), scope);
        });
        _.each($($nodeObject).children(), function(child){
          $(child).render(scope);
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
        var args, directives, scopes = [];
        var htmlString = [];
        var directive = $node.attr("contents");

        if (Array.isArray(scope)) {
          scopes = scope;
        } else {
          scopes.push(scope);
        }

        if (directive) {
          directives = directive.split(" ");
        } else {
          bound.resetDirectiveRenderCount();
        }

        if(directives){
          _.each(directives, function(directive){
            _.each(scopes, function(scope){
              htmlString.push(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
            });
          });
          $node.html(htmlString.join(" "));
        } else {
          $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
        }
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
