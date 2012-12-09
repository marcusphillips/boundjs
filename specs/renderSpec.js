describe('render', function(){
  var global = (function(){ return this; }());

  it('adds a .boundRender() method to jQuery objects', function(){
    expect($('<div></div>').boundRender).toEqual(jasmine.any(Function));
  });

  it('can add html to a node', function(){
    var $node = $('<div contents="name"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('alice');
  });

  it('falls back onto the global scope for keys that are not found on the input', function(){
    global.age = '30';
    var $node = $('<div contents="age"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('30');
    delete global.age;
  });

  it('does not add any text to the node if the directive attribute is not found on the input and in the global scope', function() {
    var $node = $('<div contents="age"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.html()).toEqual('');
  });
  
  it('thorws an error (TypeError) if no context is passed', function() {
      var $node = $('<div contents="age"></div>');
      expect(function(){$node.boundRender();}).toThrow();
      // expect($node.html()).toEqual('');
    });

  it('does not remove a directive attribute after following it', function(){
    var $node = $('<div contents="name"></div>');
    $node.boundRender({name: 'alice'});
    expect($node.attr('contents')).toEqual('name');
  });

  it('adds a .boundControl() method to objects that have been rendered against', function(){
    var user = {name: 'alice'};
    $('<div></div>').boundRender(user);
    expect(user.boundControl).toEqual(jasmine.any(Function));
  });

  xit('updates the html property after calling the .boundControl() method on a rendered-against scope that has changed', function(){
    var $node = $('<div contents="name"></div>');
    var user = {name: 'alice'};
    $node.boundRender(user);
    user.name = 'al';
    user.boundControl();
    expect($node.html()).toEqual('al');
  });

});
