import { minimatch } from "minimatch";
import browser from "webextension-polyfill";
import { Entry, Sort, Type } from "../util";

const fileEls = Array.from(
  document.querySelectorAll(".js-file[data-tagsearch-path]")
);
const parent = fileEls[0]?.parentElement;

function sort(items: Entry[]) {
  const fallbackIndex = items.findIndex((item) => item.type === Type.Fallback);

  const grouped = fileEls.reduce((result, fileEl) => {
    const path = fileEl.getAttribute("data-tagsearch-path");
    let index = items.findIndex((item: Entry) => {
      if (!path || item.type !== Type.Glob || !item.glob) {
        return false;
      }

      return minimatch(path, item.glob);
    });

    if (index === -1) {
      index = fallbackIndex;
    }

    if (index !== -1) {
      if (!result[index]) {
        result[index] = [];
      }

      result[index].push(fileEl);
    }

    return result;
  }, [] as Element[][]);

  items.forEach((item, index) => {
    if (item.sort !== Sort.Alphabetical) {
      const group = grouped[index];
      group?.sort((a, b) => {
        const aStat = Number(a.querySelector(".diffstat")?.textContent);
        const bStat = Number(b.querySelector(".diffstat")?.textContent);

        return item.sort === Sort.MostChanges ? bStat - aStat : aStat - bStat;
      });
    }
  });

  if (parent) {
    parent.append(...grouped.flat());
  }
}

(async () => {
  const result = await browser.storage.sync.get("items");
  if (result.items) {
    sort(result.items);
  }

  browser.runtime.onMessage.addListener((request) => {
    if (request.items) {
      sort(request.items);
    }
  });
})();
