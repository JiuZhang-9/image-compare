import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with the default type", () => {
    render(<Button>导入</Button>);

    expect(screen.getByRole("button", { name: "导入" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>确认</Button>);

    await user.click(screen.getByRole("button", { name: "确认" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire while disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        确认
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "确认" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the requested variant and size", () => {
    render(
      <Button variant="primary" size="sm">
        确认
      </Button>,
    );

    expect(screen.getByRole("button", { name: "确认" })).toHaveClass(
      "bg-app-accent",
      "h-7",
      "text-ui",
    );
  });
});
