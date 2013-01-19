describe('rendering', function(){

  describe('.render() fundamentals', function(){

    it('adds a .render() method to jQuery objects', function(){
      expect($empty.render).toEqual(any(Function));
    });

    it('returns the original jquery object from jquery\'s .render()', function(){
      expect($empty.render({})).toEqual($empty);
    });

    xit('proxies an object that has been rendered against', function(){
      var object = {};
      $empty.render(object);
      expect(bound.isProxied(object)).toEqual(true);
    });

    xit('adds a bound-widget attribute to the target node', function(){
      expect($empty.render({}).attr('bound-widget') === undefined).toBe(false);
    });

    xit('doesn\'t recurse onto descendant bound widgets', function(){
      $name.render({}).appendTo($empty);
      expect(bound.getBoundDirectiveRenderCount()).toEqual(1);
      $empty.render(alice);
      expect(bound.getBoundDirectiveRenderCount()).toEqual(1);
      expect($name.html()).toEqual('');
    });

  });

  describe('directive render operation counting', function(){

    it('counts the number of directives processed', function(){
      expect(bound.getDirectiveRenderCount()).toEqual(0);
      $name.render(alice);
      expect(bound.getDirectiveRenderCount()).toEqual(1);
      bound.resetDirectiveRenderCount();
      expect(bound.getDirectiveRenderCount()).toEqual(0);
    });

  });

  describe('affected nodes', function(){

    it('does not operate on nodes that have no directives', function(){
      $empty.render({});
      expect(bound.getDirectiveRenderCount()).toEqual(0);
    });

    it('operates on all nodes in a single jQuery collection', function(){
      $name.add($age).render(alice);
      expect(bound.getDirectiveRenderCount()).toEqual(2);
      expect($name.html()).toEqual('alice');
      expect($age.html()).toEqual('20');
    });

  });

  describe('following directives', function(){

    it('does not remove a directive attribute after following it', function(){
      expect($name.render(alice).attr('bound-contents')).toEqual('name');
    });

    xit('errors when passed an invalid directive name');

    it('updates nodes nested within the top level node', function(){
      $empty.append($name).render(alice);
      expect($name.html()).toEqual('alice');
    });

    it('it should insert contents that are text as text and not as dom nodes', function(){
      expect($message.render({text: '<script>alert("xss");</script>'}).text()).toEqual('<script>alert("xss");</script>');
    });

    it('it should insert contents that are dom nodes as dom nodes and not as text', function(){
      expect($message.render({text: $name}).children()[0]).toBe($name[0]);
      expect(typeof $message.render({text: $name}).children()[0]).toEqual('object');
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

    afterEach(function(){
      delete global.name;
    });

    it('falls back onto the global namespace for keys that are not found on the input namespace', function(){
      global.name = 'globalname';
      expect($name.render({}).html()).toEqual('globalname');
    });

  });

  describe('reactive updates', function(){

    it('refollows the directives of all rendered nodes when .bound() is called on a rendered-against namespace that has changed', function(){
      $name.render(alice);
      $age.render(alice);
      _.extend(alice, {name: 'al', age: 24});
      alice.bound();
      Clock.tick(0);
      expect($name.html()).toEqual('al');
      expect($age.html()).toEqual('24');
    });

    xit('does not refollow directives for properties that have not change, after calling .bound()', function(){
      $name.render(alice);
      expect(bound.getDirectiveRenderCount()).toBe(1);
      // called after no changes, so no directives should be re-run
      alice.bound();
      Clock.tick(0);
      expect(bound.getDirectiveRenderCount()).toBe(1);
    });

    it('should only update the directives of nodes that were rendered against the object that has .bound() called on it', function(){
      $name.render(alice);
      $name2.render(bob);
      alice.name = 'al';
      bob.name = 'robert';
      alice.bound(); // TODO: Refactor to use the bound 'set' method
      Clock.tick(0);
      expect($name.html()).toEqual('al');
      expect($name2.html()).toEqual('bob');
    });

    xit('should only update the directives of nodes that were rendered against the object that has .bound() called on it', function(){
      var $node = $('<div>\
        <div bound-with="alice" bound-contents="name"></div>\
        <div bound-with="bob" bound-contents="name"></div>\
      </div>');
      $node.render({
        alice: alice,
        bob: bob
      });
      expect(bound.getDirectiveRenderCount()).toEqual(4);

      bob.name = 'billy-bob';
      alice.bound('set', 'name', 'al');
      expect($node.find('[bound-with=bob]').html()).toEqual('bob');
      expect(bound.getDirectiveRenderCount()).toEqual(5);
    });

  });

});
