import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import LoadingOverlay from ".";

const mockStore = (state) => createStore(() => state);

describe("LoadingOverlay Component", () => {
  test("should render the loading spinner when isVisible is true", () => {
    const store = mockStore({
      loader: { isVisible: true },
    });

    render(
      <Provider store={store}>
        <LoadingOverlay />
      </Provider>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("should not render the loading spinner when isVisible is false", () => {
    const store = mockStore({
      loader: { isVisible: false },
    });

    render(
      <Provider store={store}>
        <LoadingOverlay />
      </Provider>,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("should match snapshot when isVisible is true", () => {
    const store = mockStore({
      loader: { isVisible: true },
    });

    const { asFragment } = render(
      <Provider store={store}>
        <LoadingOverlay />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("should match snapshot when isVisible is false", () => {
    const store = mockStore({
      loader: { isVisible: false },
    });

    const { asFragment } = render(
      <Provider store={store}>
        <LoadingOverlay />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
