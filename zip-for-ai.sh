#!/bin/bash

# Create a temporary directory for zipping
mkdir -p temp_block_system_for_ai

# Copy relevant files
cp src/lib/cms/block-system/BlockCreatorGuide.md temp_block_system_for_ai/
cp src/lib/cms/block-system/types.ts temp_block_system_for_ai/
cp src/lib/cms/block-system/ExistingBlocks.md temp_block_system_for_ai/
cp src/lib/cms/block-system/registry.tsx temp_block_system_for_ai/

# Create the zip
zip -r block_system_for_ai.zip temp_block_system_for_ai

# Clean up
rm -rf temp_block_system_for_ai

echo "--------------------------------------------------"
echo "✅ Done! File 'block_system_for_ai.zip' created."
echo "You can now upload this zip to ChatGPT/Claude."
echo "--------------------------------------------------"
