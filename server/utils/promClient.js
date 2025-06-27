export class Gauge {
  constructor({ name, help }) {
    this.name = name;
    this.help = help || '';
    this.value = 0;
    registerMetric(this);
  }
  set(value) {
    this.value = value;
  }
  get() {
    return `# HELP ${this.name} ${this.help}\n# TYPE ${this.name} gauge\n${this.name} ${this.value}`;
  }
}

export class Histogram {
  constructor({ name, help }) {
    this.name = name;
    this.help = help || '';
    registerMetric(this);
  }
  labels() {
    return this;
  }
  observe(value) {}
  get() {
    return `# HELP ${this.name} ${this.help}\n# TYPE ${this.name} histogram`;
  }
}

const metrics = [];
function registerMetric(metric) {
  metrics.push(metric);
}

export const register = {
  contentType: 'text/plain; version=0.0.4; charset=utf-8',
  metrics() {
    return metrics.map(m => m.get()).join('\n');
  }
};

export function collectDefaultMetrics() {}
