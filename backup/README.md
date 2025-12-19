# Backup and Regeneration Workflow

This directory contains content backups and regeneration utilities for the RAG chatbot system.

## Directory Structure

```
backup/
├── docs/              # Backup snapshots of book markdown files
├── scripts/           # Backup and regeneration utilities
│   ├── snapshot_content.sh         # Create backup snapshot
│   ├── regenerate_embeddings.sh    # Regenerate embeddings from backup
│   └── restore_from_backup.sh      # Restore content from backup
├── schemas/           # Database schema exports
│   └── neon_schema.sql
├── metadata.json      # Backup metadata (timestamp, file count)
└── README.md          # This file
```

## Workflows

### 1. Create Content Snapshot

Use this before making significant content changes:

```bash
cd backup/scripts
./snapshot_content.sh
```

**What it does**:
- Copies all markdown files from `ai-powered-book/docs/` to `backup/docs/`
- Updates `metadata.json` with timestamp and file count
- Preserves current state for disaster recovery

### 2. Regenerate Embeddings (After Content Updates)

After modifying book content:

```bash
cd backup/scripts
./regenerate_embeddings.sh
```

**What it does**:
- Clears existing Qdrant collection
- Re-runs ingestion pipeline using `backup/docs/` as source
- Generates fresh embeddings for all content
- Updates backup metadata with regeneration timestamp

**Expected time**: 5-10 minutes for 500 pages

### 3. Restore from Backup (Disaster Recovery)

If you need to revert to backed-up content:

```bash
cd backup/scripts
./restore_from_backup.sh
```

**What it does**:
- Copies `backup/docs/` back to `ai-powered-book/docs/`
- **⚠️ WARNING**: Overwrites current content!
- Prompts for confirmation before proceeding

**After restore**:
1. Rebuild book: `cd ai-powered-book && npm run build`
2. Regenerate embeddings: `./regenerate_embeddings.sh`
3. Deploy updated content

### 4. Export Database Schema

Export Neon Postgres schema for backup:

```bash
cd rag-backend
python scripts/export_db_schema.py
```

**Output**: `backup/schemas/neon_schema.sql`

**Use for**:
- Version control of database structure
- Disaster recovery (recreate tables)
- Documentation

## Backup Schedule (Recommended)

- **Daily**: Automated snapshot before any content edits
- **Before major updates**: Manual snapshot + test regeneration
- **Monthly**: Export database schema
- **Before deployment**: Full snapshot + schema export

## Disaster Recovery Plan

### Scenario 1: Corrupted Vector Database

1. Run `./snapshot_content.sh` (if not already backed up)
2. Delete Qdrant collection in dashboard
3. Run `python rag-backend/scripts/setup_qdrant.py` to recreate
4. Run `./regenerate_embeddings.sh` to repopulate

### Scenario 2: Lost Book Content

1. Run `./restore_from_backup.sh`
2. Rebuild book: `cd ai-powered-book && npm run build`
3. Test on localhost before deploying

### Scenario 3: Lost Database

1. Recreate Neon database (new database in Neon dashboard)
2. Run schema: `psql $DATABASE_URL < backup/schemas/neon_schema.sql`
3. Update `DATABASE_URL` in .env
4. Restart backend

## Metadata Format

The `metadata.json` file contains:

```json
{
  "backup_date": "2025-12-17T10:30:00Z",
  "version": "1.0.0",
  "total_files": 6,
  "source": "ai-powered-book/docs/",
  "description": "Backup description",
  "last_regeneration": "2025-12-17T14:00:00Z"
}
```

## Testing Backup Workflow

**Test regeneration** without affecting production:

1. Create test environment:
   - Create separate Qdrant collection: `book_chunks_test`
   - Update `.env`: `QDRANT_COLLECTION_NAME=book_chunks_test`

2. Modify backup content:
   - Edit `backup/docs/chapter-1-spec-kit.md`
   - Add test content: "THIS IS A TEST MODIFICATION"

3. Regenerate:
   ```bash
   ./regenerate_embeddings.sh
   ```

4. Test query:
   - Ask: "Tell me about the test modification"
   - Verify answer includes test content

5. Cleanup:
   - Delete test collection
   - Restore original `.env`

## Cost Considerations

- **Snapshot**: Free (local file copy)
- **Regeneration**: ~$0.01 OpenAI cost (500 pages)
- **Restore**: Free (local file copy)
- **Schema export**: Free

## Troubleshooting

### "No such file or directory"
- Ensure you're running from `backup/scripts/` directory
- Check source paths in scripts match your setup

### "Permission denied"
- Make scripts executable: `chmod +x backup/scripts/*.sh`

### Regeneration fails
- Check `.env` has valid credentials
- Verify Qdrant collection exists
- Check ingestion logs in Neon database

### Restore overwrites wrong files
- **ALWAYS** run snapshot before restore
- Double-check target directory before confirming

## Support

For detailed implementation, see:
- Feature spec: `specs/001-rag-chatbot/spec.md`
- Implementation plan: `specs/001-rag-chatbot/plan.md`
- Tasks: `specs/001-rag-chatbot/tasks.md`
