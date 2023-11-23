#!/bin/bash

echo "Waiting for Postgres..."
until pg_isready -h db -U perun -d perun; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up"

# Copyright VMware, Inc.
# SPDX-License-Identifier: APACHE-2.0

# shellcheck disable=SC1091

set -o errexit
set -o nounset
set -o pipefail
# set -o xtrace # Uncomment this line for debugging purposes

# Load libraries
. /opt/bitnami/scripts/libtomcat.sh
. /opt/bitnami/scripts/liblog.sh

# Load Tomcat environment variables
. /opt/bitnami/scripts/tomcat-env.sh

info "** Starting Tomcat **"

if am_i_root; then
    exec_as_user "$TOMCAT_DAEMON_USER" "${TOMCAT_BIN_DIR}/catalina.sh" run "$@"
else
    exec "${TOMCAT_BIN_DIR}/catalina.sh" run "$@"
fi
