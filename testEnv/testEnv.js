(function(){

  var global = this;

  var testEnv = global.testEnv = global.testEnv || {};

  testEnv.beforeAll = function(){
    testEnv.refreshNodes();
    testEnv.refreshObjects();
  };

  testEnv.afterAll = function(){
    ($('#fixtures')[0] || $('<div/>')[0]).innerHTML = '';
  };

  testEnv.augmentJQuery = function(){
    for(var key in {join:1}){
      jQuery.fn[key] = jQuery.fn[key] || Array.prototype[key];
    }
  };

  var $originalFixtureNodes, nodes;
  $(function(){
    $originalFixtureNodes = $('#fixtures').remove();
  });

  // clones new fixture nodes from those found in tests/index.html
  testEnv.refreshNodes = function(){
    _.raiseIf(!$originalFixtureNodes, 'fixture nodes not defined before attempted node refresh!');
    nodes = {};
    for(var i = 0; i < 5; i++){
      $originalFixtureNodes.clone().find('[fixture]').each(function(which, node){
        var key = $(node).attr('fixture') + (i ? (i+1).toString() : '');
        _.raiseIf(nodes[key], 'Two fixture nodes have the same name, "'+key+'"');
        nodes['$'+key] = window['$'+key] = $(nodes[key] = node).attr('fixture', key);
      }).end().html('');
    }
  };

  testEnv.refreshObjects = function(){
    var scopes = testEnv.makeObjects();
    for(var key in scopes){
      global[key] = scopes[key];
    }
  };

  testEnv.defineFixtureObjectMaker = function(fixtureObjectMaker){
    this.makeObjects = fixtureObjectMaker;
  };

  testEnv.integrateJasmine = function(){
    beforeEach(testEnv.beforeAll);
    afterEach(testEnv.afterAll);
    global.any = jasmine.any;
    global.makeSpied = function(func){
      func = func || function(){};
      var container = {func: func};
      spyOn(container, 'func');
      return container.func;
    };
    global.global = global;
  };

  // todo: wipe out all new global variables once per test

}());
