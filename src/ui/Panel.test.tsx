import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";

describe("Panel", () => {
  it("renders title, actions, and body", () => {
    render(
      <Panel title="图片" actions={<button type="button">全部</button>}>
        内容
      </Panel>,
    );

    expect(screen.getByRole("heading", { name: "图片" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "全部" })).toBeInTheDocument();
    expect(screen.getByText("内容")).toBeInTheDocument();
  });

  it("omits the header when there is no title or actions", () => {
    render(<Panel>内容</Panel>);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
