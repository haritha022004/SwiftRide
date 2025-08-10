// src/pages/BookBike.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BikeCard from '../components/BikeCard';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const bikeData = [
  { id: 1, model: 'Royal Enfield Classic', price: 800, imageUrl: 'https://source.unsplash.com/800x600/?enfield,bike', location: 'Hyderabad' },
  { id: 2, model: 'Honda Activa', price: 400, imageUrl: 'https://source.unsplash.com/800x600/?activa,scooter', location: 'Chennai' },
  { id: 3, model: 'Yamaha FZ', price: 500, imageUrl: 'https://source.unsplash.com/800x600/?yamaha,bike', location: 'Hyderabad' },
  { id: 4, model: 'Suzuki Access', price: 350, imageUrl: 'https://source.unsplash.com/800x600/?suzuki,scooter', location: 'Bangalore' },
  { id: 5, model: 'KTM Duke', price: 900, imageUrl: 'https://source.unsplash.com/800x600/?ktm,bike', location: 'Hyderabad' },
  { id: 6, model: 'TVS Jupiter', price: 300, imageUrl: 'https://source.unsplash.com/800x600/?tvs,scooter', location: 'Chennai' },
  { id: 7, model: 'Bajaj Pulsar', price: 600, imageUrl: 'https://source.unsplash.com/800x600/?pulsar,bike', location: 'Bangalore' },
];

const locations = ['Hyderabad', 'Chennai', 'Bangalore'];

function BookBike() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBike, setSelectedBike] = useState(null);
  const [toast, setToast] = useState({ message: '', variant: 'info' });

  const location = searchParams.get('location') || '';
  const date = searchParams.get('date') || '';
  const sort = searchParams.get('sort') || '';
  const price = parseInt(searchParams.get('price') || '0');
  const page = parseInt(searchParams.get('page') || '1');

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const filteredBikes = bikeData
    .filter((bike) => location ? bike.location.toLowerCase() === location.toLowerCase() : true)
    .filter((bike) => bike.price >= price)
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'model') return a.model.localeCompare(b.model);
      return 0;
    });

  const bikesPerPage = 6;
  const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);
  const paginatedBikes = filteredBikes.slice((page - 1) * bikesPerPage, page * bikesPerPage);

  const closeModal = () => setSelectedBike(null);

  const showToast = (message, variant = 'info') => {
    setToast({ message, variant });
    setTimeout(() => setToast({ message: '', variant: 'info' }), 3000);
  };

  const confirmBooking = () => {
    console.log('Booking confirmed:', selectedBike);
    showToast(`✅ Booked ${selectedBike.model} successfully!`, 'success');
    closeModal();
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full space-y-6 pt-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <select
          value={location}
          onChange={(e) => updateParam('location', e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">📍 All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">🔃 Sort by</option>
          <option value="price">💰 Price</option>
          <option value="model">🚲 Model</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Price: ₹{price}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={price}
            onChange={(e) => updateParam('price', e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Booking Info Summary */}
      <div className="text-gray-800 dark:text-gray-300 space-y-1">
        <p><strong>📍 Location:</strong> {location || 'Any'}</p>
        <p><strong>📅 Date:</strong> {date || 'Not selected'}</p>
        <p><strong>🔃 Sort:</strong> {sort || 'None'}</p>
        <p><strong>💰 Min Price:</strong> ₹{price}</p>
      </div>

      {/* Bike Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginatedBikes.length > 0 ? (
          paginatedBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} onBook={setSelectedBike} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <img
              src="https://illustrations.popsy.co/gray/searching.svg"
              alt="No bikes found"
              className="mx-auto w-48 h-48"
            />
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
              No bikes found for that filter.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => updateParam('page', page - 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => updateParam('page', page + 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedBike && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
              <h3 className="text-xl font-bold">{selectedBike.model}</h3>
              <img
                src={selectedBike.imageUrl}
                alt={selectedBike.model}
                className="w-full h-40 object-cover rounded"
              />
              <p>📍 Location: {selectedBike.location}</p>
                           <p>💰 Price: ₹{selectedBike.price}</p>
              <p>📅 Date: {date || 'Not selected'}</p>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast({ message: '', variant: 'info' })}
        />
      )}
    </div>
  );
}

export default BookBike;