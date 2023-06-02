<script lang="ts">
  import { Sort, Entry, Type, createEntry } from "../util";
  import { createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import IconAdd from "../assets/add.svg?c";
  import IconRemove from "../assets/remove.svg?c";
  import IconDrag from "../assets/drag.svg?c";

  export let items: Entry[] = [createEntry({ type: Type.Fallback })];

  const flipDurationMs = 250;
  const dispatch = createEventDispatcher();

  let isDragging = false;

  function save() {
    const sanitized = items.filter((item) => {
      const isEmptyGlob = item.type === Type.Glob && !item.glob;
      return !isEmptyGlob;
    });
    dispatch("save", { items: sanitized });
  }

  function addItem(index: number) {
    items.splice(index, 0, createEntry({ type: Type.Glob }));
    items = items;
    save();
  }

  function removeItem(index: number) {
    items.splice(index, 1);
    items = items;
    save();
  }

  function consider(event: CustomEvent) {
    isDragging = true;
    items = event.detail.items;
  }

  function finalize(event: CustomEvent) {
    isDragging = false;
    items = event.detail.items;
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
    addItem(0);
  }}
>
  <IconAdd />
</button>

<div
  use:dndzone={{
    items,
    flipDurationMs,
    dropTargetStyle: {},
    transformDraggedElement,
  }}
  on:consider={consider}
  on:finalize={finalize}
>
  {#each items as item, index (item.id)}
    <div class="card" animate:flip={{ duration: flipDurationMs }}>
      <form class="row item">
        <IconDrag />
        {#if item.type === Type.Glob}
          <input aria-label="Glob" bind:value={item.glob} on:blur={save} />
        {:else}
          <span>All other files</span>
        {/if}
        <select aria-label="Sort" bind:value={item.sort} on:change={save}>
          <option value={Sort.Alphabetical}>Alphabetical (default)</option>
          <option value={Sort.MostChanges}>Most changes</option>
          <option value={Sort.FewestChanges}>Fewest changes</option>
        </select>
        <input
          aria-label="Collapse"
          type="checkbox"
          bind:value={item.collapse}
        />
        {#if item.type === Type.Glob}
          <button
            aria-label={`Delete row ${index + 1}`}
            class="remove"
            on:click|preventDefault={() => {
              removeItem(index);
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
          addItem(index + 1);
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

  .item {
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
