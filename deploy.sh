#!/bin/bash


echo What should the version be?
read VERSION

docker build -t nvegater/vinplan-server:$VERSION .
docker push nvegater/vinplan-server:$VERSION

ssh root@159.223.21.125 "docker pull nvegater/vinplan-server:$VERSION && docker tag nvegater/vinplan-server:$VERSION dokku/wenoserver:$VERSION && dokku tags:deploy wenoserver $VERSION"
