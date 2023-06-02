import { minimatch } from "minimatch";
import browser from "webextension-polyfill";
import { Entry, Sort, Type } from "../util";

async function sort() {
  const result = await browser.storage.sync.get("items");
  const items: Entry[] = result.items ?? [];
  const fileEls = Array.from(
    document.querySelectorAll(".js-file[data-tagsearch-path]")
  );
  const parent = fileEls[0]?.parentElement;

  const fallbackIndex = items.findIndex((item) => item.type === Type.Fallback);
  const grouped = fileEls.reduce((result, file) => {
    const path = file.getAttribute("data-tagsearch-path");
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

      result[index].push(file);
    }

    return result;
  }, [] as Element[][]);

  items.forEach((item, index) => {
    const group = grouped[index];
    if (group) {
      group.sort((a, b) => {
        if (item.sort === Sort.Alphabetical) {
          return 0;
        }

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

sort();

browser.runtime.onMessage.addListener((request) => {
  if (request.sort) {
    sort();
  }
});
