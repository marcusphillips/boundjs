describe('debug directive', function(){
  it('detects a debug directive', function(){
    sinon.stub(_, 'debug');
    $('<div bound-debug/>').render({});
    expect(_.debug.called).to.be(true);
  });
});

describe('log directive', function(){

  sinon.stub(_,'log');

  it('detects a log directive', function(){
    $('<div bound-log/>').render({});
    expect(_.log.called).to.be(true);
  });

  it('should be called with the node and the scope', function(){
    var $node = $('<div bound-log/>');
    $node.render({});
    expect(_.log.calledWith($node[0])).to.be(true);
  });
});