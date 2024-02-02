import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';
import { People } from '../people/people';
import { formatDate } from '../utils/formatDate';
import { timePassedInSeconds } from '../utils/timePassedInSeconds';

export const App = () => {
  // State to manage the selected community and trigger rerender
  const [communityId, setCommunityId] = useState('');
  const [rerender, setRerender] = useState(false);

  // Fetch community data using the useTracker hook
  const { isLoading: loadingCommunities, communities } = useTracker(() => {
    const handler = Meteor.subscribe('communities');

    if (!handler.ready()) {
      // If the handler is not ready, indicate loading and return an empty array
      return { isLoading: true, communities: [] };
    }

    // Fetch community data from the Communities collection
    const data = Communities.find({}).fetch();
    return { isLoading: false, communities: data };
  });

  // Fetch people data based on the selected community using the useTracker hook
  const { isLoading: loadingPeople, people } = useTracker(() => {
    if (!communityId) {
      // If no community id is present, return an empty array and indicate not loading
      return { isLoading: false, people: [] };
    }

    const handler = Meteor.subscribe('people');

    if (!handler.ready()) {
      // If the handler is not ready, indicate loading and return an empty array
      return { isLoading: true, people: [] };
    }

    // Fetch people data from the People collection for the selected community
    const data = People.find({ communityId }).fetch();

    return { isLoading: false, people: data };
  });

  // Toggle between check-in and check-out
  function handleCheckInAndCheckOut(person) {
    if (!person.checkIn) {
      // If not checked in, perform check-in and delay rerender for 5 seconds
      Meteor.call('people.checkIn', person._id);
      setTimeout(() => {
        setRerender(!rerender);
      }, 5000);

      return;
    }

    // If already checked in, perform check-out
    Meteor.call('people.checkOut', person._id);
  }

  // Determine whether the checkout button should be visible
  function showCheckoutButton(person) {
    if (person.checkIn && timePassedInSeconds(new Date(person.checkIn)) < 5) {
      // Checkout button is not visible until 5 seconds after checking in
      return false;
    }

    return true;
  }

  // Render the UI components
  return (
    <div className="">
      <div className="bg-gradient-to-b from-[#e1e5f0] to-[#d0edf5] py-[20px] md:py-[15px] md:px-20 relative shadow-md">
        <h1 className="text-3xl font-semibold">{Texts.HOME_TITLE}</h1>
      </div>

      <div className="mt-5 container mx-auto w-full">
        {loadingCommunities ? (
          // Display loading message while fetching community data
          <span>Loading...</span>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Dropdown to select an event */}
            <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} required className="w-1/2 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option value="" disabled>Select an event</option>
              {communities.map(community => (
                <option key={community._id} value={community._id}>{community.name}</option>
              ))}
            </select>

            <div className="mt-6 flex flex-col">
              {loadingPeople ? (
                // Display loading message while fetching people data
                <span className="mt-4">Loading...</span>
              ) : people.length ? (
                // Display list of people if data is available
                <ul className="mt-6 flex flex-col gap-6 border p-6 rounded">
                  {people.map(person => (
                    // Display information about each person in the list
                    <li key={person._id} className="flex items-center justify-between shadow p-3">
                      <div className="flex flex-col">
                        <span className="text-lg">Name: {person.firstName} {person.lastName}</span>
                        {person.companyName && person.title ? (
                          // Display additional information if available
                          <div className="flex gap-4 text-gray-500">
                            <span>Company: {person.companyName}</span>
                            <span>Title: {person.title}</span>
                          </div>
                        ) : ''}
                        <div className="flex gap-4 text-sm text-gray-500">
                          <div className="flex gap-2">
                            <span className="text-green-400">Check-in:</span>
                            <span>{person.checkIn ? formatDate(new Date(person.checkIn)) : 'N/A'}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-red-400">Check-out:</span>
                            <span>{person.checkOut ? formatDate(new Date(person.checkOut)) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Render check-in and check-out buttons based on conditions */}
                      {!person.checkIn && !person.checkOut &&
                        <button onClick={() => handleCheckInAndCheckOut(person)} className="text-sm px-4 py-2 hover:bg-green-400 bg-green-200 rounded shadow-sm">Check in {person.firstName} {person.lastName}</button>}

                      {person.checkIn && !person.checkOut && showCheckoutButton(person) &&
                        <button onClick={() => handleCheckInAndCheckOut(person)} className="text-sm px-4 py-2 hover:bg-red-400 bg-red-200 rounded shadow-sm">Check out <span className="font-bold">{person.firstName} {person.lastName}</span> </button>}
                    </li>
                  ))}
                </ul>
              ) : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
