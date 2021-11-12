FROM node:16-alpine AS build

COPY frontend/package.json /usr/local/src/frontend/package.json
COPY frontend/package-lock.json /usr/local/src/frontend/package-lock.json
WORKDIR /usr/local/src/frontend
RUN npm install --production

COPY frontend/ /usr/local/src/frontend
ARG REACT_APP_BACKEND_URL
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build /usr/local/src/frontend/build /usr/share/nginx/html

COPY docker/frontend/nginx.conf.template /etc/nginx/templates/default.conf.template


