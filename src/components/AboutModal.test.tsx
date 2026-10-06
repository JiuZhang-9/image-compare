// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../i18n";
import AboutModal from "./AboutModal";

describe("AboutModal", () => {
  beforeEach(() => localStorage.setItem("image-viewer-language", "zh"));
  afterEach(cleanup);

  it("shows the three information sections", async () => {
    const user = userEvent.setup();
    render(<I18nProvider><AboutModal onClose={vi.fn()} /></I18nProvider>);

    expect(screen.getByRole("dialog", { name: "关于" })).toBeDefined();
    expect(screen.getByText("v1.2.0")).toBeDefined();
    await user.click(screen.getByRole("tab", { name: "反馈交流" }));
    expect(screen.getByText("QQ 交流群")).toBeDefined();
    expect(screen.getByText(/748934113/)).toBeDefined();
    await user.click(screen.getByRole("tab", { name: "支持开发" }));
    expect(screen.getByRole("img", { name: "微信支持" })).toBeDefined();
    expect(screen.getByRole("img", { name: "支付宝支持" })).toBeDefined();
  });

  it("closes with Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<I18nProvider><AboutModal onClose={onClose} /></I18nProvider>);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
