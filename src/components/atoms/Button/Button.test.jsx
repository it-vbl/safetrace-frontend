import { fireEvent, render, screen } from "@testing-library/react";

import Button from ".";

import "@testing-library/jest-dom";

describe("Button", () => {
  it("is rendered", async () => {
    render(<Button>Button</Button>);

    const buttonElement = await screen.findByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });

  it("is can be clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Button</Button>);

    const buttonElement = await screen.findByRole("button");

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is can NOT be clicked if button disabled", async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} isDisabled={true}>
        Button
      </Button>,
    );

    const buttonElement = await screen.findByRole("button");

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});

describe("Button snapshot", () => {
  it("is matches the snapshot loading state", () => {
    const { asFragment } = render(<Button isLoading={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is mathces the snapshot disabled state", () => {
    const { asFragment } = render(<Button isDisabled={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot primary state", () => {
    const { asFragment } = render(<Button variant="primary" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot secondary state", () => {
    const { asFragment } = render(<Button variant="secondary" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot tertiary state", () => {
    const { asFragment } = render(<Button variant="tertiary" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot large state", () => {
    const { asFragment } = render(<Button size="large" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot medium state", () => {
    const { asFragment } = render(<Button size="medium" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot small state", () => {
    const { asFragment } = render(<Button size="small" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("is matches the snapshot extra small state", () => {
    const { asFragment } = render(<Button size="extraSmall" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
