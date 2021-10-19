FROM node:15
ENV HOST 0.0.0.0

# Create app directory
RUN mkdir -p /usr/via-timetable

# Bundle app source
COPY . ~/via-timetable
WORKDIR ~/via-timetable

RUN yarn
RUN yarn build

CMD [ "yarn", "serve" ]
