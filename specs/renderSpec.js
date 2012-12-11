describe('render', function(){
  var global = (function(){ return this; }());

  it('adds a .boundRender() method to jQuery objects', function(){
    expect($('<div/>').boundRender).toEqual(jasmine.any(Function));
  });

  it('returns the original jquery object from .boundRender()', function(){
    expect($('<div/>').boundRender({})).toEqual(jasmine.any(jQuery));
  });

  it('modifies the html of a rendered node that has the contains directive', function(){
    expect($('<div contents="name"></div>').boundRender({name: 'alice'}).html()).toEqual('alice');
  });

  it('falls back onto the global scope for keys that are not found on the input', function(){
    global.age = '30';
    var $node = $('<div contents="age"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('30');
    delete global.age;
  });

  xit('does not operate on nodes that have no directives', function(){
  });

  it('does not add any text to the node if the directive attribute is not found on the input and in the global scope', function() {
    var $node = $('<div contents="age"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('');
  });

  it('throws an error (TypeError) if no context is passed', function() {
    var $node = $('<div contents="age"></div>');
    expect(function(){$node.boundRender();}).toThrow();
  });

  it('does not remove a directive attribute after following it', function(){
    var $node = $('<div contents="name"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.attr('contents')).toEqual('name');
  });

  it('adds a .ctrl() method to objects that have been rendered against', function(){
    var user = {name: 'alice'};
    $('<div></div>').boundRender(user);
    expect(user.ctrl).toEqual(jasmine.any(Function));
  });

  it('updates the html property by calling the .ctrl() method on a rendered-against scope that has changed', function(){
    jasmine.Clock.useMock();
    var $node = $('<div contents="name"></div>');
    var user = {name: 'alice'};
    $node.boundRender(user);
    user.name = 'al';
    user.ctrl();
    jasmine.Clock.tick(0);
    expect($node.html()).toEqual('al');
  });

  it('should update the html property of all nodes that it has been rendered against', function(){
    jasmine.Clock.useMock();
    var $node = $('<div contents="name"></div>');
    var $node2 = $('<div contents="age"></div>');
    var user = {name: 'alice', age: 30};
    $node.boundRender(user);
    $node2.boundRender(user);
    user.name = 'al';
    user.age = 24;
    user.ctrl();
    jasmine.Clock.tick(0);
    expect($node.html()).toEqual('al');
    expect($node2.html()).toEqual('24');
  });

  it('should only update the html property of nodes in the current context when ctrl() is called', function(){
    jasmine.Clock.useMock();
    var $node = $('<div contents="name"></div>');
    var $node2 = $('<div contents="name"></div>');
    var user = {name: 'alice'};
    var user2 = {name: 'bob'};
    $node.boundRender(user);
    $node2.boundRender(user2);
    user.name = 'al';
    user2.name = 'robert';
    user.ctrl();
    jasmine.Clock.tick(0);
    expect($node.html()).toEqual('al');
    expect($node2.html()).toEqual('bob');
  });


  xit('should update nodes nested within the top level node', function(){
  });

  xit('should update only the values associated with keys passed in to .ctrl()', function(){
  });

  xit('if a value is found on an object found low in the scope chain, and the value of at that key is changed on a higher level of the chain, those changes do not result in a rerender of the node that depended on the leaf object', function(){
  });

});
