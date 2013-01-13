describe('classes directive', function(){

  xit('adds the approrpriate class when the bound-classes directive is present, and removes the class added by bound when the observed property changes', function(){
    expect($message.hasClass('unread')).toBe(false);
    expect($message.hasClass('read')).toBe(false);
    $message.render(message);
    expect($message.hasClass('unread')).toBe(true);
    expect($message.hasClass('read')).toBe(false);
    message.bound('set', {readState: 'read'});
    Clock.tick();
    expect($message.hasClass('unread')).toBe(false);
    expect($message.hasClass('read')).toBe(true);
  });

});
