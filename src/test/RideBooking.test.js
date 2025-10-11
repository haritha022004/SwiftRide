import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RideBooking from "../pages/RideBooking";
import '@testing-library/jest-dom';

// Suppress specific console warnings and errors during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      args[0].includes("React Router Future Flag Warning") ||
      args[0].includes("punycode module is deprecated")
    ) return;
    originalWarn(...args);
  };
});

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0]?.toString() || "";
    if (
      msg.includes("not wrapped in act") ||
      msg.includes("Network Error") ||
      msg.includes("API failed") ||
      msg.includes("react-test-renderer is deprecated") ||
      msg.includes("punycode module is deprecated")
    ) return;
    originalError(...args);
  };
});

// Mock fetch to return sample bikes data by default
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        bikes: [
          { 
            _id: "1", 
            bikeBrand: "Brand A", 
            bikeModel: "Bike A", 
            approved: true, 
            available: true 
          },
          { 
            _id: "2", 
            bikeBrand: "Brand B", 
            bikeModel: "Bike B", 
            approved: true, 
            available: true 
          }
        ]
      }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

describe("RideBooking Component", () => {
  test("shows loading initially", () => {
    render(
      <MemoryRouter>
        <RideBooking />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading bikes/i)).toBeInTheDocument();
  });

  test("renders bike list after fetch", async () => {
    render(
      <MemoryRouter>
        <RideBooking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/bike a/i)).toBeInTheDocument();
      expect(screen.getByText(/bike b/i)).toBeInTheDocument();
    });
  });

  test("shows 'no bikes available' if bikes array is empty", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ bikes: [] }),
      })
    );

    render(
      <MemoryRouter>
        <RideBooking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no bikes available/i)).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API failed"));

    render(
      <MemoryRouter>
        <RideBooking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no bikes available/i)).toBeInTheDocument();
    });
  });
});
