import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../pages/Header";

const mockedNavigate = jest.fn();
const mockedUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedUseLocation(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedNavigate.mockClear();
  });

  const renderHeader = () => render(<Header />);

  test("renders logo on home page and does not show login or username", () => {
    mockedUseLocation.mockReturnValue({ pathname: "/" });
    renderHeader();
    expect(screen.getByText(/🚲 SwiftRide/i)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  test("shows login button if no user session on ridebooking page", () => {
    mockedUseLocation.mockReturnValue({ pathname: "/ridebooking" });
    renderHeader();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test("clicking login button navigates to booking-signin page", () => {
    mockedUseLocation.mockReturnValue({ pathname: "/ridebooking" });
    renderHeader();
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(mockedNavigate).toHaveBeenCalledWith("/booking-signin");
  });

  test("shows welcome message if user session exists", () => {
    sessionStorage.setItem("userName", "John Doe");
    mockedUseLocation.mockReturnValue({ pathname: "/ridebooking" });
    renderHeader();
    expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  test("clears session on home page", () => {
    sessionStorage.setItem("userName", "John Doe");
    sessionStorage.setItem("userEmail", "john@example.com");
    mockedUseLocation.mockReturnValue({ pathname: "/" });
    renderHeader();
    expect(sessionStorage.getItem("userName")).toBeNull();
    expect(sessionStorage.getItem("userEmail")).toBeNull();
  });
});
