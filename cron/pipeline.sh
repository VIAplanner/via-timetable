#!/bin/bash
echo "[$(date)] Starting scrape..."

# Scrape
cd /app/scraper && python3 main.py
SCRAPER_EXIT=$?
echo "Scraper exited with code $SCRAPER_EXIT..."
if [ $SCRAPER_EXIT -ne 0 ]; then
    echo "[$(date)] Scraper failed, aborting..."
    exit 1
fi

# Load JSON files
echo "[$(date)] Copying JSON files..."
cp -f /app/scraper/output/*.json /app/backend/scripts/input/

# Download dependencies
echo "[$(date)] Installing dependencies..."
cd /app/backend && npm install

# Populate
echo "[$(date)] Populating database..."
node --max-old-space-size=400 /app/backend/scripts/populate.js

echo "[$(date)] Finished..."

exit 0