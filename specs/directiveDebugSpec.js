describe('debug directive', function(){
  it('detects a debug directive', function(){
    sinon.stub(_, 'debug');
    $('<div bound-debug/>').render({});
    expect(_.debug.called).to.be(true);
  });
});
