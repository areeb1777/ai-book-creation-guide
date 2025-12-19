#!/bin/bash
#
# Regenerate Embeddings Script
#
# Re-runs ingestion pipeline from backup/docs/ to update vector database
# with modified content.
#

set -e

echo "=================================="
echo "Regenerate Embeddings Script"
echo "=================================="
echo ""

# Navigate to repository root
cd "$(dirname "$0")/../.."

BACKUP_DIR="backup/docs"
BACKEND_DIR="rag-backend"

# Check backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Error: Backup directory not found: $BACKUP_DIR"
    exit 1
fi

# Check backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Error: Backend directory not found: $BACKEND_DIR"
    exit 1
fi

# Count files
FILE_COUNT=$(find "$BACKUP_DIR" -name "*.md" | wc -l)

echo "⚠️  WARNING: This will clear existing embeddings and regenerate from backup."
echo ""
echo "📁 Source: $BACKUP_DIR"
echo "📄 Files: $FILE_COUNT"
echo ""
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🔄 Regenerating embeddings..."
echo ""

# Activate virtual environment if exists
if [ -d "$BACKEND_DIR/venv" ]; then
    source "$BACKEND_DIR/venv/bin/activate"
fi

# Run ingestion with backup as source
cd "$BACKEND_DIR"
python scripts/run_ingestion.py "../$BACKUP_DIR"

# Update backup metadata
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo ""
echo "📝 Updating backup metadata..."

cat > "../backup/metadata.json" << EOF
{
  "backup_date": "$TIMESTAMP",
  "version": "1.0.0",
  "total_files": $FILE_COUNT,
  "source": "$BACKUP_DIR",
  "description": "Regenerated embeddings from backup",
  "last_regeneration": "$TIMESTAMP"
}
EOF

echo ""
echo "✅ Regeneration complete!"
echo "Timestamp: $TIMESTAMP"
echo ""
echo "Next steps:"
echo "1. Test chatbot with queries about updated content"
echo "2. Verify answers reflect changes"
