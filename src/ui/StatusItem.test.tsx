import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusItem } from "./StatusItem";

describe("StatusItem", () => {
  it("renders label and value", () => {
    render(<StatusItem label="图片" value="12 张" />);

    expect(screen.getByText("图片")).toBeInTheDocument();
    expect(screen.getByText("12 张")).toBeInTheDocument();
  });

  it("renders without a label", () => {
    render(<StatusItem value="100%" />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
