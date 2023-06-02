import { Meta, StoryObj } from "@storybook/svelte";
import Popup from "./Popup.svelte";

const meta = {
  component: Popup,
} satisfies Meta<Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
