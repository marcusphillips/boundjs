  // todo: check that .scope() works correctly after a with directive

var $email = $('<div bound-with="sender"> \
  <div class="name" bound-contents="name"></div> \
  </div>');

expect($email.render({
  sender: {
    name: 'alice'
  }
}).find('.name').html()).toEqual('alice');

expect($email.render({
  name: 'hello',
  sender: {
  }
}).find('.name').html()).toEqual('hello');

expect($email.render({
  name: 'hello',
  sender: {
    name: 'alice'
  }
}).find('.name').html()).toEqual('alice');
