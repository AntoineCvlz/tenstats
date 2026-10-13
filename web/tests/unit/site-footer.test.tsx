import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter", () => {
  it("credits the data source", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: /jeff sackmann/i })).toHaveAttribute(
      "href",
      "https://github.com/JeffSackmann",
    );
  });

  it("states the licence", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: /cc by-nc-sa 4\.0/i })).toHaveAttribute(
      "href",
      "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    );
  });
});
