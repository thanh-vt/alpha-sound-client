FROM nginx:alpine

COPY ./dist/alpha-sound-client /usr/share/nginx/html

HEALTHCHECK --start-period=60s --interval=30s --timeout=10s \
  CMD curl -f http://localhost/ || exit 1
