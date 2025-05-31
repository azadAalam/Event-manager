import { Link } from 'react-router-dom';
import React from 'react';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        {/* Placeholder gradient background for events without images */}
        <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
        
        {/* Event category tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full">
            {event.category || 'Event'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors duration-200">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {event.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <svg
              className="h-5 w-5 mr-2 text-purple-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <svg
              className="h-5 w-5 mr-2 text-purple-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{event.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
              {event.creator?.name?.charAt(0) || '?'}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900">{event.creator?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">Organizer</p>
            </div>
          </div>
          
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            View Details
            <svg 
              className="ml-2 -mr-1 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 