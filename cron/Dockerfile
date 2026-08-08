FROM node:24-alpine

RUN apk add --no-cache python3 py3-pip bash
RUN pip3 install requests --break-system-packages

WORKDIR /app

COPY ./scraper /app/scraper
COPY ./backend/ /app/backend/
COPY pipeline.sh /app/pipeline.sh
RUN chmod +x /app/pipeline.sh
RUN mkdir -p /app/backend/scripts/input

CMD ["/app/pipeline.sh"]