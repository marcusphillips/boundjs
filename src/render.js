(function(){
  var global = this;

  $.fn.render = function(scope){
    bound.render(this, scope);
    return this;
  };

  bound.render = function($node, scope){
    bound.autorun(function(){
      
      var handleContentsDirectives = function($node, scope) {
        var directive = $node.attr("contents");
        $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
      };

      var handleAttrDirectives = function($node, scope) {
        // get directives
        var directives = _.map(_.filter($node[0].attributes, function(attribute){
            return (/^attr/).test(attribute.name);
          }), function(attributes) {
            return {
              name: (attributes.name).slice(5),
              value: attributes.value
            };
          });
        // render
        _.each(directives, function(directive){
          $node.attr(directive.name, scope[directive.value]);  
        });
      };

      handleContentsDirectives($node, scope);
      handleAttrDirectives($node, scope);

    });
  };

}());

// the attribute to add = get it from HTML
// the value of the attribute = scope.attribute
// the $node to render against = $node

// if it has an "attr-foo=bar" block, then add a new attribute, "foo=bar"
//   in this case, the directive would be "foo, bar", and would have to be passed into a $node.attr() call (i.e. not a $node.html call);

// As a result, directive must be an array or object containing both the type of call required (or is this an if statement?) as well as the contents of that call