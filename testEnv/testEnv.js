(function(){

  var global = this;

  var testEnv = global.testEnv = global.testEnv || {};

  testEnv.fetchSpecs = function(){
    var args = arguments;
    args.length == 1 ? args[0]() : $.getScript(args[0], function(){
      testEnv.fetchSpecs.apply(global, _.toArray(args).slice(1));
    });
  };

  testEnv.beforeAll = function(){
    testEnv.refreshNodes();
    testEnv.refreshObjects();
  };

  // todo: unneeded?
  testEnv.afterAll = function(){
    ($('#fixtures')[0] || {}).innerHTML = '';
  };

  testEnv.augmentJQuery = function(){
    for(var key in {join:1}){
      jQuery.fn[key] = jQuery.fn[key] || Array.prototype[key];
    }
  };

  var $originalFixtureNodes;
  $(function(){
    $originalFixtureNodes = $('#fixtures').remove();
  });

  // clones new fixture nodes from those found in tests/index.html
  testEnv.refreshNodes = function(){
    _.raiseIf(!$originalFixtureNodes, 'fixture nodes not defined before attempted node refresh!');
    var nodes = makeFreshFixtureNodes();
    for(var key in nodes){
      window[key] = nodes[key];
    }
  };

  var makeFreshFixtureNodes = function(){
    var nodes = {};

    for(var i = 0; i < 5; i++){
      var $clonedFixtureNodes = $originalFixtureNodes.clone();

      $clonedFixtureNodes.find('[fixture]').each(function(which, node){
        var key = $(node).attr('fixture') + (i ? (i+1).toString() : '');
        _.raiseIf(nodes[key], 'Two fixture nodes have the same name, "'+key+'"');
        nodes['$'+key] = window['$'+key] = $(node).attr('fixture', key);
      });

      // disassociate all top-level fixture nodes with any parent (including the fixture node holder)
      $clonedFixtureNodes.html('');
    }

    return nodes;
  };

  testEnv.refreshObjects = function(){
    var scopes = makeObjects();
    for(var key in scopes){
      global[key] = scopes[key];
    }
  };

  var makeObjects = function(){};

  testEnv.defineFixtureObjectMaker = function(fixtureObjectMaker){
    makeObjects = fixtureObjectMaker;
  };

  var integrate = function(){
    beforeEach(testEnv.beforeAll);
    afterEach(testEnv.afterAll);
    global.global = global;
  };

  testEnv.integrateJasmine = function(){
    integrate();
    global.any = jasmine.any;
    global.clock = jasmine.Clock;
    global.makeSpied = function(func){
      func = func || function(){};
      var container = {func: func};
      spyOn(container, 'func');
      return container.func;
    };
  };

  testEnv.integrateMocha = function(){
    integrate();
    mocha.globals(Object.keys(makeObjects()));
    mocha.globals(Object.keys(makeFreshFixtureNodes()));
  };

  // todo: wipe out all new global variables once per test

}());
