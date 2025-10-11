// src/test/AddBike.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddBike from "../pages/AddBike";

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Bike added successfully!" }),
    })
  );

  // Mock alert
  global.alert = jest.fn();

  // Mock sessionStorage
  Storage.prototype.getItem = jest.fn(() => "testuser@example.com");
});

test("renders all input fields, selects, checkboxes, and buttons", () => {
  render(
    <MemoryRouter>
      <AddBike />
    </MemoryRouter>
  );

  // Basic info inputs
  expect(screen.getByPlaceholderText(/e.g., Classic 350, Pulsar 150/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/e.g., Royal Enfield, Bajaj/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/e.g., 2023/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/e.g., 35.5/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/e.g., 350/i)).toBeInTheDocument();

  // Selects
  expect(screen.getByText(/Fuel Type/i)).toBeInTheDocument();
  expect(screen.getByText(/Transmission/i)).toBeInTheDocument();

  // Sections
  expect(screen.getByText(/Features & Amenities/i)).toBeInTheDocument();
  expect(screen.getByText(/Bike Images/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Documents/i })).toBeInTheDocument();

  // Buttons
  expect(screen.getByRole("button", { name: /Save Bike Details/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
});

test("can type into inputs and select options", () => {
  render(
    <MemoryRouter>
      <AddBike />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/e.g., Classic 350, Pulsar 150/i), {
    target: { value: "Pulsar 150" },
  });
  fireEvent.change(screen.getByPlaceholderText(/e.g., Royal Enfield, Bajaj/i), {
    target: { value: "Bajaj" },
  });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 2023/i), { target: { value: "2022" } });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 35.5/i), { target: { value: "40" } });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 350/i), { target: { value: "150" } });

  fireEvent.change(screen.getByDisplayValue("Petrol"), { target: { value: "Diesel" } });
  fireEvent.change(screen.getByDisplayValue("Manual"), { target: { value: "Automatic" } });

  // Check that values updated
  expect(screen.getByPlaceholderText(/e.g., Classic 350, Pulsar 150/i).value).toBe("Pulsar 150");
  expect(screen.getByPlaceholderText(/e.g., Royal Enfield, Bajaj/i).value).toBe("Bajaj");
});

test("can submit the form successfully", async () => {
  render(
    <MemoryRouter>
      <AddBike />
    </MemoryRouter>
  );

  // Fill minimal required fields
  fireEvent.change(screen.getByPlaceholderText(/e.g., Classic 350, Pulsar 150/i), {
    target: { value: "Pulsar 150" },
  });
  fireEvent.change(screen.getByPlaceholderText(/e.g., Royal Enfield, Bajaj/i), {
    target: { value: "Bajaj" },
  });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 2023/i), { target: { value: "2022" } });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 35.5/i), { target: { value: "40" } });
  fireEvent.change(screen.getByPlaceholderText(/e.g., 350/i), { target: { value: "150" } });

  fireEvent.click(screen.getByRole("button", { name: /Save Bike Details/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith("Bike added successfully!");
    expect(mockedNavigate).toHaveBeenCalledWith("/rent-home");
  });
});

test("shows validation errors if required fields are empty", async () => {
  render(
    <MemoryRouter>
      <AddBike />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: /Save Bike Details/i }));

  expect(await screen.findByText(/Bike model is required/i)).toBeInTheDocument();
  expect(screen.getByText(/Bike brand is required/i)).toBeInTheDocument();
  expect(screen.getByText(/Manufacturing year is required/i)).toBeInTheDocument();
  expect(screen.getByText(/Mileage is required/i)).toBeInTheDocument();
  expect(screen.getByText(/Engine capacity is required/i)).toBeInTheDocument();
});
