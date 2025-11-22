import { fireEvent,render, screen } from '@testing-library/react';

import DateRange from './index';

describe('DateRange Component', () => {
  test('renders with placeholder text', () => {
    render(<DateRange placeholder="Select date range" />);
    expect(screen.getByText('Select date range')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(<DateRange />);
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    expect(screen.getByText('Tanggal Mulai')).toBeInTheDocument();
    expect(screen.getByText('Tanggal Selesai')).toBeInTheDocument();
  });

  test('displays selected date range correctly', () => {
    const value = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };
    render(<DateRange value={value} />);
    expect(screen.getByText('01 Jan 2024 - 31 Jan 2024')).toBeInTheDocument();
  });

  test('calls onChange when Terapkan is clicked', () => {
    const mockOnChange = jest.fn();
    render(<DateRange onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    const startInput = screen.getByLabelText('Tanggal Mulai');
    const endInput = screen.getByLabelText('Tanggal Selesai');
    const terapkanButton = screen.getByText('Terapkan');

    fireEvent.change(startInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endInput, { target: { value: '2024-01-31' } });
    fireEvent.click(terapkanButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });
  });

  test('prevents end date from being earlier than start date', () => {
    render(<DateRange />);

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    const startInput = screen.getByLabelText('Tanggal Mulai');
    const endInput = screen.getByLabelText('Tanggal Selesai');

    // Set start date
    fireEvent.change(startInput, { target: { value: '2024-01-15' } });

    // Try to set end date before start date
    fireEvent.change(endInput, { target: { value: '2024-01-10' } });

    // End date should not be updated
    expect(endInput.value).toBe('');
  });

  test('prevents start date from being later than end date', () => {
    render(<DateRange />);

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    const startInput = screen.getByLabelText('Tanggal Mulai');
    const endInput = screen.getByLabelText('Tanggal Selesai');

    // Set end date first
    fireEvent.change(endInput, { target: { value: '2024-01-15' } });

    // Check that start input has max attribute set to end date
    expect(startInput.getAttribute('max')).toBe('2024-01-15');

    // Try to set start date after end date
    fireEvent.change(startInput, { target: { value: '2024-01-20' } });

    // Start date should not be updated
    expect(startInput.value).toBe('');
  });
});
