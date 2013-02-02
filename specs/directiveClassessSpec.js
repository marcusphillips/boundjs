describe('classes directive', function(){

  xit('adds the approrpriate class when the bound-classes directive is present, and removes the class added by bound when the observed property changes', function(){
    expect($message.hasClass('unread')).to.be(false);
    expect($message.hasClass('read')).to.be(false);
    $message.render(message);
    expect($message.hasClass('unread')).to.be(true);
    expect($message.hasClass('read')).to.be(false);
    message.bound('set', {readState: 'read'});  // TODO: Refactor to use the bound 'set' method
    clock.tick(0);
    expect($message.hasClass('unread')).to.be(false);
    expect($message.hasClass('read')).to.be(true);
  });

});
