// src/pages/RentBike.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function RentBike() {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [document, setDocument] = useState(null);
  const [toast, setToast] = useState({ message: '', variant: 'info' });
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bikeBookings')) || [];
    setBookings(stored);
  }, []);

  const handleRentClick = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setStartDate('');
    setEndDate('');
    setDocument(null);
    setLoading(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setToast({ message: 'Please select both start and end dates.', variant: 'error' });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setToast({ message: 'End date must be after start date.', variant: 'error' });
      return;
    }

    if (!document) {
      setToast({ message: 'Please upload your license or ID.', variant: 'error' });
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500)); // Simulate API call

    const newBooking = {
      bike: 'Royal Enfield Himalayan',
      startDate,
      endDate,
      documentName: document.name,
    };

    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem('bikeBookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    setToast({ message: 'Booking confirmed successfully!', variant: 'success' });
    handleCloseModal();
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full space-y-6 p-6 mt-24">
      <h2 className="text-3xl font-bold text-green-600 dark:text-green-300">🏍️ Rent a Bike</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Explore our fleet of bikes available for rent. Select your ride, upload your documents, and hit the road in style.
      </p>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Royal Enfield Himalayan</h3>
        <p className="text-gray-700 dark:text-gray-300">📍 Hyderabad</p>
        <p className="text-gray-700 dark:text-gray-300">💸 ₹800/day</p>
        <button
          onClick={handleRentClick}
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
        >
          Rent Now
        </button>
      </div>

      {/* Bookings List */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
        <h4 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">📋 Your Bookings</h4>
        {bookings.length ? (
          <ul className="space-y-2">
            {bookings.map((b, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                ✅ {b.bike} from {b.startDate} to {b.endDate} ({b.documentName})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">📅 Confirm Your Booking</h3>
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload License / ID
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.png,.pdf"
                    onChange={(e) => setDocument(e.target.files[0])}
                    className="w-full px-3 py-2 rounded border dark:border-gray-700 focus:ring-2 focus:ring-green-500"
                  />
                  {document && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {document.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(document)}
                          alt="Preview"
                          className="mt-2 rounded shadow max-h-40"
                        />
                      ) : (
                        <p>📄 {document.name}</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded text-white ${
                    loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
              <button
                onClick={handleCloseModal}
                className="mt-4 w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white transition ${
            toast.variant === 'success'
              ? 'bg-green-600'
              : toast.variant === 'error'
              ? 'bg-red-600'
              : 'bg-blue-600'
          }`}
        >
          {toast.message}
          <button
            onClick={() => setToast({ message: '', variant: 'info' })}
            className="ml-4 text-white font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default RentBike;