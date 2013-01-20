describe('proxies', function(){

  describe('making proxies', function(){

    it('adds a bound() function to the global scope', function(){
      expect(B).to.be.a('function');
    });

    it('provides a helper to identify bound methods', function(){
      expect(B.isProxy(function(){})).to.be(false);
      expect(B.isProxy(bound.proxy({}).bound)).to.be(true);
    });

    it('should return the input object as a result of calling bound()', function(){
      expect(B(alice)).to.equal(alice.bound);
    });

    it('should augment objects passed into B() with a .bound() method', function(){
      expect( B({}) ).to.be.a('function');
    });

    it('should throw an error if a non bound method is already stored at the key "bound" and B() is called on it', function(){
      expect(function(){
        B({bound:3});
      }).to.throwException();
    });

    it('should not throw an error if a bound method is already stored at the key "bound" and bound is called on it', function(){
      expect(function(){
        B(alice);
        B(alice);
      }).not.to.throwException();
    });

    // regression test
    it('should not throw an error if you try to proxy an object that has a target property', function(){
      expect(function() {
        B({target:3});
      }).not.to.throwException();
    });

    it('should put a unique bound method on each proxied object', function(){
      expect(B({})).not.to.be(B({}));
    });

    it('should provide the same method if the same object is passed in twice', function(){
      expect(B(alice)).to.equal(B(alice));
    });

    it('should not provide the same bound method for a child as the one available on its prototype', function(){
      expect(B(parent)).not.to.equal(B(child));
    });

    it('should not add any properties to a object other than .bound()', function(){
      B(empty);
      expect(B(empty).target()).to.only.have.keys(['bound']);
    });

    it('should not allow proxying proxy objects', function(){
      expect(function() {
        var proxy = B(empty);
        B(proxy);
      }).to.throwException();
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
        B(alice).apply(bob);
      }).to.throwException();
    });

  });

  describe('bound proxy object methods', function(){

    it('should allow access to a proxy object by calling the "getProxy" command', function(){
      var proxy = B({});
      var proxyMethods = 'get set del has owns run exec pub sub getProxy meta'.split(' ');
      _.each(proxyMethods, function(methodName){
        var randomNumber = Math.random();
        expect(proxy[methodName]).to.be.a('function');
        sinon.spy(proxy, methodName);
        proxy[methodName](randomNumber);
        expect(proxy[methodName].calledWith(randomNumber)).to.be(true);
      });
    });

    it('should get the value of properties from the target object when you run the get command', function(){
      expect(B(alice).get('name')).to.equal('alice');
    });

    it('should set the value of properties from the target object when you run the set command', function(){
      B(alice).set('name', 'al');
      expect(alice.name).to.equal('al');
    });

    it('should delete properties from the target object when you run the del command', function(){
      B(alice).del('name');
      expect(B(alice).get('name')).to.equal(undefined);
      expect(alice.hasOwnProperty('setThing')).not.to.be(true);
    });

    xit('should re-run work that was dependent on calls to "has" after deleting properties that used to exist');

    xit('should re-run work that was dependent on calls to "has" after setting properties that didnt\'t used to exist');

    it('should return the presence or absence of a property on the target object when you run the has command', function(){
      expect(B(message).has('text')).to.be(true);
      expect(B(message).has('unicorns')).to.be(false);
    });

    it('should return the immediate presence or absence of a property (not prototype-inherited) on the target object when you run the owns command', function(){
      B(parent).set('prop', 2);
      expect(B(child).owns('prop')).to.be(false);
      B(child).set('prop', 2);
      expect(B(child).owns('prop')).to.be(true);
    });


    it('should return the proxy target when you run the target() command', function(){
      expect(B(parent).target()).to.be(parent);
      expect(B(child).target()).to.be(child);
    });

    xit('todo: need to provide a way for users to run a function or a method in an arbitrary context');

    xit('should run the specified method (in the context of the target object) when you run the run command, and should return the result');

    xit('should run the target function object (in the context of window) when you run the exec command, and should return the result');

    xit('todo: should provide an eventing system, including publish and subscribe');

    xit('should add meta data about the target object to the proxy object when you call the meta command');
  });

  describe('updates to depended-upon properties', function(){

    xit('should let you invalidate listeners for one key by exposing a bound() command "changed"', function(){
      var runCount = 0;
      B.depend(function() {
        B(alice).get('name');
        runCount++;
      });
      expect(runCount).to.equal(1);
      alice.name = 'al';
      B(alice).changed('name');
      clock.tick(0);
      expect(runCount).to.equal(2);
      alice.age = 21;
      B(alice).changed('age');
      clock.tick(0);
      expect(runCount).to.equal(2);
    });

    xit('should update only the values associated with specified keys', function(){
    });

    xit('should expire all dependent computations when called with no command name', function(){
    });

    xit('should not result in re-runs of dependent contexts for setting properties to the same value they already hold', function(){
    });

    it('should not re-run properties dependent on key inclusion when only the property value has changed, not its presence in the object', function(){
      // todo: tursify
      B(alice);
      var runCount1 = 0;
      B.depend(function(){
        B(alice).has('hamburger');
        runCount1 += 1;
      });
      var runCount2 = 0;
      B.depend(function(){
        B(alice).get('name');
        runCount2 += 1;
      });
      B(alice).set('name', 'al');
      clock.tick(0);
      expect([runCount1, runCount2]).to.eql([1, 2]);
    });

  });

});
