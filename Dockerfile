# Docker descriptor for codbex
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:latest

COPY hermes-app target/dirigible/repository/root/registry/public/codbex-hermes
COPY hermes-data target/dirigible/repository/root/registry/public/codbex-hermes-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-hermes-app/gen/index.html

