import { render } from "@testing-library/react";

import SplashScreen from ".";

import "@testing-library/jest-dom";

describe("SplashScreen", () => {
  test("is transitioning", () => {
    const { container } = render(<SplashScreen isTransitioning={true} />);

    expect(container).toMatchSnapshot();
  });

  test("is not transitioning", () => {
    const { container } = render(<SplashScreen isTransitioning={false} />);

    expect(container).toMatchSnapshot();
  });
});
