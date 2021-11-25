FROM node:16.13.0-alpine AS build

COPY frontend/package.json /usr/local/src/frontend/package.json
COPY frontend/package-lock.json /usr/local/src/frontend/package-lock.json
COPY frontend/craco.config.js /usr/local/src/frontend/craco.config.js
COPY frontend/tailwind.config.js /usr/local/src/frontend/tailwind.config.js
WORKDIR /usr/local/src/frontend
RUN npm install --production
RUN npm i --save-dev @types/d3
RUN npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
RUN npm install @craco/craco

COPY frontend/ /usr/local/src/frontend
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_STATIC_URL
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build /usr/local/src/frontend/build /usr/share/nginx/html

COPY docker/frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY static /usr/share/nginx/html/static/
