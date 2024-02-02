import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../infra/initial-data';
import '../api/publications/communities-publication';

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
});
