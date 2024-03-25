#!/bin/bash
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "{\"version\":\"$PACKAGE_VERSION\"}" > ./dist/apps/admin-gui/browser/assets/config/version.json
