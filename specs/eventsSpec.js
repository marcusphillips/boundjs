describe('events', function(){

  // todo: review

  var game;
  beforeEach(function(){
    game = {};
    mixEvents(game);
  });

  it('should provide on and trigger methods', function(){
    expect(game.on).to.be.a('function');
    expect(game.trigger).to.be.a('function');
  });

  it('should call registered handlers when the associated event is triggered', function(){
    var onWin = sinon.spy();
    game.on('win', onWin);
    game.trigger('win');
    expect(onWin.called).to.be(true);
  });

  it('should not expire old listeners as a result of binding new ones', function(){
    var onWin = sinon.spy();
    var onLose = sinon.spy();
    game.on('win', onWin);
    game.on('lose', onLose);
    game.trigger('win');
    expect(onWin.called).to.be(true);
  });

  it('should not call handlers registered on the same object for other events', function(){
    var onLose = sinon.spy();
    game.on('win', function(){});
    game.on('lose', onLose);
    game.trigger('win');
    expect(onLose.called).not.to.be(true);
  });

});
