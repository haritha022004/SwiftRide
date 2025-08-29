// src/pages/Profile.jsx
import React from 'react';

function Profile() {
  return (
    <div className="p-6 mt-24 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">👤 My Profile</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome back! Here you can manage your bookings, update your account info, and more.
        </p>

        {/* Example Profile Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Name:</span>
            <span className="text-gray-800 dark:text-gray-100">sai nikhil chitra</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Email:</span>
            <span className="text-gray-800 dark:text-gray-100">sainikhilchitra@gmail.com</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Joined:</span>
            <span className="text-gray-800 dark:text-gray-100">March 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;