FROM jwilder/docker-gen

COPY nginx.tmpl /etc/docker-gen/templates/

ENTRYPOINT ["/usr/local/bin/docker-gen", "-notify-sighup", "nginx-proxy", "-watch", "/etc/docker-gen/templates/nginx.tmpl", "/etc/nginx/conf.d/default.conf"]
