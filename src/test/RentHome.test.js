import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RentHome from "../pages/RentHome";
import { MemoryRouter } from "react-router-dom";

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock sessionStorage
beforeAll(() => {
  window.sessionStorage.setItem("userEmail", "test@example.com");
});

// Mock window.alert
beforeAll(() => {
  window.alert = jest.fn();
});

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/get-bikes/")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            bikes: [
              {
                _id: "1",
                bikeBrand: "Brand A",
                bikeModel: "Model A",
                year: 2020,
                mileage: 50,
                engineCC: 150,
                fuelType: "Petrol",
                transmission: "Manual",
                description: "Nice bike",
                bikeImages: [],
                documents: [],
                available: false,
                approved: false,
              },
            ],
          }),
      });
    }

    if (url.includes("/rent-available")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Bike made available!" }),
      });
    }

    return Promise.reject("API failed");
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders loading spinner first", () => {
  render(
    <MemoryRouter>
      <RentHome />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading your bikes/i)).toBeInTheDocument();
});

test("renders bikes and Add New Bike button", async () => {
  render(
    <MemoryRouter>
      <RentHome />
    </MemoryRouter>
  );

  // Wait for bikes to load
  await waitFor(() => {
    expect(screen.getByText(/Brand A Model A/i)).toBeInTheDocument();
  });

  // Add New Bike button
  const addBtn = await screen.findByText(/add new bike/i);
  fireEvent.click(addBtn);

  expect(mockedNavigate).toHaveBeenCalledWith("/add-bike");
});

test("makes bike available when button clicked", async () => {
  // Mock prompt
  window.prompt = jest
    .fn()
    .mockReturnValueOnce("2025-10-10") // date
    .mockReturnValueOnce("500"); // price

  render(
    <MemoryRouter>
      <RentHome />
    </MemoryRouter>
  );

  // Wait for bikes to load
  const makeBtn = await screen.findByText(/make available for rent/i);

  fireEvent.click(makeBtn);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Bike made available!");
  });
});
