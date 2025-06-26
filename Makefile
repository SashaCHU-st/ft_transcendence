# Makefile for Docker Compose management

# Compose files
COMPOSE_FILES := -f docker-compose.yml -f monitoring/docker-compose.yml

# Start all services in background with rebuild
.PHONY: up
up:
	docker-compose $(COMPOSE_FILES) up --build -d

# Stop and remove all containers, images, and volumes
.PHONY: clean
clean:
	docker-compose $(COMPOSE_FILES) down --remove-orphans --rmi all --volumes && \
	docker system prune -a --volumes -f

# Restart from scratch: clean + up
.PHONY: restart
restart: clean up

# Rebuild and start without prior cleanup
.PHONY: build
build:
	docker-compose $(COMPOSE_FILES) up --build -d

# View logs of all services
.PHONY: logs
logs:
	docker-compose $(COMPOSE_FILES) logs -f

# Stop services without removing images/volumes
.PHONY: down
down:
	docker-compose $(COMPOSE_FILES) down

# Quick access to command list
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make up       — build and start all services"
	@echo "  make clean    — remove containers, images, and volumes"
	@echo "  make restart  — clean and then up"
	@echo "  make build    — rebuild and start (without cleaning)"
	@echo "  make down     — stop services"
	@echo "  make logs     — show logs (follow)"
