import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StarGroup from '../components/StarGroup';

describe('StarGroup component', () => {
  it('renders with correct props', () => {
    const setRatingMock = jest.fn();
    const { getAllByRole } = render(<StarGroup setRating={setRatingMock} />);
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('updates rating when a star is clicked', () => {
    const setRatingMock = jest.fn();
    const { container } = render(<StarGroup setRating={setRatingMock} />);
    fireEvent.click(container.getElementsByClassName("star")[3]);
    expect(setRatingMock).toHaveBeenCalledWith(4);
    expect(container.getElementsByClassName("starClicked")).toHaveLength(4);
  });

  it('clears clickedId when isSubmitted prop is true', () => {
    const setRatingMock = jest.fn();
    const { rerender } = render(<StarGroup setRating={setRatingMock} isSubmitted={false} />);
    rerender(<StarGroup setRating={setRatingMock} isSubmitted={true} />);
    expect(setRatingMock).not.toHaveBeenCalled();
  });

  it('updates hoverId when mouse is over a star', () => {
    const setRatingMock = jest.fn();
    const { container } = render(<StarGroup setRating={setRatingMock} />);
    fireEvent.mouseOver(container.getElementsByClassName("star")[2]);
    expect(container.getElementsByClassName("starHover")).toHaveLength(3);
  });

  it('resets hoverId when mouse leaves a star', () => {
    const setRatingMock = jest.fn();
    const { container } = render(<StarGroup setRating={setRatingMock} />);
    fireEvent.mouseOver(container.getElementsByClassName("star")[1]);
    fireEvent.mouseOut(container.getElementsByClassName("starHover")[1]);
    expect(container.getElementsByClassName("star")).toHaveLength(5);
  });
});
