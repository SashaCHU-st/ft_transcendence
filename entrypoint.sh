# #!/bin/sh
# set -e

# CERT_DIR="/app/server/cert"

# # если каталога нет — создаём
# [ ! -d "$CERT_DIR" ] && mkdir -p "$CERT_DIR"

# # и генерация сертификата, если его ещё нет
# if [ ! -f "$CERT_DIR/key.pem" ] || [ ! -f "$CERT_DIR/cert.pem" ]; then
#   echo "Generating self-signed certs in $CERT_DIR..."
#   openssl req -x509 -newkey rsa:4096 \
#     -keyout "$CERT_DIR/key.pem" \
#     -out    "$CERT_DIR/cert.pem" \
#     -days 365 -nodes \
#     -subj "/CN=localhost"
#   echo "Done."
# fi

# # запускаем то, что указано в CMD
# exec "$@"


#!/bin/sh
set -e

CERT_DIR="/app/server/cert"

[ ! -d "$CERT_DIR" ] && mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/key.pem" ] || [ ! -f "$CERT_DIR/cert.pem" ]; then
  echo "Generating self-signed certs in $CERT_DIR..."
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$CERT_DIR/key.pem" \
    -out    "$CERT_DIR/cert.pem" \
    -days 365 -nodes \
    -subj "/CN=localhost"
  echo "Done."
fi

exec "$@"
