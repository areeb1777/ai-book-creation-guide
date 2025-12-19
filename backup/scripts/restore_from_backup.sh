#!/bin/bash
#
# Restore from Backup Script
#
# Restores book content from backup/docs/ to ai-powered-book/docs/
# Use this for disaster recovery or reverting changes.
#

set -e

echo "=================================="
echo "Restore from Backup Script"
echo "=================================="
echo ""

# Navigate to repository root
cd "$(dirname "$0")/../.."

SOURCE_DIR="backup/docs"
TARGET_DIR="ai-powered-book/docs"

# Check backup directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Backup directory not found: $SOURCE_DIR"
    exit 1
fi

# Count files
FILE_COUNT=$(find "$SOURCE_DIR" -name "*.md" | wc -l)

echo "⚠️  WARNING: This will OVERWRITE current book content with backup."
echo ""
echo "📁 Backup source: $SOURCE_DIR"
echo "📁 Target: $TARGET_DIR"
echo "📄 Files to restore: $FILE_COUNT"
echo ""
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🔄 Restoring from backup..."

# Create target directory if doesn't exist
mkdir -p "$TARGET_DIR"

# Copy files
cp -r "$SOURCE_DIR"/*.md "$TARGET_DIR/"

echo ""
echo "✅ Restore complete!"
echo ""
echo "Next steps:"
echo "1. Rebuild book: cd ai-powered-book && npm run build"
echo "2. Regenerate embeddings: ./backup/scripts/regenerate_embeddings.sh"
echo "3. Deploy updated book"
