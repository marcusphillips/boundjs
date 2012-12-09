describe('render', function(){
  var global = (function(){ return this; }());

  it('adds a bound() function to the global scope', function(){
    expect(global.bound).toEqual(jasmine.any(Function));
  });

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

  it('updates the html property by calling the .boundControl() method on a rendered-against scope that has changed', function(){
    var $node = $('<div contents="name"></div>');
    var user = {name: 'alice'};
    $node.boundRender(user);
    user.name = 'al';
    user.boundControl();
    expect($node.html()).toEqual('al');
  });

});
