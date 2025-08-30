import React from 'react';

function Home() {
  return (
    <div className="space-y-4">
      {/* ✅ Tailwind Test Box */}
      <div className="bg-green-500 text-white p-4 rounded shadow-md">
        ✅ welcome to swiftride.
      </div>

      {/* Your actual homepage content can go below */}
      <h1 className="text-2xl font-bold">Welcome to the Bike Rental App</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Start booking or renting your ride with ease.
      </p>
    </div>
  );
}

export default Home;