describe('debug directive', function(){
  it('detects a debug directive', function(){
    sinon.stub(_, 'debug');
    $('<div bound-debug/>').render({});
    expect(_.debug.called).to.be(true);
  });
});

describe('log directive', function(){

  beforeEach(function(){
    sinon.stub(_,'log');
  });

  afterEach(function(){
    _.log.restore();
  });

  it('detects a log directive', function(){
    $('<div bound-log/>').render({});
    expect(_.log.called).to.be(true);
  });

  it('should be called with the node and the scope', function(){
    var $node = $('<div bound-log/>');
    $node.render(alice);
    expect(_.log.args[0][0]).to.equal($node[0]);
    expect(_.log.args[0][1].namespace()).to.equal(alice);
  });
});