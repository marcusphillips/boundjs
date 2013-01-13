describe('proxies', function(){

  describe('making proxies', function(){

    it('adds a bound() function to the global scope', function(){
      expect(bound).toEqual(any(Function));
    });

    it('provides a helper to identify bound methods', function(){
      expect(bound.isBoundMethod(function(){})).toBe(false);
      expect(bound.isBoundMethod(bound.proxy({}).bound)).toBe(true);
    });

    it('should return the input object as a result of calling bound()', function(){
      expect(bound.proxy(alice)).toEqual(alice);
    });

    it('should augment objects passed into bound.proxy() with a .bound() method', function(){
      expect(bound.proxy({}).bound).toEqual(any(Function));
    });

    it('should throw an error if a non bound method is already stored at the key "bound" and bound.proxy() is called on it', function(){
      expect(function(){
        bound.proxy({bound:3});
      }).toThrow();
    });

    it('should not throw an error if a bound method is already stored at the key "bound" and bound is called on it', function(){
      expect(function(){
        bound.proxy(alice);
        bound.proxy(alice);
      }).not.toThrow();
    });

    // regression test
    it('should not throw an error if you try to proxy an object that has a target property', function(){
      expect(function() {
        bound.proxy({target:3});
      }).not.toThrow();
    });

    it('should put a unique bound method on each proxied object', function(){
      expect(bound.proxy({}).bound).not.toBe(bound.proxy({}).bound);
    });

    it('should provide the same method if the same object is passed in twice', function(){
      expect(bound.proxy(alice).bound).toEqual(bound.proxy(alice).bound);
    });

    it('should not provide the same bound method for a child as the one available on its prototype', function(){
      expect(bound.proxy(child).bound).not.toEqual(bound.proxy(parent).bound);
    });

    it('should not add any properties to a object other than .bound()', function(){
      expect(_.keys(bound.proxy({}))).toEqual(['bound']);
    });

    it('should not allow proxying proxy objects', function(){
      expect(function() {
        var proxy = bound.proxy(empty).bound('proxy');
        bound.proxy(proxy);
      }).toThrow();
    });

  });

  describe('iteration', function(){

    xit('skips .bound methods');

    xit('does not skip .bound properties that are not bound methods');

    xit('does not skip bound methods stored at keys besides .bound');

  });

  describe('applying to bound method between contexts', function(){

    it('should not allow the bound method of one object to be called in the context of another object', function(){
      // todo: long term, this should actually just have the effect of calling the bound method of the target object instead
      expect(function(){
        bound.proxy(alice).bound.apply(bob);
      }).toThrow();
    });

    it('throws an error when a .bound() method is called on its associated object, but the method is not found on the target at the key \'bound\'', function(){
      var removedMethod = bound.proxy(alice).bound;
      delete alice.bound;
      expect(function(){
        removedMethod.apply(alice);
      }).toThrow();
    });

    xit('should augment child objects with their own .bound() property when a call to .bound() delegates through to the prototype object', function(){
      expect(child.bound).toEqual(bound.proxy(parent).bound);
      child.bound(); // delegates to parent.bound()
      expect(child.bound).not.toEqual(parent.bound);
    });

  });

  describe('bound proxy object methods', function(){

    it('should allow access to a proxy object by calling the "proxy" command', function(){
      var proxy = bound.proxy({}).bound('proxy');
      var proxyMethods = 'get set del has owns run exec pub sub proxy meta'.split(' ');
      _.each(proxyMethods, function(element){
        var randomNumber = Math.random();
        spyOn(proxy, element);
        proxy[element](randomNumber);
        expect(proxy[element]).toEqual(any(Function));
        expect(proxy[element]).toHaveBeenCalledWith(randomNumber);
      });
    });

    it('should get the value of properties from the target object when you run the get command', function(){
      var object = bound.proxy({thing:5});
      expect(object.bound('get','thing')).toEqual(5);
    });

    it('should set the value of properties from the target object when you run the set command', function(){
      var object = bound.proxy({});
      object.bound('set', 'setThing', 2);
      expect(object.bound('get','setThing')).toEqual(2);
    });

    it('should delete properties from the target object when you run the del command', function(){
      var object = bound.proxy({});
      object.bound('set', 'setThing', 4);
      object.bound('del', 'setThing');
      expect(object.bound('get', 'setThing')).not.toEqual(4);
      expect(object.hasOwnProperty('setThing')).not.toBe(true);
    });

    xit('should re-run work that was dependent on calls to "has" after deleting properties that used to exist');

    xit('should re-run work that was dependent on calls to "has" after setting properties that didnt\'t used to exist');

    it('should return the presence or absence of a property on the target object when you run the has command', function(){
      bound.proxy(message);
      expect(message.bound('has', 'text')).toBe(true);
      expect(message.bound('has', 'unicorns')).toBe(false);
    });

    xit('should return the immediate presence or absence of a property (not prototype-inherited) on the target object when you run the owns command');

    xit('todo: need to provide a way for users to run a function or a method in an arbitrary context');

    xit('should run the specified method (in the context of the target object) when you run the run command, and should return the result');

    xit('should run the target function object (in the context of window) when you run the exec command, and should return the result');

    xit('todo: should provide an eventing system, including publish and subscribe');

    xit('should add meta data about the target object to the proxy object when you call the meta command');
  });

  describe('updates to depended-upon properties', function(){

    xit('should let you invalidate listeners for one key by exposing a bound() command "changed"', function(){
      var runCount = 0;
      bound.autorun(function() {
        alice.bound('get', 'name');
        runCount++;
      });
      expect(runCount).toEqual(1);
      alice.name = 'al';
      alice.bound('changed', 'name');
      Clock.tick();
      expect(runCount).toEqual(2);
      alice.age = 21;
      alice.bound('changed', 'age');
      Clock.tick();
      expect(runCount).toEqual(2);
    });

    xit('should update only the values associated with specified keys', function(){
    });

    xit('should expire all dependent computations when called with no command name', function(){
    });

    xit('should not result in re-runs of dependent contexts for setting properties to the same value they already hold', function(){
      
      
    });

    xit('should not re-run properties dependent on key inclusion when only the property value has changed, not its presence in the object', function(){
      // todo: tursify
      bound.proxy(alice);
      var runCount1 = 0;
      bound.autorun(function(){
        alice.bound('has', 'hamburger');
        runCount1 += 1;
      });
      var runCount2 = 0;
      bound.autorun(function(){
        alice.bound('get', 'name');
        runCount2 += 1;
      });
      alice.bound('set', 'name', 'al');
      Clock.tick();
      expect([runCount1, runCount2]).toEqual([1, 2]);
    });

    it('errors when passed an invalid command name', function(){
      expect(function(){
        bound.proxy({}).bound('invalidCommand');
      }).toThrow();
    });

  });

});
