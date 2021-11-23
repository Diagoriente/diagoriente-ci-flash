docker-compose = docker-compose -f docker/docker-compose.yaml --project-directory ./

none:
	@echo "Please enter a target expliticly."

define rsync_ovh
rsync -irtptPl --delete --info=progress2 \
    . ovh-vps-test:Diagoriente \
    --exclude .git \
    --exclude frontend/node_modules \
    --exclude frontend/build \
    --exclude .venv \
    --exclude .mypy_cache \
    --exclude .pytest_cache \
    --exclude __pycache__ \
    --exclude .env \
    --exclude .envrc
endef

.PHONY:up-dev
up-dev: backend-up-dev frontend-up-dev

.PHONY:frontend-up-dev
frontend-up-dev:
	cd frontend && npm start

.PHONY:backend-up-dev
backend-up-dev:
	uvicorn cir.interface.http:app --reload &

.PHONY:sync-ovh
sync-ovh:
	$(rsync_ovh) -n
	@echo -n "Confirm ? [y/N] " && read ans && [ $${ans:-N} = y ] && $(rsync_ovh)

.PHONY: docker-build
docker-build:
	$(docker-compose) build

.PHONY: docker-up
docker-up:
	$(docker-compose) --env-file .env-docker-local up --build -d

.PHONY: deploy
deploy: sync-ovh .env-deploy
	rsync -rtptPl .env-deploy ovh-vps-test:Diagoriente/.env-deploy
	ssh ovh-vps-test bash -c "'cd Diagoriente \
		&& $(docker-compose) --env-file .env-deploy up --build -d'"

.PHONY: docker-down
docker-down:
	$(docker-compose) down

Readme.html: Readme.md
	pandoc --toc --standalone --mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js -f markdown -t html Readme.md -o Readme.html
