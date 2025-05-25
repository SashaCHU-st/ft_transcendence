#!/bin/bash
# self-signed SSL certificates for local development
set -e
CERT_DIR="$(dirname "$0")/cert"
mkdir -p "$CERT_DIR"
openssl req -x509 -newkey rsa:2048 -sha256 -nodes \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -days 365 \
  -subj "/CN=localhost"

echo "Certificates generated in $CERT_DIR"

