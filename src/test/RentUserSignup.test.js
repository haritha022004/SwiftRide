import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();   // Mock fetch
    global.alert = jest.fn();   // Mock window.alert
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders all input fields and button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/join swiftrider to start renting your bike/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();
  });

  test("shows password mismatch error", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("submits form successfully when all fields are valid", async () => {
    // Mock successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // Wait for fetch call and navigation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/rent-user/register"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "JohnDoe",
            email: "john@example.com",
            phone: "1234567890",
            password: "password123",
            confirmPassword: "password123",
            agree: true,
          }),
        }
      );
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/signin");
      expect(global.alert).not.toHaveBeenCalled(); // ensure no alert
    });
  });

  test("handles fetch error when registration fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Registration failed" }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).not.toHaveBeenCalled(); // should not navigate on error
      expect(global.alert).toHaveBeenCalled(); // alert should show
    });
  });

  test("clears error when user starts typing in a field", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "J" } });

    await waitFor(() => {
      expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
    });
  });

  test("renders sign in link correctly", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const signInLink = screen.getByRole('link', { name: /sign in here/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });
});
