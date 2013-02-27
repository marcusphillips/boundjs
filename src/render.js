(function(global){
  "use strict";

  $.fn.render = function(namespace){
    renderForScope(this, B.scope.extend(namespace));
    return this;
  };

  var renderForScope = function($that, scope){
    B.depend(function(){
      $that.each(function(){
        var $node = $(this);
        if($node.attr('bound-item-template') !== undefined){
          return;
        }
        var suppressRecursion;
        _.each([
          'log',
          'debug',
          'with-item',
          'with',
          'contents',
          'attr',
          'loop'
        ], function(processorName){
          var result = directiveProcessors[processorName]($node, scope) || {};
          scope = result.scope || scope;
          suppressRecursion = suppressRecursion || result.suppressRecursion;
        });
        // do not process bound-item-templates, they are only used to create item nodes in loop nodes
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

  var forDirective = function(suffix, processor){
    return function($node, scope){
      var key = $node.attr('bound-' + suffix);
      if(key !== undefined){
        directiveRenderCount++;
        return processor.apply(this, [key].concat(_.toArray(arguments)));
      }
    };
  };

  var directiveProcessors = {
    contents: forDirective('contents', function(key, $node, scope) {
        var contents = scope.lookup(key);
        typeof contents === "string" ? $node.text(contents) : $node.html(contents);
        return {
          suppressRecursion: true
        };
    }),

    attr: function($node, scope) {
      _.each($node[0].attributes, function(attribute){
        if((/^bound-attr-.+/).test(attribute.name)) {
          $node.attr(attribute.name.slice("bound-attr-".length), scope.lookup(attribute.value));
          directiveRenderCount++;
        }
      });
    },

    debug: forDirective('debug', function(key, $node, scope) {
      _.debug();
    }),

    log: forDirective('log', function(key, $node, scope) {
      _.log($node[0]);
    }),

    'with': forDirective('with', function(key, $node, scope) {
        var namespace = scope[/\d+/.test(key) ? 'index' : 'lookup'](key);
        return namespace ? {
          scope: scope.extend(namespace)
        } : {
          suppressRecursion: true
        };
    }),

    'with-item': forDirective('with-item', function(key, $node, scope) {
      var namespace = scope.index(key);
      return namespace ? {
        scope: scope.extend(namespace)
      } : {
        suppressRecursion: true
      };
    }),

    loop: forDirective('loop', function(key, $node, scope) {
        var items = scope.lookup(key);
        var $itemTemplate = $node.children().eq(0);
        _.raiseIf($itemTemplate.attr('bound-item-template') === undefined, 'The first child of a loop node must be annotated with the bound-item-template attribute');
        if(typeof items === 'object'){
          $node.innerHTML = '';
          $node.append($itemTemplate).append(B(items).map(function(item, index){
            return $itemTemplate.clone(true).removeAttr('bound-item-template').attr({
              'bound-with-item': index,
              'bound-item': ''
            });
          }));
        }else{
          _.raiseIf(items, 'Expected ' + key + ' to be enumerable.');
          $node.hide();
          return {
            // todo: make things like this a calls to this.suppressRecursion()
            suppressRecursion: true
          };
        }
        return {
          scope: scope.extend(items)
        };
    })

  };

}(this));
