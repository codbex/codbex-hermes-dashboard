# codbex-chronos-platform

The `codbex` `chronos` platform package

To build the docker image:

    docker build -t codbex-chronos-platform:latest .

To run a container:

    docker run --name chronos --rm -p 8080:8080 -p 8081:8081 codbex-chronos-platform:latest
    
To stop the container:

    docker stop chronos

To tag the image:

    docker tag codbex-chronos-platform codbex.jfrog.io/codbex-docker/codbex-chronos-platform:latest

To push to JFrog Container Registry:

    docker push codbex.jfrog.io/codbex-docker/codbex-chronos-platform:latest

To pull from JFrog Container Registry:

    docker pull codbex.jfrog.io/codbex-docker/codbex-chronos-platform:latest
