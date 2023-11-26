ARG RPC_VERSION="v31.0.0"
ARG CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX=""

FROM ${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX}${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX:+/}postgres:13-alpine@sha256:d0fee67085a82b72d5b660d75dc82c60cef5fe5ee0ff652cc4cc64aa9da57cb4

ARG RPC_VERSION

COPY 1-init.sql 3-init.sql /docker-entrypoint-initdb.d/

ADD https://gitlab.ics.muni.cz/perun/perun-idm/perun/-/raw/$RPC_VERSION/perun-db/postgres.sql /docker-entrypoint-initdb.d/2-init.sql

# --chmod is not supported by kaniko
RUN chmod a+r /docker-entrypoint-initdb.d/2-init.sql
