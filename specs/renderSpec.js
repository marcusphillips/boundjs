describe('rendering', function(){

  describe('.render() fundamentals', function(){

    it('adds a .render() method to jQuery objects', function(){
      expect($empty.render).toEqual(any(Function));
    });

    it('returns the original jquery object from jquery\'s .render()', function(){
      expect($empty.render({})).toEqual(any(jQuery));
    });

    it('throws an error if no namespace is passed', function() {
      expect(function(){
        $empty.render();
      }).toThrow();
    });

    xit('proxies an object that has been rendered against', function(){
      var object = {};
      $empty.render(object);
      expect(bound.isProxied(object)).toEqual(true);
    });

  });

  describe('directive render operation counting', function(){

    it('counts the number of directives processed', function(){
      global.drink = 'coffee';
      expect(bound.getDirectiveRenderCount()).toEqual(0);     // check that count is at zero
      $('<div contents="food"></div>').render(alice);         // render something with one directive
      expect(bound.getDirectiveRenderCount()).toEqual(1);     // check that count is at 1
      // $('<div contents="food" contents="coffee"></div>').render(alice)  // render something with 2 directives
      // expect(bound.getDirectiveRenderCount()).toEqual(3);               // check that count is at 3
      bound.resetDirectiveRenderCount();                      // reset counter
      expect(bound.getDirectiveRenderCount()).toEqual(0);     // check that count is at 0
    });

  });

  describe('affected nodes', function(){

    xit('does not operate on nodes that have no directives', function(){
      $empty.render({});
      expect(bound.getDirectiveRenderCount()).toEqual(0);
    });

    xit('operates on all nodes in a single jQuery collection', function(){
      $name.add($age).render(alice);
      expect(bound.getDirectiveRenderCount()).toEqual(2);
      expect($name.html()).toEqual('alice');
      expect($age.html()).toEqual('20');
    });

  });

  describe('.namespace()', function(){

    xit('returns the lowest-level rendered-against namespace', function(){
      expect($name.namespace()).toEqual(global);
      expect($name.render(alice).namespace()).toEqual(alice);
    });

    xit('returns the namespace inherited from an ancestor when the focal node has no namespace', function(){
      var $child = $('<div/>');
      var $parent = $('<div/>').append($child);
      $parent.render(alice);
      expect($child.namespace()).toEqual(alice);
    });

  });

  describe('.namespaces()', function(){

    xit('returns an array of all the namespaces in the scope chain', function(){
      expect($node.render(alice).scopes()).toEqual([global, alice]);
    });

  });

  describe('.section()', function(){
    // todo: define a mechanism that retrieves descendant widgets with a given name
    //   when nodes are rendered that have a section attribute, they register with their ancestor chain
  });

  describe('following directives', function(){

    it('does not remove a directive attribute after following it', function(){
      expect($name.render(alice).attr('contents')).toEqual('name');
    });

    xit('errors when passed an invalid directive name');

    it('updates nodes nested within the top level node', function(){
      $('<div>').append($name).render(alice);
      expect($name.html()).toEqual('alice');
    });

  });

  describe('debug directive', function(){
    it('detects a debug directive', function(){
      spyOn( _ , "debug");
      $('<div debug/>').render({});
      expect(_.debug).toHaveBeenCalled();
    });
  });

  describe('scopes and multiple namespace inputs', function(){

    it('falls back onto the global namespace for keys that are not found on the input namespace', function(){
      global.food = 'sausage';
      expect($('<div contents="food"></div>').render(alice).html()).toEqual('sausage');
      delete global.food;
    });

    xit('passing two namespaces inputs to .render() adds them both to the scope chain for that node');

    xit('rendering nodes against a scope chain allows for fall-through between the namespaces');

    xit('calling .render() on an object that was already rendered against a namespace results in pushing the new namespace onto the scope chain for that node');

  });

  describe('reactive updates', function(){

    it('refollows the directives of all rendered nodes when .bound() is called on a rendered-against namespace that has changed', function(){
      $name.render(alice);
      $age.render(alice);
      _.extend(alice, {name: 'al', age: 24}).bound();
      Clock.tick(0);
      expect($name.html()).toEqual('al');
      expect($age.html()).toEqual('24');
    });

    it('should only update the directives of nodes that were rendered against the object that has .bound() called on it', function(){
      $name.render(alice);
      $name2.render(bob);
      alice.name = 'al';
      bob.name = 'robert';
      alice.bound();
      Clock.tick(0);
      expect($name.html()).toEqual('al');
      expect($name2.html()).toEqual('bob');
    });

  });

});
