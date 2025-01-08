import si from "systeminformation";
import { CpuTelemetry } from "./interfaces";

export default async function getCpuTelemetry(): Promise<CpuTelemetry> {
  return {
    memory: await getMemoryInfo(),
    cpu: {
      currentLoad: await getCpuUsage(),
      temperature: await getCpuTemp(),
    },
  };
}

function getCpuTemp() {
  return si.cpuTemperature().then((temperatureData) => temperatureData.main);
}

function getMemoryInfo() {
  return si.mem().then((memoryData) => {
    return { total: memoryData.total, available: memoryData.available };
  });
}

function getCpuUsage() {
  return si.currentLoad().then((cpuData) => cpuData.currentLoad);
}
