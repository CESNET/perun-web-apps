ARG CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX=""

FROM ${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX}${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX:+/}httpd:2.4.48-alpine

COPY --chmod=777 conf/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --chmod=777 perun.passwd /usr/local/apache2/perun.passwd
COPY --chmod=777 conf/sites/perun.conf /usr/local/apache2/conf/sites/perun.conf

RUN mkdir -p /var/log/apache2 && \
    mkdir -p /var/log/httpd && \
    ln -s /dev/stdout /var/log/apache2/error.log && \
    ln -s /dev/stdout /var/log/httpd/error.log

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]
