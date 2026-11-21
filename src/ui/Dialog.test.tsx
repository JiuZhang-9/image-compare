import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

type HarnessProps = {
  open: boolean;
  onClose: () => void;
};

function Harness({ open, onClose }: HarnessProps) {
  return (
    <>
      <button type="button">触发器</button>
      <Dialog
        open={open}
        onClose={onClose}
        title="关于"
        description="版本信息"
        footer={
          <>
            <Button>取消</Button>
            <Button variant="primary">确认</Button>
          </>
        }
      >
        <p>内容</p>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    render(<Harness open={false} onClose={() => undefined} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible modal when open", () => {
    render(<Harness open onClose={() => undefined} />);

    const dialog = screen.getByRole("dialog", { name: "关于" });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "关闭" })).toBeInTheDocument();
  });

  it("closes on Escape and on the close button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Harness open onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "关闭" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("traps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Harness open onClose={() => undefined} />);

    screen.getByRole("button", { name: "确认" }).focus();
    await user.tab();

    expect(screen.getByRole("button", { name: "关闭" })).toHaveFocus();
  });

  it("restores focus when unmounted", () => {
    const { rerender } = render(<Harness open={false} onClose={() => undefined} />);
    const trigger = screen.getByRole("button", { name: "触发器" });
    trigger.focus();

    rerender(<Harness open onClose={() => undefined} />);
    rerender(<Harness open={false} onClose={() => undefined} />);

    expect(trigger).toHaveFocus();
  });
});
