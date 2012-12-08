describe('bound', function(){
  var global = (function(){ return this; }());

  it('adds a bound() function to the global scope', function(){
    expect(global.bound).toEqual(jasmine.any(Function));
  });

});
