import React, { useState } from "react";

export default function BikeRentalApp() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "rent") {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?motorcycle')" }}>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">Rent a Bike</h1>
          <p className="text-lg text-white">This is the Rent a Bike page.</p>
          <button className="mt-6 bg-white text-black px-4 py-2 rounded-2xl shadow hover:bg-gray-200"
            onClick={() => setPage("home")}>Back</button>
        </div>
      );
    } 
    if (page === "book") {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?bike')" }}>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">Book a Bike</h1>
          <p className="text-lg text-white">This is the Book a Bike page.</p>
          <button className="mt-6 bg-white text-black px-4 py-2 rounded-2xl shadow hover:bg-gray-200"
            onClick={() => setPage("home")}>Back</button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?bikes')" }}>
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-8">Bike Rental Service</h1>
        <div className="flex gap-4">
          <button className="bg-white text-black text-lg px-6 py-3 rounded-2xl shadow hover:bg-gray-200"
            onClick={() => setPage("rent")}>Rent a Bike</button>
          <button className="bg-white text-black text-lg px-6 py-3 rounded-2xl shadow hover:bg-gray-200"
            onClick={() => setPage("book")}>Book a Bike</button>
        </div>
      </div>
    );
  };

  return <>{renderPage()}</>;
}
