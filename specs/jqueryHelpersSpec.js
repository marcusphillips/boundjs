describe('jquery helpers', function(){

  describe('.namespace()', function(){
    it('provides the top namespace in the scope chain', function(){
      expect($empty.render().namespace()).toEqual(undefined);
      expect($empty.render(alice).namespace()).toEqual(alice);
      expect($empty.render(bob).namespace()).toEqual(bob);
      expect($empty.render(charlie, david).namespace()).toEqual(david);
    });
  });

  describe('.namespaces()', function(){
    it('provides all namespaces in the scope chain', function(){
      expect($empty.render().namespace()).toEqual([]);
      expect($empty.render(alice).namespace()).toEqual([alice]);
      expect($empty.render(bob).namespace()).toEqual([alice, bob]);
      expect($empty.render(charlie, david).namespace()).toEqual([alice, bob, charlie, david]);
    });
  });

});
