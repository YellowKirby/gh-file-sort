export const enum Sort {
  Alphabetical = "alpha",
  MostChanges = "most-changes",
  FewestChanges = "fewest-changes",
}

export const enum Type {
  Deleted = "deleted",
  Added = "added",
  Fallback = "fallback",
  Glob = "glob",
}

interface BaseEntry {
  id: string;
  sort: Sort;
  collapse: boolean;
}

interface GlobEntry extends BaseEntry {
  type: Type.Glob;
  glob: string;
}

interface SpecialEntry extends BaseEntry {
  type: Exclude<Type, Type.Glob>;
}

export type Entry = GlobEntry | SpecialEntry;

export function createEntry(props: { type: Type } & Partial<Entry>): Entry {
  const base = {
    id: crypto.randomUUID(),
    sort: Sort.Alphabetical,
    collapse: false,
  } as const;

  if (props.type === Type.Glob) {
    return Object.assign(base, { glob: "" }, props);
  }

  return Object.assign(base, props);
}
