  // todo: check that .scope() works correctly after a with directive

describe('with directive', function() {

  it('should use the specified namespace to render the template', function() {
    expect($email.render(message).find('.name').html()).to.equal('alice');
  });

  xit('should fall back to other namespaces', function() {
    expect($email.render({
      name: 'hello',
      sender: {}
    }).find('.name').html()).to.equal('hello');
  });

  it('should ignore fallback namespaces when the value is present in the specified namespace', function() {
    expect($email.render({
      name: 'hello',
      sender: {
        name: 'alice'
      }
    }).find('.name').html()).to.equal('alice');
  });

  xit('does not render directives nested under a with directive that resolve to a non-object', function(){
    expect($email.render({name: 'irrelevant'}).find('.name').html()).to.equal('');
    expect(B.getDirectiveRenderCount()).to.equal(1);
  });

});
