ARG RPC_VERSION="v31.0.0"

FROM registry.gitlab.ics.muni.cz/perun/perun_docker/perun_rpc:$RPC_VERSION

COPY --chown=perun:root --chmod=777 etc/perun/* /etc/perun/
COPY --chown=perun:perun --chmod=777 entrypoint.sh /opt/entrypoint.sh

USER root

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /var/log/perun && \
    mkdir -p /home/perun && \
    chown 961:961 /home/perun /var/log/perun && \
    DATE=`date +%Y-%m-%d` && \
    ln -s /dev/stdout /opt/tomcat/logs/catalina.$DATE.log && \
    ln -s /dev/stdout /opt/tomcat/logs/localhost.$DATE.log && \
    ln -s /dev/stdout /opt/tomcat/logs/manager.$DATE.log && \
    ln -s /dev/stdout /opt/tomcat/logs/host-manager.$DATE.log && \
    chmod a+rx /opt/entrypoint.sh

USER perun

WORKDIR /opt/tomcat

ENTRYPOINT ["/opt/entrypoint.sh"]
