import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(); // mock fetch calls
    global.alert = jest.fn(); // mock alert calls
    sessionStorage.clear();   // reset session storage before each test
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ✅ 1. Basic rendering
  test("renders input fields and sign-in button", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in & manage rentals/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  // ✅ 2. Successful login flow
  test("successful login navigates and stores user data", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { name: "John Doe" } }),
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

    fireEvent.click(
      screen.getByRole("button", { name: /sign in & manage rentals/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem("userEmail")).toBe("john@example.com");
      expect(sessionStorage.getItem("userName")).toBe("John Doe");
      expect(mockedNavigate).toHaveBeenCalledWith("/rent-home");
      expect(global.alert).not.toHaveBeenCalled();
    });
  });

  // ✅ 3. Invalid credentials
  test("shows alert on login failure", async () => {
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

    fireEvent.click(
      screen.getByRole("button", { name: /sign in & manage rentals/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  // ✅ 4. Network error handling
  test("shows alert when fetch throws an error", async () => {
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

    fireEvent.click(
      screen.getByRole("button", { name: /sign in & manage rentals/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith("Something went wrong");
    });
  });

  // ✅ 5. Sign-up navigation link
  test("sign-up link navigates correctly", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const signUpLink = screen.getByRole("link", { name: /sign up here/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });
});
