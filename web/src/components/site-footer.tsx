const DATA_SOURCE_URL = "https://github.com/JeffSackmann";
const MIRROR_URL = "https://github.com/Aneeshers/tennis-sackmann-archive";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";

/**
 * Site-wide footer carrying the data attribution required by the source
 * licence (CC BY-NC-SA 4.0), which mandates visible credit on every page.
 * Credits both the original author and the archive mirror the pipeline
 * reads from (see ADR 0003).
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-current/10 px-6 py-6 text-sm">
      <p>
        Data:{" "}
        <a className="underline" href={DATA_SOURCE_URL} rel="noreferrer noopener" target="_blank">
          Jeff Sackmann tennis datasets
        </a>
        , via the{" "}
        <a className="underline" href={MIRROR_URL} rel="noreferrer noopener" target="_blank">
          Aneeshers archive mirror
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
