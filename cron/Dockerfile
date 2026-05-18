FROM node:24-alpine

RUN apk add --no-cache python3 py3-pip bash
RUN pip3 install requests --break-system-packages

WORKDIR /app

COPY crontab /etc/crontabs/root

COPY start.sh /app/start.sh
COPY pipeline.sh /app/pipeline.sh
RUN chmod +x /app/pipeline.sh /app/start.sh

CMD ["/app/start.sh"]