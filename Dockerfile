# Docker descriptor for codbex
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:latest

COPY hermes-app target/dirigible/repository/root/registry/public/hermes-app
COPY hermes-data target/dirigible/repository/root/registry/public/hermes-data
COPY hermes-ext target/dirigible/repository/root/registry/public/hermes-ext

ENV DIRIGIBLE_HOME_URL=/services/web/hermes-app/gen/index.html

