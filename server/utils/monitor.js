import os from 'os';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { register, Gauge, Histogram, collectDefaultMetrics } from 'prom-client';

// Initialize Prometheus default metrics collection
collectDefaultMetrics({ register });

// Gauges for custom metrics
export const chatClientsGauge = new Gauge({
  name: 'chat_clients',
  help: 'Connected chat clients',
});

export const remotePlayersGauge = new Gauge({
  name: 'remote_players',
  help: 'Active remote players',
});

export const uptimeGauge = new Gauge({
  name: 'process_uptime_seconds',
  help: 'Process uptime in seconds',
});

export const rssGauge = new Gauge({
  name: 'process_rss_bytes',
  help: 'Resident set size in bytes',
});

export const heapUsedGauge = new Gauge({
  name: 'process_heap_used_bytes',
  help: 'Heap used in bytes',
});

export const load1Gauge = new Gauge({
  name: 'load_average_1m',
  help: '1m load average',
});

export const load5Gauge = new Gauge({
  name: 'load_average_5m',
  help: '5m load average',
});

export const load15Gauge = new Gauge({
  name: 'load_average_15m',
  help: '15m load average',
});

export const dbFileSizeGauge = new Gauge({
  name: 'sqlite_db_file_bytes',
  help: 'SQLite database file size in bytes',
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['route', 'method', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

const DB_PATH = path.join(
  dirname(fileURLToPath(import.meta.url)),
  '../database/database.db'
);

async function readDbFileSize() {
  try {
    await fs.promises.access(DB_PATH, fs.constants.F_OK);
    const stats = await fs.promises.stat(DB_PATH);
    return stats.size;
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading database file size:', err);
    }
    return 0;
  }
}

export async function getServerMetrics() {
  const mem = process.memoryUsage();
  const dbFileSize = await readDbFileSize();
  return {
    uptime: process.uptime(),
    rss: mem.rss,
    heapTotal: mem.heapTotal,
    heapUsed: mem.heapUsed,
    external: mem.external,
    arrayBuffers: mem.arrayBuffers,
    loadavg: os.loadavg(),
    dbFileSize,
  };
}

// Update gauges with current state counts
export async function updateCustomMetrics(chatClients, remotePlayers, dbFileSize) {
  const mem = process.memoryUsage();
  const [l1, l5, l15] = os.loadavg();

  uptimeGauge.set(process.uptime());
  rssGauge.set(mem.rss);
  heapUsedGauge.set(mem.heapUsed);
  load1Gauge.set(l1);
  load5Gauge.set(l5);
  load15Gauge.set(l15);
  if (dbFileSize === undefined) {
    dbFileSize = await readDbFileSize();
  }
  dbFileSizeGauge.set(dbFileSize);

  chatClientsGauge.set(chatClients);
  remotePlayersGauge.set(remotePlayers);
}

// Produce Prometheus formatted metrics string
export async function getPromMetrics() {
  return register.metrics();
}

export const promContentType = register.contentType;
