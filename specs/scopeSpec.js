describe('scopes', function(){

  var parentScope, childScope;

  beforeEach(function(){
    parentScope = B.scope.extend(message);
    childScope = parentScope.extend(alice);
  });

  describe('basics', function(){

    it('introduces a top level scope', function(){
      expect(B.scope).to.be.an('object');
    });

    it('can create subscopes', function(){
      expect(B.scope.extend).to.be.a('function');
    });

    // todo: june
    xit('can provide the parent scope', function(){
      expect(childScope.parent()).to.equal(parentScope);
    });

    it('extend function returns object', function(){
      expect(B.scope.extend({})).to.be.an('object');
    });

    describe('.namespace()', function(){
      xit('provides the appropriate namespace object');
    });

    describe('.namespaces()', function(){
      xit('provides the appropriate array of namespace objects');
    });

  });

  describe('lookups', function(){

    it('allows lookups in the global scope from the top level scope', function(){
      global.present = 3;
      expect(B.scope.lookup('present')).to.equal(3);
      expect(B.scope.lookup('absent')).to.equal(undefined);
      delete global.present;
    });

    it('lookups in a child scope fall through to the parent scope', function(){
      expect(childScope.lookup('text')).to.equal('hi');
    });

  });

  describe('nested scopes and literals', function(){

    var scope;

    beforeEach(function(){
      scope = B.scope.extend({
        zero: 0,
        masking: 'masked',
        text: 'hi'
      }).extend({
        masking: undefined
      });
    });

    it('should allow lookups of literal objects and arrays strings with double and single quotes', function(){
      _.each({
        "[]": [],
        '[  ]': [],
        '["a", 3, false]': ['a', 3, false],
        '[[1], [2], [3]]': [[1], [2], [3]],
        '{}': {},
        '{key: [1,2,3,4]}': {key: [1,2,3,4]},
        '{key : "value"}': {key:'value'},
        '{key: {key4: "value"}}': {key: {key4: 'value'}},
        '{key: text}': {key: 'hi'},
        '{"key" : "value"}': {key : "value"}
      }, function(value, key){
        expect(scope.lookup(key)).to.eql(value);
      });
    });

    describe('strict equalities', function(){
      xit('todo: move simple literals like null and false into here');
    });

    it('should allow lookups of literal booleans, numbers and strings with double and single quotes', function(){
      _.each({
        '3': 3,
        '100': 100,
        '01': 01,
        '"in doubles"': 'in doubles',
        "'in singles'": 'in singles',
        'false': false,
        'true': true,
        'null': null,
        'undefined': undefined,
        'absent': undefined,
        'trueish': undefined,
        'nully': undefined,
        ' " this string starts with 3 spaces" ': ' this string starts with 3 spaces',
        ' "this string has the escaped delimiter symbol \\" in it" ': 'this string has the escaped delimiter symbol " in it',
        '-1' : -1,
        '0.14': 0.14,
        'zero': 0,
        'masking': undefined
        // 'bob.name': 'bob'
      }, function(value, key){
        expect(scope.lookup(key)).to.be(value);
      });
    });

  });

  describe('lookups on object literals that include types of whitespace', function(){
  });

  describe('this lookups', function(){
    xit('lookups to "this" should resolve to scope\'s target namespace');
  });

  describe('reruns', function(){

    xit('reruns blocks that made lookup in a scope when target namespace changes', function(){
      var runCount = 0;
      B.depend(function(){
        parentScope.lookup('text');
        runCount++;
      });
      expect(runCount).to.be(1);
      message.bound('set', 'text', 'hello');
      expect(runCount).to.be(2);
    });

    xit('if a value is found on an object that is low in the scope chain, and the value at that key is changed on a higher level of the chain, those changes do not result in a rerender of directives that depended on the value in the leaf object', function(){
    });

  });

});
