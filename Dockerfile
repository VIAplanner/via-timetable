FROM node:24-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ENV VITE_API_BASE_URL="/api"
RUN yarn build

FROM nginx:1.27-alpine AS runtime
COPY nginx.static.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]