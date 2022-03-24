#!/usr/bin/env bash

set -euo pipefail

VERSION=$(./version.sh)

TMPDIR="/tmp/diagoriente-ci-flash/"
echo "Created temp dir $TMPDIR"

DOCKER_IMAGE_LOCAL_FRONTEND=$TMPDIR/docker_images/$VERSION/frontend.tar
DOCKER_IMAGE_LOCAL_BACKEND=$TMPDIR/docker_images/$VERSION/backend.tar

mkdir -p $TMPDIR/docker_images/$VERSION
echo "Saving docker image $COMPOSE_PROJECT_NAME/frontend:$VERSION to $DOCKER_IMAGE_LOCAL_FRONTEND"
docker save $COMPOSE_PROJECT_NAME/frontend:$VERSION \
    -o $DOCKER_IMAGE_LOCAL_FRONTEND
echo "Saving docker image $COMPOSE_PROJECT_NAME/backend:$VERSION to $DOCKER_IMAGE_LOCAL_BACKEND"
docker save $COMPOSE_PROJECT_NAME/backend:$VERSION \
    -o $DOCKER_IMAGE_LOCAL_BACKEND

RELEASE="${VERSION}-$(date -u --iso=seconds)"

echo "Sending docker images."
ssh ovh-vps-test "mkdir -p Diagoriente/docker_images/$VERSION"
rsync -avHXS --numeric-ids --info=progress2 \
    $TMPDIR/docker_images/$VERSION/frontend.tar \
    $TMPDIR/docker_images/$VERSION/backend.tar \
    ovh-vps-test:Diagoriente/docker_images/$VERSION/

echo "Loading docker images on the server."
ssh ovh-vps-test "docker load -i Diagoriente/docker_images/$VERSION/backend.tar"
ssh ovh-vps-test "docker load -i Diagoriente/docker_images/$VERSION/frontend.tar"

echo "Creating release ovh-vps-test:Diagoriente/releases/$RELEASE"
ssh ovh-vps-test mkdir -p Diagoriente/releases/$RELEASE
rsync -av --info=progress2 .env-production ovh-vps-test:Diagoriente/releases/$RELEASE/.env
rsync -av --info=progress2 \
    .version \
    docker/docker-compose.yaml \
    ovh-vps-test:Diagoriente/releases/$RELEASE

