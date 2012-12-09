(function(){
  var global = this;

  $.fn.boundRender = function(context){
    render(this, context);
  };

  var render = function($node, context){
    var directive = $node.attr("contents");

    var updateContents = function(){
      $node.html(context[directive] ? context[directive] : global[directive]);
    };

    context.__dependents__ = context.__dependents__ || {};
    context.__dependents__[directive] = context.__dependents__[directive] || [];
    context.__dependents__[directive].push(updateContents);
    updateContents();

    context.boundControl = function() {
      for(var i = 0; i < context.__dependents__[directive].length; i++) {
          context.__dependents__[directive][i]();
      }

      // checkAllPropertiesForChange
      // for each property that changed
      //   iterate across its __dependents__
      //     invalidate them
    };

  };

}());
