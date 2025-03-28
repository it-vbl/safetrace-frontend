import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import SplashScreen from ".";

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
