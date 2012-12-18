(function(){
  var global = this;

  $.fn.boundRender = function(context){
    render(this, context);
  };

  // var render = function($node, context){
  //   var directive = $node.attr("contents");
  //   var rendered = context[directive] ? $node.append(context[directive]) : $node.append(global[directive]);
  //   context.boundControl = function() {};

  //   return rendered;
  // };
  var render = function(context){
    var rendered;
    if ($node.attr("contents")) {
      rendered = context[directive] ? $node.append(context[directive]) : $node.append(global[directive]);
    } else {

    }

    return rendered
  };



}());
