none:
	@echo "Please enter a target expliticly."

define rsync_ovh
rsync -irtptPl --delete --info=progress2 \
    -e 'ssh -p 56185' \
    . debian@51.178.19.169:Diagoriente \
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
	docker-compose -f docker/docker-compose.yaml --project-directory ./ build

.PHONY: docker-up
docker-up:
	docker-compose -f docker/docker-compose.yaml --project-directory ./ up --build -d

.PHONY: docker-down
docker-down:
	docker-compose -f docker/docker-compose.yaml --project-directory ./ down

Readme.html: Readme.md
	pandoc --toc --standalone --mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js -f markdown -t html Readme.md -o Readme.html
