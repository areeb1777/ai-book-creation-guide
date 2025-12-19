#!/bin/bash
#
# Snapshot Content Script
#
# Copies current book content from ai-powered-book/docs/ to backup/docs/
# Updates metadata.json with timestamp
#

set -e

echo "=================================="
echo "Content Snapshot Script"
echo "=================================="
echo ""

# Navigate to repository root
cd "$(dirname "$0")/../.."

SOURCE_DIR="ai-powered-book/docs"
BACKUP_DIR="backup/docs"
METADATA_FILE="backup/metadata.json"

# Check source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Create backup directory if doesn't exist
mkdir -p "$BACKUP_DIR"

# Count files
FILE_COUNT=$(find "$SOURCE_DIR" -name "*.md" | wc -l)

echo "📁 Source: $SOURCE_DIR"
echo "📁 Backup: $BACKUP_DIR"
echo "📄 Files to backup: $FILE_COUNT"
echo ""

# Copy files
echo "Copying files..."
cp -r "$SOURCE_DIR"/*.md "$BACKUP_DIR/" 2>/dev/null || true

# Update metadata
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$METADATA_FILE" << EOF
{
  "backup_date": "$TIMESTAMP",
  "version": "1.0.0",
  "total_files": $FILE_COUNT,
  "source": "$SOURCE_DIR",
  "description": "Content snapshot for RAG chatbot backup"
}
EOF

echo "✅ Snapshot complete!"
echo ""
echo "Backup location: $BACKUP_DIR"
echo "Metadata: $METADATA_FILE"
echo "Timestamp: $TIMESTAMP"
