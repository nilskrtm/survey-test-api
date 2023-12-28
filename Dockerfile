FROM node:18-alpine

RUN apk update

RUN apk add supervisor

COPY ./deployment/docker/supervisord.conf /etc/supervisor/supervisord.conf

COPY ./deployment/docker/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

RUN mkdir -p /home/www/node/node_modules && chown -R node:node /home/www/node

RUN mkdir -p /var/log/supervisor && chown -R node:node /var/log/supervisor

WORKDIR /home/www/node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . ./

RUN npm run build

EXPOSE 5000

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]

