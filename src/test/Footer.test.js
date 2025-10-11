import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../pages/Footer"; // adjust the path if needed
import renderer from "react-test-renderer"; // for snapshot testing

describe("Footer Component", () => {
  test("renders footer with correct text", () => {
    render(<Footer />);
    
    // Check if the copyright text is present
    const textElement = screen.getByText(/© 2025 SwiftRider. All rights reserved./i);
    expect(textElement).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const tree = renderer.create(<Footer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
