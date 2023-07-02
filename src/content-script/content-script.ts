import { minimatch } from "minimatch";
import browser from "webextension-polyfill";
import { Entry, Sort, Type } from "../util";

const fileEls = Array.from(
  document.querySelectorAll(".js-file[data-tagsearch-path]")
);
const parent = fileEls[0]?.parentElement;

function checkCollapse(fileEl: Element, needsCollapse: boolean): void {
  const isCollapsed = !fileEl.classList.contains("open");

  if (isCollapsed !== needsCollapse) {
    const toggle: HTMLElement | null =
      fileEl.querySelector(".js-details-target");
    toggle?.click();
  }
}

function sort(entries: Entry[]) {
  const fallbackIndex = entries.findIndex(
    (entry) => entry.type === Type.Fallback
  );

  // Primary sort by entry order, but doesn't change the order of 2 files
  // that belong to the same entry
  const grouped = fileEls.reduce((result, fileEl) => {
    const path = fileEl.getAttribute("data-tagsearch-path");
    let index = entries.findIndex((entry: Entry) => {
      if (!path || entry.type !== Type.Glob || !entry.glob) {
        return false;
      }

      return minimatch(path, entry.glob, { matchBase: true });
    });

    if (index === -1) {
      index = fallbackIndex;
    }

    if (index !== -1) {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(fileEl);
      checkCollapse(fileEl, entries[index].collapse);
    }

    return result;
  }, [] as Element[][]);

  // Secondary sort within each entry
  entries.forEach((entry, index) => {
    const group = grouped[index];

    if (entry.sort !== Sort.Alphabetical) {
      group?.sort((a, b) => {
        const aStat = Number(a.querySelector(".diffstat")?.textContent);
        const bStat = Number(b.querySelector(".diffstat")?.textContent);

        return entry.sort === Sort.MostChanges ? bStat - aStat : aStat - bStat;
      });
    }
  });

  parent?.append(...grouped.flat());
}

(async () => {
  const result = await browser.storage.sync.get("entries");
  if (result.entries) {
    sort(result.entries);
  }

  browser.runtime.onMessage.addListener((request) => {
    if (request.entries) {
      sort(request.entries);
    }
  });
})();
