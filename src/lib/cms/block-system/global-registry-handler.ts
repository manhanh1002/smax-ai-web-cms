import React from "react";
import { PageBlock } from "./types";

export let renderBlockRenderer: (block: PageBlock, index: number) => React.ReactNode = () => null;
export let renderBlockEditor: (block: PageBlock, onChange: (data: any) => void) => React.ReactNode = () => null;
export let getBlockDefinition: (type: string) => any = () => undefined;
export let getBlockDefaultData: (type: string) => any = () => ({ darkMode: false });
export const MASTER_BLOCK_REGISTRY: any[] = [];

export function registerGlobalRegistry(helpers: {
  renderBlockRenderer: typeof renderBlockRenderer;
  renderBlockEditor: typeof renderBlockEditor;
  getBlockDefinition: typeof getBlockDefinition;
  getBlockDefaultData: typeof getBlockDefaultData;
  MASTER_BLOCK_REGISTRY: any[];
}) {
  renderBlockRenderer = helpers.renderBlockRenderer;
  renderBlockEditor = helpers.renderBlockEditor;
  getBlockDefinition = helpers.getBlockDefinition;
  getBlockDefaultData = helpers.getBlockDefaultData;
  MASTER_BLOCK_REGISTRY.push(...helpers.MASTER_BLOCK_REGISTRY);
}
