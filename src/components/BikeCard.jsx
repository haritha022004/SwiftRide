// src/components/BikeCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

function BikeCard({ bike, onBook }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 cursor-pointer"
      onClick={() => onBook(bike)}
    >
      <img
        src={bike.imageUrl}
        alt={bike.model}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">
        {bike.model}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        ₹{bike.price}/day
      </p>
      <button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent click
          onBook(bike);
        }}
      >
        Book Now
      </button>
    </motion.div>
  );
}

export default BikeCard;