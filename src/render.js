(function(){
  var global = this;

  $.fn.boundRender = function(context){
    bound.render(this, context);
    return this;
  };

  bound.render = function($node, context){
    bound.autorun(function(){
      var directive = $node.attr("contents");
      $node.html(bound(context).ctrl('has', directive) ? context.ctrl('get', directive) : bound('global', 'get', directive));
    });
  };

}());
