#!/bin/bash


echo What should the version be?
read VERSION

docker build -t nvegater/vinplan-server:$VERSION .
docker push nvegater/vinplan-server:$VERSION

ssh root@104.248.45.74 "docker pull nvegater/vinplan-server:$VERSION && docker tag nvegater/vinplan-server:$VERSION dokku/wenoserver:$VERSION && dokku git:from-image wenoserver nvegater/vinplan-server:$VERSION"
