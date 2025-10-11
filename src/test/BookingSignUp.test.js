import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/BookingSignUp";

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock alert
beforeAll(() => {
  window.alert = jest.fn();

  // Mock FileReader to simulate async Base64 load
  class MockFileReader {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this.result = null;
    }
    readAsDataURL(file) {
      setTimeout(() => {
        this.result = "data:application/pdf;base64,FAKE_BASE64";
        if (this.onload) this.onload({ target: this });
      }, 0);
    }
  }
  global.FileReader = MockFileReader;
});

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all inputs and button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Confirm Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/License upload is required/i)).toBeInTheDocument();
      expect(screen.getByText(/You must accept the terms/i)).toBeInTheDocument();
    });
  });

  test("handles file upload correctly", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const file = new File(["dummy content"], "license.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText(/Upload Driver's License/i);

    await userEvent.upload(fileInput, file);

    // Wait for component to update with uploaded file
    expect(await screen.findByText(/license.pdf selected/i)).toBeInTheDocument();
  });

  test("shows file size error for large file", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText(/Upload Driver's License/i);

    await userEvent.upload(fileInput, largeFile);

    expect(await screen.findByText(/File size must be less than 5MB/i)).toBeInTheDocument();
  });

  test("submits form successfully and navigates", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/^Confirm Password$/i), { target: { value: "password123" } });

    const file = new File(["dummy content"], "license.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText(/Upload Driver's License/i);
    await userEvent.upload(fileInput, file);

    // Wait for file state to update
    await screen.findByText(/license.pdf selected/i);

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Registration successful"));
      expect(mockedNavigate).toHaveBeenCalledWith("/booking-signin");
    });
  });
});
