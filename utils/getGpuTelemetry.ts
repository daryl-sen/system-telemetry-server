// Only works with nvidia GPUs, and `nvidia-smi` installed

import { exec } from "child_process";
import { GpuTelemetry } from "./interfaces";

const NVIDIA_SMI_COMMAND =
  "nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounit";

export default async function getGpuTelemetry(): Promise<GpuTelemetry | {}> {
  // Get GPU usage and temperature
  const gpuInfo = await executeNvidiaSmi();

  if (gpuInfo instanceof Error) {
    console.log("----------Error getting GPU telemetry----------");
    console.error(gpuInfo.message);
    console.log("----------Error getting GPU telemetry----------");
    return {};
  }

  return extractTelemetryData(gpuInfo);
}

function executeNvidiaSmi(): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    exec(NVIDIA_SMI_COMMAND, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr));
      return resolve(stdout);
    });
  });
}

function extractTelemetryData(stdout: string): GpuTelemetry {
  const [gpuUsage, vramUsed, vramTotal, gpuTemp] = stdout
    .split(",")
    .map(Number);

  return { gpuUsage, vramUsed, vramTotal, gpuTemp };
}
