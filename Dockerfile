# Docker descriptor for codbex-hermes
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.15.0

COPY codbex-hermes target/dirigible/repository/root/registry/public/codbex-hermes
COPY codbex-hermes-data target/dirigible/repository/root/registry/public/codbex-hermes-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-hermes/gen/index.html

