import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../app'; 

describe('App Component', () => {
  test('renders Navbar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const navbarElements = screen.getAllByText(/SwiftRide/i);
    expect(navbarElements[0]).toBeInTheDocument(); 
  });

  test('renders Footer', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const footerElement = screen.getByText(/© 2025 SwiftRider/i);
    expect(footerElement).toBeInTheDocument();
  });

  test('renders Home page at default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const homeElement = screen.getByText(/Welcome to SwiftRide/i);
    expect(homeElement).toBeInTheDocument();
  });

  test('renders RideBooking page at /ridebooking route', () => {
    render(
      <MemoryRouter initialEntries={['/ridebooking']}>
        <App />
      </MemoryRouter>
    );
    const rideBookingElement = screen.getByText(/Loading bikes.../i);
    expect(rideBookingElement).toBeInTheDocument();
  });
});
