describe('proxies', function(){
  xit('should return the input object as a result of calling bound()', function(){
    expect(bound.proxy(alice)).toEqual(alice);
  });

  xit('should augment objects passed into bound.proxy() with a .bound() method', function(){
    expect(bound.proxy({}).bound).toEqual(any(Function));
  });

  xit('should put a unique method object on each object passed in', function(){
    expect(bound.proxy({}).bound).notToEqual(bound.proxy({}).bound);
  });

  xit('should provide the same method if the same object is passed in twice', function(){
    var object = {};
    expect(bound.proxy(object).bound).toEqual(bound.proxy(object).bound);
  });

  xit('should throw an error if a non bound method is already stored at the key "bound" and bound is called on it', function(){
    expect(function(){ bound.proxy({bound:3}); }).toThrow();
  });

  xit('should throw an error if you try to proxy a proxy', function(){
    var proxy = bound.proxy({}).bound('proxy');
    expect( bound.proxy(proxy)).toThrow();
  });

  xit('should not allow the bound method of one object to be called in the context of another object', function(){
    // todo: long term, this should actually just have the effect of calling the bound method of the target object instead
    expect(function(){ bound.proxy({}).bound.apply({}); }).toThrow();
  });

  xit('should allow access to a proxy object by calling the "proxy" command', function(){
    var object = bound.proxy(object);
    var proxy = object.bound('proxy');
    expect(proxy).toBe(any(Object));
    var proxyMethods = 'get set del has owns run exec pub sub proxy meta'.split(' ');
    for(var i = 0; i < proxyMethods.length; i++){
      var methodName = proxyMethods[i];
      expect(proxy[methodName]).toBe(any(Function));
      spyOn(proxy, methodName);
      var randomNumber = Math.random();
      object(methodName, randomNumber);
      expect(proxy[methodName]).toHaveBeenCalledWith(randomNumber);
    }
  });

  describe('bound proxy objects', function(){
    xit('should expire all dependant computations when called with no command name');
    xit('should get the value of properties from the target object when you run the get command');
    xit('should set the value of properties from the target object when you run the set command');
    xit('should delete properties from the target object when you run the del command');
    xit('should re-run work that was dependent on calls to "has" after deleting properties that used to exist');
    xit('should re-run work that was dependent on calls to "has" after setting properties that didnt\'t used to exist');
    xit('should return the presense or absence of a property on the target object when you run the has command');
    xit('should return the immediate presense or absence of a property (not prototype-inherited) on the target object when you run the owns command');
    xit('todo: need to provide a way for users to run a function or a method in an arbitrary context');
    xit('should run the specified method (in the context of the target object) when you run the run command, and should return the result');
    xit('should run the target function object (in the context of window) when you run the exec command, and should return the result');
    xit('todo: should provide an eventing system, including publish and subscribe');
    xit('should add meta data about the target object to the proxy object when you call the meta command');
  });

  xit('errors when passed an invalid command name');

  xit('should let you invalidate listeners for one key by exposing a bound() command "changed"', function(){
    var runCount = 0;
    bound.autorun(function() {
      alice.bound('get', 'name');
      runCount++;
    });
    expect(runCount).toEqual(1);
    alice.name = 'al';
    alice.bound('changed', 'name');
    expect(runCount).toEqual(2);
    alice.age = 21;
    alice.bound('changed', 'age');
    expect(runCount).toEqual(2);
  });

});
