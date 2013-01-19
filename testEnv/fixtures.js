testEnv.defineFixtureObjectMaker(function(){

  var objects = {
    empty: {},

    shopping: ['cheese', 'eggs', 'milk'],

    message: {
      text: 'hi',
      readState: 'unread',
      sender: {
        name: 'alice'
      }
    },

    navItems: [
      {text:'home'},
      {text:'profile'},
      {text:'settings'}
    ],

    ticTacToe: [
      [{symbol:'x'}, {symbol:'o'}, {symbol:'x'}],
      [{symbol:'o'}, {symbol:'x'}, {symbol:'o'}],
      [{symbol:'x'}, {symbol:'o'}, {symbol:'x'}]
    ],

    people: [{
      name: 'alice',
      username: 'alice00',
      title: 'Ms',
      isAdmin: true,
      isVerified: true,
      email: 'alice@startup.com',
      age: 20,
      address: {
        street: 'cornell'
      },
      mugshotUrl: 'example.com'
    },{
      name: 'bob'
    },{
      name: 'charlie'
    },{
      name: 'david'
    },{
      name: 'ellen'
    },{
      name: 'hacker'
    }],

    grandparent: {}

  };

  objects.parent = _.create(objects.grandparent);
  objects.child = _.create(objects.parent);

  for(var i = 0; i < objects.people.length; i++){
    var person = objects.people[i];
    objects[person.name] = person;

    person.friends = [];
    // each fixture person is friends with all lower-indexed people
    for(var whichFriend = 0; whichFriend < i; whichFriend++){
      person.friends.push(objects.people[whichFriend]);
    }
  }

  return objects;
});
