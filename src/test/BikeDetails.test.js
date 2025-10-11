import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BikeDetails from "../pages/BikeDetails";


const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: jest.fn(),
}));

import { useLocation } from "react-router-dom";

describe("BikeDetails Component", () => {
  const mockBike = {
    bikeBrand: "Honda",
    bikeModel: "CBR500R",
    year: 2022,
    fuelType: "Petrol",
    transmission: "Manual",
    mileage: 25,
    engineCC: 500,
    features: ["ABS", "LED Lights"],
    bikeImages: [
      { data: "https://via.placeholder.com/600x400" },
      { data: "https://via.placeholder.com/600x400/0000FF" },
    ],
    price: 1500,
    available: true,
    availableDate: "2025-10-15T00:00:00.000Z",
  };

  const mockOwner = {
    username: "JohnDoe",
    email: "john@example.com",
    phone: "1234567890",
  };

  const renderWithLocation = (bike = mockBike, owner = mockOwner) => {
    useLocation.mockReturnValue({
      state: bike ? { bike, owner } : null,
    });

    return render(
      <MemoryRouter>
        <BikeDetails />
      </MemoryRouter>
    );
  };

  test("renders bike details correctly", () => {
    renderWithLocation();
    expect(screen.getByText(/Honda CBR500R/i)).toBeInTheDocument();
    expect(screen.getByText(/ABS/)).toBeInTheDocument();
    expect(screen.getByText(/₹1500/)).toBeInTheDocument();
  });

  test("shows bike not found message when bike data is null", () => {
    renderWithLocation(null, null);
    expect(screen.getByText(/Bike not found/i)).toBeInTheDocument();
  });

  test("thumbnail click changes main image", async () => {
    renderWithLocation();
    const thumbnails = screen.getAllByRole("img", { name: /CBR500R/i });

    // store initial main image src
    const mainImage = screen.getByAltText("CBR500R 1");
    const originalSrc = mainImage.src;

    // click the second thumbnail
    fireEvent.click(thumbnails[1]);

    // wait for main image to update
    await waitFor(() => {
      const updatedMainImage = screen.getByAltText("CBR500R 2");
      expect(updatedMainImage.src).toContain("/0000FF");
      expect(updatedMainImage.src).not.toBe(originalSrc);
    });
  });

  test("book now button navigates if bike is available", () => {
    renderWithLocation();
    const bookBtn = screen.getByRole("button", { name: /Book Now/i });
    fireEvent.click(bookBtn);
    expect(mockedNavigate).toHaveBeenCalledWith("/booking-signin");
  });

  test("book now button disabled if bike is not available", () => {
    const unavailableBike = { ...mockBike, available: false };
    renderWithLocation(unavailableBike, mockOwner);
    const bookBtn = screen.getByRole("button", { name: /Book Now/i });
    expect(bookBtn).toBeDisabled();
  });
});
