import { useRouter } from "next/router";
import moment from "moment";

import { fireEvent,render, screen } from "@testing-library/react";

import CardInformation from ".";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("CardInformation component", () => {
  const mockPush = jest.fn();
  const announcement = {
    id: "12345",
    heroImage: "https://example.com/image.jpg",
    title: "Test Announcement",
    type: "Event",
    createdAt: "2024-11-01T00:00:00Z",
  };

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with the correct props and matches the snapshot", () => {
    const { container } = render(
      <CardInformation announcement={announcement} />,
    );

    const image = screen.getByAltText(announcement.title);
    const title = screen.getByText(announcement.title);
    const type = screen.getByText(announcement.type);
    const date = screen.getByText(
      `Diterbitkan ${moment.utc(announcement.createdAt).format("DD MMMM YYYY")}`,
    );

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", announcement.heroImage);
    expect(title).toBeInTheDocument();
    expect(type).toBeInTheDocument();
    expect(date).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("navigates to the correct URL when clicked", () => {
    render(<CardInformation announcement={announcement} />);

    const card = screen.getByRole("img", { name: announcement.title });
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith(
      `/beranda/announcement-event/${announcement.id}`,
    );
  });
});
