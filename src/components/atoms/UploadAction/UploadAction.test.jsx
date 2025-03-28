import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import UploadAction from ".";

describe("UploadAction", () => {
  const defaultProps = {
    onChange: jest.fn(),
    className: "custom-class",
    id: "test-upload",
    label: "Upload File",
    allowedFiles: [".jpg", ".png", ".pdf"],
  };

  it("should render the component with default props", () => {
    render(<UploadAction {...defaultProps} />);
    const uploadLabel = screen.getByTestId("upload-action-label");

    expect(uploadLabel).toBeInTheDocument();
    expect(uploadLabel).toHaveTextContent("Upload File");
    expect(uploadLabel).toHaveClass("custom-class");
  });

  it("should render the input element with correct attributes", () => {
    render(<UploadAction {...defaultProps} />);
    const inputElement = screen
      .getByTestId("upload-action")
      .querySelector("input");

    expect(inputElement).toHaveAttribute("type", "file");
    expect(inputElement).toHaveAttribute("id", "upload-test-upload");
    expect(inputElement).toHaveClass("hidden");
    expect(inputElement).toHaveAttribute("accept", ".jpg,.png,.pdf");
  });

  it("should call onChange when a file is selected", () => {
    render(<UploadAction {...defaultProps} />);
    const inputElement = screen
      .getByTestId("upload-action")
      .querySelector("input");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    fireEvent.change(inputElement, { target: { files: [file] } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("should render with custom label text", () => {
    const customLabel = "Custom Upload Label";
    render(<UploadAction {...defaultProps} label={customLabel} />);
    const uploadLabel = screen.getByTestId("upload-action-label");

    expect(uploadLabel).toHaveTextContent(customLabel);
  });

  it("should apply additional className to the label", () => {
    const additionalClass = "extra-class";
    render(
      <UploadAction
        {...defaultProps}
        className={`${defaultProps.className} ${additionalClass}`}
      />,
    );
    const uploadLabel = screen.getByTestId("upload-action-label");

    expect(uploadLabel).toHaveClass("custom-class");
    expect(uploadLabel).toHaveClass("extra-class");
  });

  it("should use default values when optional props are not provided", () => {
    const { onChange } = defaultProps;
    render(<UploadAction onChange={onChange} />);
    const uploadLabel = screen.getByTestId("upload-action-label");
    const inputElement = screen
      .getByTestId("upload-action")
      .querySelector("input");

    expect(uploadLabel).toHaveTextContent("Upload File");
    expect(uploadLabel).not.toHaveClass("custom-class");
    expect(inputElement).toHaveAttribute("id", "upload-");
    expect(inputElement).toHaveAttribute("accept", "");
  });

  it("should handle multiple allowed file types correctly", () => {
    const multipleFileTypes = [".jpg", ".png", ".pdf", ".doc"];
    render(<UploadAction {...defaultProps} allowedFiles={multipleFileTypes} />);
    const inputElement = screen
      .getByTestId("upload-action")
      .querySelector("input");

    expect(inputElement).toHaveAttribute("accept", ".jpg,.png,.pdf,.doc");
  });
});
