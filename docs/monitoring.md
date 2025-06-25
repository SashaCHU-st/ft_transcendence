# Monitoring Setup

This guide explains how to start Prometheus and Grafana for the project.

## Running the stack

From the repository root run:

```bash
docker compose -f monitoring/docker-compose.yml up -d
```

## Accessing the services

- **Prometheus:** [http://localhost:9090](http://localhost:9090)
- **Grafana:** [http://localhost:3001](http://localhost:3001)

The Grafana admin user is `admin`. Set the password by creating a
`monitoring/.env` file based on `monitoring/.env.example` before starting
the stack.

Prometheus keeps metrics for 15 days by default. To store data for a
different period, set `PROM_RETENTION_DAYS` in your `monitoring/.env`
file.

Prometheus is configured to scrape the game server over HTTPS using a
self‑signed certificate. This is handled in `prometheus.yml` with
`scheme: https` and `insecure_skip_verify: true`.

Disk usage metrics require allowing the node exporter to read the host
filesystem. The `docker-compose.yml` mounts `/`, `/proc` and `/sys` into the
container and starts the exporter with `--path.rootfs=/host`.

Alert rules are forwarded to Alertmanager which can be reached at
[http://localhost:9093](http://localhost:9093).

## Reloading configuration

Prometheus runs with lifecycle support enabled. After changing
`prometheus.yml` or `alert.rules.yml` reload the configuration without
restarting:

```bash
curl -X POST http://localhost:9090/-/reload
```

Dashboards provisioned in Grafana can be refreshed in a similar way:

```bash
curl -X POST http://admin:<password>@localhost:3001/api/admin/provisioning/dashboards/reload
```

## Securing the metrics endpoint

In production set the `METRICS_TOKEN` environment variable on the game server to
restrict access to `/metrics`. A template is provided in
`server/.env.example`. When enabled, requests must provide the header

```
Authorization: Bearer <token>
```

Prometheus can be configured to pass this header in its scrape configuration.

## Production notes

- Set `GRAFANA_PASSWORD` in `monitoring/.env` to change the default admin
  password.
- Serve Grafana over HTTPS via a reverse proxy or another TLS terminator.
- Enable the `METRICS_TOKEN` variable on the server and add an authorization
  header in the Prometheus scrape config:

```yaml
  - job_name: "server"
    scheme: https
    tls_config:
      insecure_skip_verify: true
    authorization:
      type: Bearer
      credentials: <token>
    static_configs:
      - targets: ["host.docker.internal:3000"]
```
