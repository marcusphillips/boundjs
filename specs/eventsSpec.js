describe('events', function(){

  // todo: review

  var game;
  beforeEach(function(){
    game = {};
    mixEvents(game);
  });

  it('should provide on and trigger methods', function(){
    expect(game.on).toEqual(any(Function));
    expect(game.trigger).toEqual(any(Function));
  });

  it('should call registered handlers when the associated event is triggered', function(){
    var onWin = makeSpied();
    game.on('win', onWin);
    game.trigger('win');
    expect(onWin).toHaveBeenCalled();
  });

  it('should not expire old listeners as a result of binding new ones', function(){
    var onWin = makeSpied();
    var onLose = makeSpied();
    game.on('win', onWin);
    game.on('lose', onLose);
    game.trigger('win');
    expect(onWin).toHaveBeenCalled();
  });

  it('should not call handlers registered on the same object for other events', function(){
    var onLose = makeSpied();
    game.on('win', function(){});
    game.on('lose', onLose);
    game.trigger('win');
    expect(onLose).not.toHaveBeenCalled();
  });

});