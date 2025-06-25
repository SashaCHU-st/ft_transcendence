# Default goal — running `make` без параметров запустит `up`
.DEFAULT_GOAL := up

# Удобная переменная для вызова docker-compose
DC := docker-compose

.PHONY: help build up down restart logs clean prune

## Show this help
help: ## Display available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

## Build all images
build: ## docker-compose build
	$(DC) build

## Bring up the stack (rebuilds images automatically)
up: ## docker-compose up --build --detach
	$(DC) up --build -d

## Stop and remove containers
down: ## docker-compose down
	$(DC) down

## Restart everything (down + up)
restart: ## Restart the whole stack
	$(DC) down && $(DC) up --build -d

## Tail all logs
logs: ## docker-compose logs -f
	$(DC) logs -f

## Full cleanup: stop, remove containers, volumes, orphaned services
clean: ## docker-compose down --volumes --remove-orphans
	$(DC) down --volumes --remove-orphans

## Prune ALL unused Docker data (images, volumes, networks, build cache)
prune: ## docker system prune --all --volumes --force
	docker system prune --all --volumes --force




# # default goal — running `make` без параметров запустит `up`
# .DEFAULT_GOAL := up

# # shortcut для docker-compose с объединёнными файлами
# DC := docker-compose -f docker-compose.yml -f monitoring/docker-compose.yml

# .PHONY: help build up down restart logs clean prune

# ## Show this help
# help: ## Display available commands
# 	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
# 		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

# ## Build all images in the combined project
# build: ## docker-compose build (both stacks)
# 	$(DC) build

# ## Bring up both stacks in one project/network
# up: build ## docker-compose up --build -d (both stacks)
# 	$(DC) up --build -d

# ## Stop and remove containers (both stacks)
# down: ## docker-compose down (both stacks)
# 	$(DC) down

# ## Restart everything
# restart: ## down && up for both stacks
# 	$(MAKE) down
# 	$(MAKE) up

# ## Tail all logs from the combined project
# logs: ## docker-compose logs -f (both stacks)
# 	$(DC) logs -f

# ## Full cleanup (containers, volumes, orphans)
# clean: ## docker-compose down --volumes --remove-orphans (both stacks)
# 	$(DC) down --volumes --remove-orphans

# ## Prune ALL unused Docker data (images, volumes, networks, build cache)
# prune: ## docker system prune --all --volumes --force
# 	docker system prune --all --volumes --force
