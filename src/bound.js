(function(){
  var global = this;

  var bound = function() {};

  $.fn.boundRender = function(context){
    render(this, context);
  };

  var render = function($node, context){
    var directive = $node.attr("contents");
    var rendered = context[directive] ? $node.append(context[directive]) : $node.append(global[directive]);
    context.bound = function() {};
    context.bound()

    return rendered;
  };

  global.bound = bound;
}());
