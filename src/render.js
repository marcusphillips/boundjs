(function(){
  var global = this;

  $.fn.render = function(scope){
    bound.render(this, scope);
    return this;
  };

  bound.render = function($node, scope){
    bound.autorun(function(){

      handleContentsDirectives($node, scope);
      handleAttrDirectives($node, scope);

    });
  };

  var handleContentsDirectives = function($node, scope) {
    var directive = $node.attr("contents");
    $node.html(bound.proxy(scope).bound('has', directive) ? scope.bound('get', directive) : bound('get', directive));
  };

  var handleAttrDirectives = function($node, scope) {
    _.each($node[0].attributes, function(attribute){
      if((/^attr/).test(attribute.name)) {
        $node.attr((attribute.name).slice("attr-".length), scope[attribute.value]);
      }
    });
  };

}());
