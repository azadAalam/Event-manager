import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { events } from '../api/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  PhotoIcon,
  TagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'conference', name: 'Conference', icon: UserGroupIcon },
  { id: 'workshop', name: 'Workshop', icon: TagIcon },
  { id: 'concert', name: 'Concert', icon: UserGroupIcon },
  { id: 'exhibition', name: 'Exhibition', icon: PhotoIcon },
];

const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    venue: '',
    eventType: 'public',
    accessCode: '',
    maxParticipants: '',
    location: '',
    category: '',
    price: '',
    capacity: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { 
          from: '/create',
          message: 'Please sign in to create an event' 
        } 
      });
    }
  }, [navigate]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFormData(prev => ({
        ...prev,
        image: Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0])
        })
      }));
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate all fields before submission
      const allFields = {
        ...getStepFields(1),
        ...getStepFields(2),
        ...getStepFields(3)
      };
      
      const validationErrors = validateStepFields(allFields);
      if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Create event data object with only the required fields
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.toISOString(),
        venue: formData.venue.trim(),
        eventType: formData.eventType,
        maxParticipants: parseInt(formData.maxParticipants)
      };

      // Add access code only for private events
      if (formData.eventType === 'private' && formData.accessCode) {
        eventData.accessCode = formData.accessCode.trim();
      }

      console.log('Event data being sent:', eventData);

      // Send the data
      const response = await events.create(eventData);
      console.log('Event created successfully:', response.data);
      
      // Redirect to the event detail page
      navigate(`/events/${response.data._id}`);
    } catch (err) {
      console.error('Error creating event:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to create event. Please try again.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent form submission
    const currentStepFields = getStepFields(currentStep);
    const stepValidationErrors = validateStepFields(currentStepFields);
    
    if (Object.keys(stepValidationErrors).length > 0) {
      setErrors(stepValidationErrors);
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    setErrors({});
  };

  // Helper function to get fields for current step
  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return {
          title: formData.title,
          description: formData.description,
          eventType: formData.eventType,
          accessCode: formData.eventType === 'private' ? formData.accessCode : undefined,
          category: formData.category
        };
      case 2:
        return {
          date: formData.date,
          venue: formData.venue,
          location: formData.location
        };
      case 3:
        return {
          maxParticipants: formData.maxParticipants,
          price: formData.price
        };
      default:
        return {};
    }
  };

  // Helper function to validate fields for current step
  const validateStepFields = (fields) => {
    const stepErrors = {};
    
    if (fields.title !== undefined && (!fields.title || fields.title.trim().length < 3)) {
      stepErrors.title = 'Title must be at least 3 characters long';
    }

    if (fields.description !== undefined && (!fields.description || fields.description.length < 10 || fields.description.length > 1000)) {
      stepErrors.description = 'Description must be between 10 and 1000 characters';
    }

    if (fields.venue !== undefined && (!fields.venue || fields.venue.length < 3 || fields.venue.length > 200)) {
      stepErrors.venue = 'Venue must be between 3 and 200 characters';
    }

    if (fields.date !== undefined) {
      if (!fields.date) {
        stepErrors.date = 'Event date is required';
      } else if (new Date(fields.date) < new Date()) {
        stepErrors.date = 'Event date cannot be in the past';
      }
    }

    if (fields.eventType === 'private' && fields.accessCode !== undefined && (!fields.accessCode || fields.accessCode.length < 6 || fields.accessCode.length > 20)) {
      stepErrors.accessCode = 'Private events require an access code (6-20 characters)';
    }

    if (fields.maxParticipants !== undefined) {
      const maxPart = parseInt(fields.maxParticipants);
      if (!maxPart || isNaN(maxPart) || maxPart < 1 || maxPart > 1000) {
        stepErrors.maxParticipants = 'Maximum participants must be between 1 and 1000';
      }
    }

    if (fields.category !== undefined && !fields.category) {
      stepErrors.category = 'Please select an event category';
    }

    if (fields.location !== undefined && !fields.location) {
      stepErrors.location = 'Location is required';
    }

    return stepErrors;
  };

  const steps = [
    {
      title: "Basic Information",
      fields: (
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full h-10 p-1 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className={`mt-1 block p-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : ''
              }`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event (10-1000 characters)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <div className="mt-2 space-y-4">
              <div className="flex items-center">
                <input
                  id="public"
                  name="eventType"
                  type="radio"
                  value="public"
                  checked={formData.eventType === 'public'}
                  onChange={handleChange}
                  className="h-4 w-4  p-1 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="public" className="ml-3 block text-sm font-medium text-gray-700">
                  Public Event
                  <span className="block text-sm text-gray-500">Anyone can join this event</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="private"
                  name="eventType"
                  type="radio"
                  value="private"
                  checked={formData.eventType === 'private'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="private" className="ml-3 block text-sm font-medium text-gray-700">
                  Private Event
                  <span className="block text-sm text-gray-500">Requires an access code to join</span>
                </label>
              </div>
            </div>

            {formData.eventType === 'private' && (
              <div className="mt-4">
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                  Access Code
                </label>
                <input
                  type="text"
                  name="accessCode"
                  id="accessCode"
                  required
                  className={`mt-1 h-10 p-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.accessCode ? 'border-red-300' : ''
                  }`}
                  value={formData.accessCode}
                  onChange={handleChange}
                  placeholder="Enter access code (6-20 characters)"
                />
                {errors.accessCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.accessCode}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`${
                      formData.category === category.id
                        ? 'ring-2 ring-blue-500 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    } relative rounded-lg p-4 bg-white shadow-sm flex flex-col items-center justify-center focus:outline-none`}
                  >
                    <category.icon className="h-6 w-6" />
                    <span className="mt-2 text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Date & Location",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="block w-full pl-10 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
              Venue Name
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <input
                type="text"
                name="venue"
                id="venue"
                required
                className={`block w-full h-10 p-1 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.venue ? 'border-red-300' : ''
                }`}
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue name (3-200 characters)"
              />
            </div>
            {errors.venue && (
              <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.venue.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location Details
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="block w-full h-10 p-1 pl-10 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter detailed location/address"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Additional Details",
      fields: (
        <div className="space-y-6">
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
              Maximum Participants
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="maxParticipants"
                id="maxParticipants"
                min="1"
                max="1000"
                required
                className={`block w-full  h-10 p-1 pl-10 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.maxParticipants ? 'border-red-300' : ''
                }`}
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="Enter maximum number of participants (1-1000)"
              />
            </div>
            {errors.maxParticipants && (
              <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Ticket Price
            </label>
            <div className="mt-1 relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                step="0.01"
                className="block w-full  h-10 p-1 pl-10 rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <div
              {...getRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="space-y-1 text-center">
                <input {...getInputProps()} />
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image.preview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag and drop an image here, or click to select
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`h-2 w-16 rounded-full ${
                      index + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[currentStep - 1].fields}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                  className={`inline-flex items-center px-4 py-2 rounded-xl ${
                    currentStep === 1
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  Back
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Next
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Event...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 