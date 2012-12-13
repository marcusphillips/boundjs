describe('bound', function(){

  it('adds a bound() function to the global scope', function(){
    expect(bound).toEqual(any(Function));
  });

});
