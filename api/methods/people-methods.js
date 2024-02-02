import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { People } from '../../people/people';

Meteor.methods({
  'people.checkIn'(personId) {
    check(personId, String);

    People.update(personId, {
      $set: {
        checkIn: new Date().getTime(),
      },
    });
  },

  'people.checkOut'(personId) {
    check(personId, String);

    People.update(personId, {
      $set: {
        checkOut: new Date().getTime(),
      },
    });
  },
});
