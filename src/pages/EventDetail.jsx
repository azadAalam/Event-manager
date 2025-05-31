import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { events } from '../api/api';

const AccessCodeModal = ({ isOpen, onClose, onSubmit, error }) => {
  const [accessCode, setAccessCode] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Enter Access Code</h3>
        <p className="text-gray-600 mb-4">
          This is a private event. Please enter the access code to register.
        </p>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Enter access code"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(accessCode)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCodeError, setAccessCodeError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await events.getById(id);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async (accessCode = null) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      setError('');
      setAccessCodeError('');
      
      await events.register(id, accessCode);
      
      // Refresh event data to update attendees list
      const response = await events.getById(id);
      setEvent(response.data);
      setShowAccessCodeModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register for event';
      if (errorMessage.includes('access code')) {
        setAccessCodeError(errorMessage);
      } else {
        setError(errorMessage);
        setShowAccessCodeModal(false);
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleRegisterClick = () => {
    if (event.eventType === 'private') {
      setShowAccessCodeModal(true);
    } else {
      handleRegister();
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Event not found</div>
      </div>
    );
  }

  const isRegistered = token ? event.attendees?.some(
    attendee => attendee._id === JSON.parse(atob(token.split('.')[1])).id
  ) : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-16">
        {!token && (
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Please <button onClick={() => navigate('/login')} className="font-medium underline hover:text-blue-600">sign in</button> to register for this event.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.eventType === 'private' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {event.eventType === 'private' ? 'Private Event' : 'Public Event'}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event.date)}
            </div>
            <div className="flex items-center text-gray-600">
              <svg
                className="h-5 w-5 mr-2"
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
              {event.venue}
            </div>
            <div className="flex items-center text-gray-600">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Organized by {event.creator?.name}
            </div>
            <div className="flex items-center text-gray-600">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {event.attendees?.length || 0} / {event.maxParticipants} Participants
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">{event.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendees ({event.attendees?.length || 0})</h2>
            {event.attendees?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.attendees.map((attendee) => (
                  <div key={attendee._id} className="text-gray-600">
                    {attendee.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No attendees yet. Be the first to register!</p>
            )}
          </div>
          
          {!token && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in to Register
              </button>
            </div>
          )}
          
          {token && !isRegistered && (
            <div className="mt-6">
              <button
                onClick={handleRegisterClick}
                disabled={registering}
                className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </button>
              {event.eventType === 'private' && (
                <p className="mt-2 text-sm text-gray-500">
                  This is a private event. You'll need an access code to register.
                </p>
              )}
            </div>
          )}
          
          {isRegistered && (
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100">
                You're registered for this event
              </div>
            </div>
          )}
        </div>
      </div>

      <AccessCodeModal
        isOpen={showAccessCodeModal}
        onClose={() => {
          setShowAccessCodeModal(false);
          setAccessCodeError('');
        }}
        onSubmit={handleRegister}
        error={accessCodeError}
      />
    </div>
  );
};

export default EventDetail; 