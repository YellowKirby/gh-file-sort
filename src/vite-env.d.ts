/// <reference types="vite/client" />
/// <reference types="@samrum/vite-plugin-web-extension/client" />

declare module "*svg?c" {
  import { ComponentType, SvelteComponentTyped } from "svelte";
  const icon: ComponentType<SvelteComponentTyped>;
  export default icon;
}

// https://github.com/isaacHagoel/svelte-dnd-action#typescript
declare type Item = import("svelte-dnd-action").Item;
declare type DndEvent<ItemType = Item> =
  import("svelte-dnd-action").DndEvent<ItemType>;
declare namespace svelte.JSX {
  export interface HTMLAttributes<T> {
    onconsider?: (
      event: CustomEvent<DndEvent> & { target: EventTarget & T }
    ) => void;
    onfinalize?: (
      event: CustomEvent<DndEvent> & { target: EventTarget & T }
    ) => void;
  }
}
