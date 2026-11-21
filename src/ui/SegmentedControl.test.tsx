import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "single", label: "单图" },
  { value: "compare", label: "对比" },
  { value: "grid", label: "多图" },
] as const;

describe("SegmentedControl", () => {
  it("marks the current option as pressed", () => {
    render(
      <SegmentedControl
        label="视图"
        options={options}
        value="compare"
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "对比" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "单图" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange when an option is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SegmentedControl
        label="视图"
        options={options}
        value="single"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "多图" }));

    expect(onChange).toHaveBeenCalledWith("grid");
  });

  it("moves selection with arrow keys and wraps around", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SegmentedControl
        label="视图"
        options={options}
        value="grid"
        onChange={onChange}
      />,
    );

    screen.getByRole("button", { name: "多图" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenCalledWith("single");
    expect(screen.getByRole("button", { name: "单图" })).toHaveFocus();
  });
});
