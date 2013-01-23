(function(global){
  "use strict";

  $.fn.render = function(namespace){
    bound.proxy(namespace);
    renderForScope(this, bound.scope.extend(namespace));
    return this;
  };

  var renderForScope = function($that, scope){
    B.depend(function(){
      $that.each(function(){
        var $node = $(this);
        var suppressRecursion;
        _.each([directiveProcessors.contents,
          directiveProcessors.attr,
          directiveProcessors.debug,
          directiveProcessors.loop,
          directiveProcessors['with']
        ], function(processor){
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
      var namespace = $node.attr("bound-with");
      if(namespace){
        directiveRenderCount++;
        return {
          scope: scope.extend(scope.lookup($node.attr("bound-with")))
        };
      }
    },

    // todo: don't throw away the item template node - must still be the first node after this render() is done
    // todo: make sure we don't render the item template node
    // todo: make sure we don't clobber the existing bound-with property
    // todo: make sure we get rid of the previously-added nodes
    loop: function ($node, scope, isRecursing) {
      var namespace = $node.attr('bound-loop');
      if (namespace) {
        var scopeItems = scope.lookup(namespace);
        var $itemTemplate = $node.children().eq(0);
        var newNodes = [];
        if (typeof scopeItems === 'object') {
          newNodes.push(B(scopeItems).map(function (item, i) {
            return $itemTemplate.clone().render(item);
          }));
          B(newNodes[0]).each(function (childNode, i, newNodes) {
            $node.append(childNode);
          });
        } else {
          _.raiseIf(!scopeItems, 'Expected ' + namespace + ' to be enumerable.');
          $node.hide();
        }
        return {suppressRecursion: true};
      }
    }
  };

}(this));
