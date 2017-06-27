FROM nginx
MAINTAINER Maxim Geerinck <geerinck.maxim@gmail.com>

# we have to delete the volume before we can add new files...
RUN mkdir -p /etc/nginx/vhost.d
COPY vhost.d /etc/nginx/vhost.d

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]