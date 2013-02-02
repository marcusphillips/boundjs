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
        _.each([
          directiveProcessors.contents,
          directiveProcessors.attr,
          directiveProcessors.debug,
          directiveProcessors.loop,
          directiveProcessors['with']
        ], function(processor){
          var result = processor($node, scope) || {};
          scope = result.scope || scope;
          suppressRecursion = suppressRecursion || result.suppressRecursion;
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
        return {
          suppressRecursion: true
        };
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
      var key = $node.attr("bound-with");
      if(key){
        directiveRenderCount++;
        var namespace = scope.lookup($node.attr("bound-with"));
        return namespace ? {
          scope: scope.extend(namespace)
        } : {
          suppressRecursion: true
        };
      }
    },

    // todo: don't throw away the item template node - must still be the first node after this render() is done
    // todo: make sure we don't render the item template node
    // todo: make sure we don't clobber the existing bound-with property
    // todo: make sure we get rid of the previously-added nodes
    loop: function($node, scope) {
      var namespace = $node.attr("bound-loop");
      if(namespace){
        debugger
        var items = scope.lookup(namespace);
        var $itemTemplate = $node.children().eq(0);
        if(typeof items === 'object'){
          $node.append(B(items).map(function(item, index){
            debugger;
            return $itemTemplate.clone().attr({'bound-with': index});
          }));
        }else{
          _.raiseIf(!items, 'Expected ' + namespace + ' to be enumerable.');
          $node.hide();
        }
      }
    }
  };

}(this));
