<script lang="ts">
  import { Sort, Entry, Type, createEntry } from "../util";
  import { createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import IconAdd from "../assets/add.svg?c";
  import IconRemove from "../assets/remove.svg?c";
  import IconDrag from "../assets/drag.svg?c";

  export let entries: Entry[] = [createEntry({ type: Type.Fallback })];

  const flipDurationMs = 250;
  const dispatch = createEventDispatcher();

  let isDragging = false;

  function save() {
    const sanitized = entries.filter((entry) => {
      const isEmptyGlob = entry.type === Type.Glob && !entry.glob;
      return !isEmptyGlob;
    });
    dispatch("save", { entries: sanitized });
  }

  function addEntry(index: number) {
    entries.splice(index, 0, createEntry({ type: Type.Glob }));
    entries = entries;
    save();
  }

  function removeEntry(index: number) {
    entries.splice(index, 1);
    entries = entries;
    save();
  }

  function consider(event: CustomEvent) {
    isDragging = true;
    entries = event.detail.items;
  }

  function finalize(event: CustomEvent) {
    isDragging = false;
    entries = event.detail.items;
    save();
  }

  function transformDraggedElement(draggedEl?: HTMLElement) {
    draggedEl?.querySelector(".add")?.classList.add("dragging");
  }
</script>

<div class="row headings">
  <span>Glob</span>
  <span>Sort</span>
  <span>Collapse</span>
</div>
<button
  aria-label="Add row"
  class="add"
  class:dragging={isDragging}
  on:click={() => {
    addEntry(0);
  }}
>
  <IconAdd />
</button>

<div
  use:dndzone={{
    items: entries,
    flipDurationMs,
    dropTargetStyle: {},
    transformDraggedElement,
  }}
  on:consider={consider}
  on:finalize={finalize}
>
  {#each entries as entry, index (entry.id)}
    <div class="card" animate:flip={{ duration: flipDurationMs }}>
      <form class="row entry" on:submit|preventDefault={save}>
        <IconDrag />
        {#if entry.type === Type.Glob}
          <input aria-label="Glob" bind:value={entry.glob} on:blur={save} />
        {:else}
          <span>All other files</span>
        {/if}
        <select aria-label="Sort" bind:value={entry.sort} on:change={save}>
          <option value={Sort.Alphabetical}>Alphabetical (default)</option>
          <option value={Sort.MostChanges}>Most changes</option>
          <option value={Sort.FewestChanges}>Fewest changes</option>
        </select>
        <input
          aria-label="Collapse"
          type="checkbox"
          bind:checked={entry.collapse}
          on:change={save}
        />
        {#if entry.type === Type.Glob}
          <button
            type="button"
            aria-label={`Delete row ${index + 1}`}
            class="remove"
            on:click={() => {
              removeEntry(index);
            }}
          >
            <IconRemove />
          </button>
        {/if}
      </form>
      <button
        aria-label="Add row"
        class="add"
        class:dragging={isDragging}
        on:click={() => {
          addEntry(index + 1);
        }}
      >
        <IconAdd />
      </button>
    </div>
  {/each}
</div>

<style>
  :global(body) {
    min-width: 600px;
    background-color: #f4f5f5;
    font-family: sans-serif;
  }

  * > :global(svg) {
    height: 100%;
  }

  .row {
    display: grid;
    grid-template-columns: 24px 4fr 3fr 1fr 36px;
    padding: 4px 12px;
    gap: 0px 12px;
  }

  .headings {
    justify-items: center;
    align-items: end;
  }

  .headings > *:first-child {
    grid-column-start: 2;
  }

  .entry {
    justify-items: stretch;
    align-items: center;
  }

  input,
  select {
    padding: 4px;
    background-color: white;
    border: 1px solid #856aa0;
    border-radius: 4px;
  }

  input:not([type="checkbox"]) {
    margin-right: 20px;
  }

  select:first-of-type {
    margin-left: 48px;
  }

  .card {
    font-size: 16px !important;
  }

  .dragging {
    transition-delay: 0;
    opacity: 0;
  }

  .add {
    color: #856aa0;
    transition: color 0.25s 0.2s, opacity 0.25s;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    width: 100%;
    height: 24px;
    background-color: #f4f5f5;
  }

  .add::before,
  .add::after {
    content: "";
    height: 1px;
    width: 45%;
    transition-property: background-color, width, height;
    transition-duration: 200ms;
    transition-delay: 200ms;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .add:is(:hover, :focus-visible) {
    color: green;
  }

  .add:is(:hover, :focus-visible)::before,
  .add:is(:hover, :focus-visible)::after {
    background-color: green;
    height: 4px;
    width: 48%;
  }

  .remove {
    color: black;
    display: flex;
    align-items: center;
    transition: background-color 0.25s ease, color 0.25s ease;
    background: none;
    border: 0;
    border-radius: 8px;
    padding: 6px;
  }

  .remove:hover {
    background-color: lightgrey;
    color: red;
  }
</style>
