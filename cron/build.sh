cp -r ../../UofT-Scraper ./scraper
cp -r ../../via-api/ ./backend
docker build -t viaplanner-cron .
rm -rf ./scraper ./backend