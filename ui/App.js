import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Texts } from '../infra/constants';
import { Communities } from '../communities/communities';

export const App = () => {
  const [communityId, setCommunityId] = useState('');

  /*
    The useTracker hook is responsible for fetching community data. It subscribes to the 'communities'
    publication to obtain the data. If the subscription handler is not ready, it sets isLoading to true
    and returns an empty communities array. Otherwise, it fetches the data from the Communities collection.
    Once the data is successfully fetched, it sets isLoading to false and returns the populated array.
  */
  const { isLoading, communities } = useTracker(() => {
    const handler = Meteor.subscribe('communities');

    if (!handler.ready()) {
      return { isLoading: true, communities: [] };
    }

    const data = Communities.find({}).fetch();
    return { isLoading: false, communities: data };
  });

  return (
    <div className="">
      <div className="bg-gradient-to-b from-[#e1e5f0] to-[#d0edf5] py-[20px] md:py-[15px] md:px-20 relative shadow-md">
        <h1 className="text-3xl font-semibold">{Texts.HOME_TITLE}</h1>
      </div>

      <div className="mt-5 container mx-auto flex justify-center">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} required className="w-1/2 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option value="" disabled>Select an event</option>
            {communities.map(community => (
              <option key={community._id} value={community._id}>{community.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
