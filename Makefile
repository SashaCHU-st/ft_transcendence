# # Makefile for Docker Compose management

# # Compose files
# COMPOSE_FILES := -f docker-compose.yml -f monitoring/docker-compose.yml

# # Start all services in background with rebuild
# .PHONY: up
# up:
# 	docker-compose $(COMPOSE_FILES) up --build -d

# # Stop and remove all containers, images, and volumes
# .PHONY: clean
# clean:
# 	docker-compose $(COMPOSE_FILES) down --remove-orphans --rmi all --volumes && \
# 	docker system prune -a --volumes -f

# # Restart from scratch: clean + up
# .PHONY: restart
# restart: clean up

# # Rebuild and start without prior cleanup
# .PHONY: build
# build:
# 	docker-compose $(COMPOSE_FILES) up --build -d

# # View logs of all services
# .PHONY: logs
# logs:
# 	docker-compose $(COMPOSE_FILES) logs -f

# # Stop services without removing images/volumes
# .PHONY: down
# down:
# 	docker-compose $(COMPOSE_FILES) down

# # Quick access to command list
# .PHONY: help
# help:
# 	@echo "Available commands:"
# 	@echo "  make up       — build and start all services"
# 	@echo "  make clean    — remove containers, images, and volumes"
# 	@echo "  make restart  — clean and then up"
# 	@echo "  make build    — rebuild and start (without cleaning)"
# 	@echo "  make down     — stop services"
# 	@echo "  make logs     — show logs (follow)"




# Compose files
COMPOSE_FILES := -f docker-compose.yml -f monitoring/docker-compose.yml

.PHONY: up clean restart build logs down help

# Build & start all services (in detached mode)
up:
	docker-compose $(COMPOSE_FILES) up --build -d

# Stop & remove containers, images and volumes, then prune system
clean:
	docker-compose $(COMPOSE_FILES) down --remove-orphans --rmi all --volumes && \
	docker system prune -a --volumes -f

# Clean + Up
restart: clean up

# Just rebuild & start (no prior clean)
build:
	docker-compose $(COMPOSE_FILES) up --build -d

# Stop services (without removing images/volumes)
down:
	docker-compose $(COMPOSE_FILES) down

# Follow logs of all services
logs:
	docker-compose $(COMPOSE_FILES) logs -f

# Help screen
help:
	@echo "Available commands:"
	@echo "  make up       — build & start everything"
	@echo "  make build    — rebuild & start (no clean)"
	@echo "  make down     — stop services"
	@echo "  make clean    — stop & remove containers, images, volumes"
	@echo "  make restart  — clean + up"
	@echo "  make logs     — follow logs"



#  docker build -t my-app:latest . \
#   && docker run --rm -d -p3000:3000 -p5173:5173 my-app:latest