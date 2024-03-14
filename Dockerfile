FROM node:18-alpine

# use integrated nginx or only provide socket
ARG INTEGRATE_NGINX="false"

RUN apk update

RUN if [ "$INTEGRATE_NGINX" = "true" ] ; then apk add nginx ; fi

RUN apk add supervisor

# create dummy nginx directory
RUN if [ "$INTEGRATE_NGINX" = "false" ] ; then mkdir -p /etc/nginx/http.d ; fi

# remove nginx default config (only if nginx is really installed)
RUN if [ "$INTEGRATE_NGINX" = "true" ] ; then rm -f /etc/nginx/http.d/default.conf ; fi

# add nginx config (also add to dummy directory if nginx not installed)
ADD ./deployment/docker/nginx/http.d/default.conf /etc/nginx/http.d/default.conf

COPY ./deployment/docker/supervisord.conf /etc/supervisor/supervisord.conf

COPY deployment/docker/supervisor.node.conf /etc/supervisor/conf.d/supervisor.node.conf

COPY deployment/docker/supervisor.nginx.conf /etc/supervisor/conf.d/supervisor.nginx.conf

# remove nginx supervisor config (only if nginx is not installed)
RUN if [ "$INTEGRATE_NGINX" = "false" ] ; then rm /etc/supervisor/conf.d/supervisor.nginx.conf; fi

RUN mkdir -p /home/www/node/node_modules && chown -R node:node /home/www/node

RUN mkdir -p /var/log/supervisor && chown -R node:node /var/log/supervisor

WORKDIR /home/www/node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . ./

RUN npm run build

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
