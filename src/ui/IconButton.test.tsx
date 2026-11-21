import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("uses the label as its accessible name", () => {
    render(
      <IconButton label="关闭">
        <span aria-hidden="true">x</span>
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "关闭" });

    expect(button).toHaveAttribute("title", "关闭");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("reflects the active state", () => {
    render(
      <IconButton label="同步" active>
        <span aria-hidden="true">s</span>
      </IconButton>,
    );

    expect(screen.getByRole("button", { name: "同步" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton label="旋转" onClick={onClick}>
        <span aria-hidden="true">r</span>
      </IconButton>,
    );

    await user.click(screen.getByRole("button", { name: "旋转" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
