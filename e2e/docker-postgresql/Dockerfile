ARG RPC_VERSION="v33.2.0"
ARG CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX=""

FROM ${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX}${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX:+/}bitnami/postgresql:16-debian-11

ARG RPC_VERSION

COPY --chown=1001:1001 --chmod=777 1-init.sql 3-init.sql /docker-entrypoint-initdb.d/

ADD --chown=1001:1001 --chmod=777 https://gitlab.ics.muni.cz/perun/perun-idm/perun/-/raw/$RPC_VERSION/perun-db/postgres.sql /docker-entrypoint-initdb.d/2-init.sql
