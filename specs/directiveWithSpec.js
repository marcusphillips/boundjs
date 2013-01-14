  // todo: check that .scope() works correctly after a with directive

describe('with', function() {

  var $email;

  beforeEach(function() {
    $email = $('<div bound-with="sender"> \
      <div class="name" contents="name"></div> \
    </div>');
  });

  it('should use the specified namespace to render the template', function() {
    expect($email.render({
      sender: {
        name: 'alice'
      }
    }).find('.name').html()).toEqual('alice');
  });

  xit('should fall back to other namespaces', function() {
    expect($email.render({
      name: 'hello',
      sender: {
      }
    }).find('.name').html()).toEqual('hello');
  });

  it('should ignore fallback namespaces when the value is present in the specified namespace', function() {
    expect($email.render({
      name: 'hello',
      sender: {
        name: 'alice'
      }
    }).find('.name').html()).toEqual('alice');
  });

});
