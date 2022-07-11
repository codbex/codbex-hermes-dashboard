# codbex-hermes-platform

The `codbex` `hermes` platform package

To build the docker image:

    docker build -t codbex-hermes-platform:latest .

To run a container:

    docker run --name hermes --rm -p 8080:8080 -p 8081:8081 codbex-hermes-platform:latest
    
To stop the container:

    docker stop hermes

To tag the image:

    docker tag codbex-hermes-platform codbex.jfrog.io/codbex-docker/codbex-hermes-platform:latest

To push to JFrog Container Registry:

    docker push codbex.jfrog.io/codbex-docker/codbex-hermes-platform:latest

To pull from JFrog Container Registry:

    docker pull codbex.jfrog.io/codbex-docker/codbex-hermes-platform:latest
