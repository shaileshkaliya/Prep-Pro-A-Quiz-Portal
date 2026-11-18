#!/bin/bash
docker stop user qpfentry apigateway serviceregistry mongo quiz question
docker rm user qpfentry apigateway serviceregistry mongo quiz question
docker rmi user qpfentry apigateway serviceregistry mongo quiz question
docker network rm quiz-network
