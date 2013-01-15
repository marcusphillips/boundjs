  // todo: check that .scope() works correctly after a with directive

describe('with', function() {

  it('should use the specified namespace to render the template', function() {
    expect($email.render(message).find('.name').html()).toEqual('alice');
  });

  xit('should fall back to other namespaces', function() {
    expect($email.render({
      name: 'hello',
      sender: {
      }
    }).find('.name').html()).toEqual('hello');
  });

  it('should ignore fallback namespaces when the value is present in the specified namespace', function() {
    expect($email.render(message).find('.name').html()).toEqual('alice');
  });

});
