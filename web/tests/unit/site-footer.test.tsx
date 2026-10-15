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

  it("credits the archive mirror", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: /aneeshers archive mirror/i })).toHaveAttribute(
      "href",
      "https://github.com/Aneeshers/tennis-sackmann-archive",
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
