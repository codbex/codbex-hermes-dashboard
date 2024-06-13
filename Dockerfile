# Docker descriptor for codbex-hermes
# License - http://www.eclipse.org/legal/epl-v20.html

FROM dirigiblelabs/dirigible:latest

COPY codbex-hermes target/dirigible/repository/root/registry/public/codbex-hermes

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-hermes/ndex.html

