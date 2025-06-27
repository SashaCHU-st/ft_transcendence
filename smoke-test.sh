# #!/usr/bin/env bash
# set -eux

# IMAGE=student-app:latest

# # 1) Build the image
# docker build -t "$IMAGE" .

# # 2) Stop and remove any old containers from this image (if any)
# OLD=$(docker ps -q --filter ancestor="$IMAGE")
# if [ -n "$OLD" ]; then
#   docker kill $OLD
# fi

# # 3) Run in the background exposing HTTPS ports
# CID=$(docker run --rm -d \
#   -p 3000:3000 \
#   -p 5173:5173 \
#   "$IMAGE")

# # 4) Wait for services to come up
# echo "Waiting for services…"
# sleep 5

# # 5) Test the API (HTTPS, -k to ignore self-signed cert)
# curl -k --fail https://localhost:3000/health

# # 6) Test the frontend
# curl -k --fail https://localhost:5173/

# # 7) Stop the container (it will be removed thanks to --rm)
# docker stop "$CID"

# echo "✅ All checks passed!"


#!/usr/bin/env bash
set -eux

IMAGE=student-app:latest

# 0) Show only the Docker Root Dir line, suppress all other docker info warnings
echo "→ Docker Root Dir: $(docker info 2>/dev/null | awk -F': ' '/^ Docker Root Dir:/ {print $2}')"

# 1) Build image quietly
docker build -q -t "$IMAGE" . >/dev/null

# 2) Stop & remove any old containers from this image (if any)
OLD=$(docker ps -q --filter ancestor="$IMAGE")
[ -n "$OLD" ] && docker kill "$OLD"

# 3) Run container in background, suppress container ID output
docker run --rm -d -p 3000:3000 -p 5173:5173 "$IMAGE" >/dev/null

# 4) Wait for services to come up
echo "Waiting for services…"
sleep 5

# 5+6) Test both endpoints, fail fast
curl -k --fail https://localhost:3000/health >/dev/null
curl -k --fail https://localhost:5173/     >/dev/null

# 7) Cleanup: stop any running instance of this image
docker ps -q --filter ancestor="$IMAGE" | xargs -r docker stop >/dev/null

echo "✅ All checks passed!"
