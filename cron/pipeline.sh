SCRAPER_OUTPUT=/scraper/output
MAX_AGE=86400

needs_scrape() {
    ls $SCRAPER_OUTPUT/*.json 2>/dev/null || return 0
    newest=$(ls -t $SCRAPER_OUTPUT/*.json | head -1)
    file_time=$(stat -c %Y $newest)
    now=$(date +%s)
    age=$((now - file_time))

    if [ $age -lt $MAX_AGE ]; then
        echo "[$(date)] Data is $(($age / 3600))h old, skipping scraping..."
        return 1
    fi

    return 0
}

if needs_scrape; then
    echo "[$(date)] Starting scrape..."

    # Scrape
    cd /scraper && python3 main.py
    if [ $? -ne 0 ]; then
        echo "[$(date)] Scraper failed, aborting..."
        exit 1
    fi

    # Load JSON files
    echo "[$(date)] Copying JSON files..."
    cp -f /scraper/output/*.json /backend/scripts/input/

    # Populate
    echo "[$(date)] Populating database..."
    cd /backend && node scripts/populate.js

    echo "[$(date)] Finished..."
fi