import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../pages/BookingSignIn";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("SignIn Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // suppress expected errors
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    sessionStorage.clear();
    mockedNavigate.mockClear();
    global.fetch = jest.fn();
  });

  it("renders email, password fields and submit button", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In & Manage Rentals/i })
    ).toBeInTheDocument();
  });

  it("successful login sets sessionStorage and navigates", async () => {
    const mockUserResponse = { user: { name: "John Doe" } };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserResponse,
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In & Manage Rentals/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("userEmail")).toBe("john@example.com");
      expect(sessionStorage.getItem("userName")).toBe("John Doe");
      expect(mockedNavigate).toHaveBeenCalledWith("/ridebooking");
    });
  });

  it("shows alert on failed login", async () => {
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In & Manage Rentals/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Invalid credentials");
    });

    mockAlert.mockRestore();
  });

  it("handles network errors gracefully", async () => {
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In & Manage Rentals/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Something went wrong");
    });

    mockAlert.mockRestore();
  });
});
