const DATA_SOURCE_URL = "https://github.com/JeffSackmann";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";

/**
 * Site-wide footer carrying the data attribution required by the source
 * licence (CC BY-NC-SA 4.0), which mandates visible credit on every page.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-current/10 px-6 py-6 text-sm">
      <p>
        Data:{" "}
        <a className="underline" href={DATA_SOURCE_URL} rel="noreferrer noopener" target="_blank">
          Jeff Sackmann tennis datasets
        </a>
        , licensed under{" "}
        <a className="underline" href={LICENSE_URL} rel="noreferrer noopener" target="_blank">
          CC BY-NC-SA 4.0
        </a>
        . Non-commercial use only.
      </p>
    </footer>
  );
}
