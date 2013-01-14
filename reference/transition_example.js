// the $.fn.transition function accepts a target feature, the height style in this case, and a destination value
// by default, it simply updates that value
$node.transition('style:height', 0);

// if, however, you define the transition functions for this type of transition,
// then invoking that transition type will result in calls to your start, step, and end helpers instead of the defaults
$node.defineTransition('style:height', {

  // start() will be called at the beginning of any animation
  start: function(goal){
    this.glow();
  },

  // step() will be called repeatedly until completion
  step: function(goal){
    // do one frame of work toward goal. default fps of 20
    this.style('height', this.style('height') + (this.style('height') < goal ? 1 : -1);

    // tell the lib whether you're ready to stop by returning a boolean
    // without a return, lib does an explicit equality check on goal === currentValue
    return this.height === destination;
  },

  // end() will be called when step reports completion or when a new animation of this value starts
  end: function(goal, interrupted){
    // interruped is true if a new transition for this value is requested before the current one has reported completion
    interrupted && this.flash();
    this.unglow();
  }
});

// now, your transition will use the above functions to arrive at the desired result
$node.transition('style:width_and_height', 30);
// interestingly, this delayed call will interrupt the above transition. if we are easing, or if an interruption flash (for example) is desired,
// thhen the interruped flag (passed to .end()) becomes relevant
setTimeout(function(){
  $node.transition('style:height', 0);
}, 150);
