#!/bin/bash
set -e
echo "Initiating..."
until pg_isready -h db -U perun -d perun; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up"
exec /opt/tomcat/bin/catalina.sh run
