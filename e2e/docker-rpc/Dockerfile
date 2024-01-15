ARG RPC_VERSION="v31.0.0"
ARG CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX=""

#FROM registry.gitlab.ics.muni.cz/perun/perun_docker/perun_rpc:$RPC_VERSION
FROM ${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX}${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX:+/}bitnami/tomcat:9.0.82@sha256:eaea69e8b4c372089068fb276f1c8a9d7c50bff202df176698978a4d05ac203b

ARG RPC_VERSION

ENV TOMCAT_INSTALL_DEFAULT_WEBAPPS=no
ENV ALLOW_EMPTY_PASSWORD=yes
ENV CATALINA_OPTS="-XshowSettings:vm -Dspring.profiles.active=production -DApplicationName=PerunRPC"

USER root

RUN install_packages postgresql-client ca-certificates libnet-ldap-perl libnet-dns-perl libtry-tiny-perl libswitch-perl libstring-random-perl heimdal-clients openssh-client wget

RUN cd /opt/bitnami/tomcat/webapps && \
    wget -O perun-rpc.war https://github.com/CESNET/perun/releases/download/$RPC_VERSION/perun-rpc.war && \
    chmod a+rwx perun-rpc.war && \
    chown 1001:1001 perun-rpc.war && \
    mkdir /var/log/perun && \
    chown 1001:1001 /var/log/perun

USER 1001

COPY --chown=1001:1001 --chmod=777 etc/perun/* /etc/perun/
COPY --chown=1001:1001 --chmod=777 server.xml /opt/bitnami/tomcat/conf/server.xml
COPY --chown=1001:1001 --chmod=777 entrypoint.sh /opt/entrypoint.sh

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE 8009
