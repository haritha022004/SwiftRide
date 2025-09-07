import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";

// Helper component to read current path
function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe("Home Page", () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ridebooking" element={<LocationDisplay />} />
          <Route path="/signin" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );
  });

  test("renders headings and CTA buttons", () => {
    // Hero heading
    expect(screen.getByRole("heading", { name: /welcome to swiftride/i })).toBeInTheDocument();

    // Feature headings
    expect(screen.getByRole("heading", { name: /fast booking/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /affordable/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quality bikes/i })).toBeInTheDocument();

    // Buttons exist and are enabled (clickable)
    const bookButton = screen.getByRole("button", { name: /book a bike/i });
    const rentButton = screen.getByRole("button", { name: /give rent/i });
    expect(bookButton).toBeInTheDocument();
    expect(bookButton).toBeEnabled();
    expect(rentButton).toBeInTheDocument();
    expect(rentButton).toBeEnabled();
  });

  test("Book a Bike button navigates to /ridebooking", async () => {
    const bookButton = screen.getByRole("button", { name: /book a bike/i });

    // Fire click
    await userEvent.click(bookButton);

    // Check route changed
    expect(screen.getByTestId("location").textContent).toBe("/ridebooking");
  });

  test("Give Rent button navigates to /signin", async () => {
    const rentButton = screen.getByRole("button", { name: /give rent/i });

    // Fire click
    await userEvent.click(rentButton);

    // Check route changed
    expect(screen.getByTestId("location").textContent).toBe("/signin");
  });
});
