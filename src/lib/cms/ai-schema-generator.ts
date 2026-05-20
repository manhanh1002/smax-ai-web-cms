import { MASTER_BLOCK_REGISTRY } from "./block-system/registry";

export function generateAISchema() {
  return MASTER_BLOCK_REGISTRY.map(block => {
    return {
      type: block.type,
      label: block.label,
      description: block.description,
      category: block.category,
      // Provide an empty structure so the AI knows what keys to fill
      dataSchema: block.defaultData
    };
  });
}
