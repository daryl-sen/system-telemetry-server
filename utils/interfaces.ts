export interface CpuTelemetry {
  memory: {
    total: number;
    available: number;
  },
  cpu: {
    currentLoad: number;
    temperature: number;
  },
  gpu?: {
    currentLoad: number;
    temperature: number;
  }
}

export interface GpuTelemetry {
  gpuUsage: number;
  vramUsed: number;
  vramTotal: number;
  gpuTemp: number;
}