(function(){
  var global = this;

  $.fn.boundRender = function(context){
    render(this, context);
    return this;
  };

  var render = function($node, context){
    var directive = $node.attr("contents");
    var rendered = context[directive] ? $node.append(context[directive]) : $node.append(global[directive]);
    context.boundControl = function() {};

    return rendered;
  };

}());
