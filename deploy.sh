#!/bin/bash


echo What should the version be?
read VERSION

docker build -t nvegater/vinplan-server:$VERSION .
docker push nvegater/vinplan-server:$VERSION

ssh root@165.227.151.179 -i ~/.ssh/id_rsa_do "docker pull nvegater/vinplan-server:$VERSION && docker tag nvegater/vinplan-server:$VERSION dokku/server-vinplan:$VERSION && dokku tags:deploy server-vinplan $VERSION"
